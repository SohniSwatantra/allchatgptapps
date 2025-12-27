import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { posts, users } from '@/lib/db/schema';
import { postQuerySchema, createPostSchema } from '@/lib/schemas/posts';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api/response';
import { ApiErrors } from '@/lib/api/errors';
import { getAuthUser } from '@/lib/auth/getUser';
import { eq, desc, asc, sql } from 'drizzle-orm';

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = postQuerySchema.safeParse(searchParams);

    if (!validation.success) {
      return errorResponse({
        ...ApiErrors.VALIDATION_ERROR,
        message: 'Invalid query parameters',
        details: validation.error.flatten(),
      });
    }

    const { page, limit, userId, sortBy, sortOrder } = validation.data;
    const offset = (page - 1) * limit;

    const orderColumn = sortBy === 'likes' ? posts.likes : posts.createdAt;
    const orderDirection = sortOrder === 'asc' ? asc : desc;

    const whereClause = userId ? eq(posts.userId, userId) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: posts.id,
          content: posts.content,
          likes: posts.likes,
          commentsCount: posts.commentsCount,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
          author: {
            id: users.id,
            name: users.name,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(posts)
        .leftJoin(users, eq(posts.userId, users.id))
        .where(whereClause)
        .orderBy(orderDirection(orderColumn))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(posts)
        .where(whereClause),
    ]);

    const total = countResult[0]?.count ?? 0;

    return paginatedResponse({ data, page, limit, total });
  } catch (error) {
    console.error('Posts GET error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to fetch posts',
    });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const user = await getAuthUser({ request });

    if (!user) {
      return errorResponse({
        ...ApiErrors.UNAUTHORIZED,
        message: 'Authentication required to create a post',
      });
    }

    const body = await request.json();
    const validation = createPostSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse({
        ...ApiErrors.VALIDATION_ERROR,
        message: 'Invalid post data',
        details: validation.error.flatten(),
      });
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        content: validation.data.content,
        userId: user.id,
        likes: 0,
        commentsCount: 0,
      })
      .returning();

    return successResponse({
      data: {
        ...newPost,
        author: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
      },
      status: 201,
    });
  } catch (error) {
    console.error('Posts POST error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to create post',
    });
  }
};
