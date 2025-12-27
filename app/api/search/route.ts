import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api/response';
import { ApiErrors } from '@/lib/api/errors';
import { ilike, or, and, eq, sql, desc } from 'drizzle-orm';
import { z } from 'zod';

const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  category: z.string().optional(),
});

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = searchQuerySchema.safeParse(searchParams);

    if (!validation.success) {
      return errorResponse({
        ...ApiErrors.VALIDATION_ERROR,
        message: 'Invalid search parameters',
        details: validation.error.flatten(),
      });
    }

    const { q, page, limit, category } = validation.data;
    const offset = (page - 1) * limit;

    const searchPattern = `%${q}%`;

    const conditions = [
      eq(products.isApproved, true),
      or(
        ilike(products.name, searchPattern),
        ilike(products.description, searchPattern),
        ilike(products.tagline, searchPattern)
      ),
    ];

    if (category) {
      conditions.push(eq(products.category, category));
    }

    const whereClause = and(...conditions);

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(products)
        .where(whereClause)
        .orderBy(desc(products.upvotes))
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
    console.error('Search GET error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to search products',
    });
  }
};
