import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { productQuerySchema, createProductSchema } from '@/lib/schemas/products';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api/response';
import { ApiErrors } from '@/lib/api/errors';
import { getAuthUser } from '@/lib/auth/getUser';
import { eq, desc, asc, gte, and, sql } from 'drizzle-orm';

const getTimeRangeDate = ({ timeRange }: { timeRange: string }): Date => {
  const now = new Date();
  switch (timeRange) {
    case 'daily':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case 'weekly':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'monthly':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'yearly':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }
};

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = productQuerySchema.safeParse(searchParams);

    if (!validation.success) {
      return errorResponse({
        ...ApiErrors.VALIDATION_ERROR,
        message: 'Invalid query parameters',
        details: validation.error.flatten(),
      });
    }

    const { page, limit, timeRange, category, sortBy, sortOrder, isApproved } = validation.data;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (timeRange) {
      conditions.push(gte(products.createdAt, getTimeRangeDate({ timeRange })));
    }

    if (category) {
      conditions.push(eq(products.category, category));
    }

    if (isApproved !== undefined) {
      conditions.push(eq(products.isApproved, isApproved));
    } else {
      // Default to showing only approved products
      conditions.push(eq(products.isApproved, true));
    }

    const orderColumn =
      sortBy === 'upvotes'
        ? products.upvotes
        : sortBy === 'rank'
          ? products.rank
          : sortBy === 'name'
            ? products.name
            : products.createdAt;

    const orderDirection = sortOrder === 'asc' ? asc : desc;
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(products)
        .where(whereClause)
        .orderBy(orderDirection(orderColumn))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(whereClause),
    ]);

    const total = countResult[0]?.count ?? 0;

    return paginatedResponse({ data, page, limit, total });
  } catch (error) {
    console.error('Products GET error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to fetch products',
    });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const user = await getAuthUser({ request });

    if (!user) {
      return errorResponse({
        ...ApiErrors.UNAUTHORIZED,
        message: 'Authentication required to create a product',
      });
    }

    const body = await request.json();
    const validation = createProductSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse({
        ...ApiErrors.VALIDATION_ERROR,
        message: 'Invalid product data',
        details: validation.error.flatten(),
      });
    }

    const [newProduct] = await db
      .insert(products)
      .values({
        ...validation.data,
        userId: user.id,
        isApproved: false,
        upvotes: 0,
      })
      .returning();

    return successResponse({ data: newProduct, status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to create product',
    });
  }
};
