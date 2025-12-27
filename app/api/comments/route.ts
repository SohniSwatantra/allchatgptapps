import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { comments, users, posts } from '@/lib/db/schema';
import { commentQuerySchema, createCommentSchema } from '@/lib/schemas/comments';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api/response';
import { ApiErrors } from '@/lib/api/errors';
import { getAuthUser } from '@/lib/auth/getUser';
import { eq, desc, sql } from 'drizzle-orm';

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = commentQuerySchema.safeParse(searchParams);

    if (!validation.success) {
      return errorResponse({
        ...ApiErrors.VALIDATION_ERROR,
        message: 'Invalid query parameters',
        details: validation.error.flatten(),
      });
    }

    const { postId, page, limit } = validation.data;
    const offset = (page - 1) * limit;

    const whereClause = eq(comments.postId, postId);

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: comments.id,
          content: comments.content,
          createdAt: comments.createdAt,
          author: {
            id: users.id,
            name: users.name,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(comments)
        .leftJoin(users, eq(comments.userId, users.id))
        .where(whereClause)
        .orderBy(desc(comments.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(comments)
        .where(whereClause),
    ]);

    const total = countResult[0]?.count ?? 0;

    return paginatedResponse({ data, page, limit, total });
  } catch (error) {
    console.error('Comments GET error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to fetch comments',
    });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const user = await getAuthUser({ request });

    if (!user) {
      return errorResponse({
        ...ApiErrors.UNAUTHORIZED,
        message: 'Authentication required to comment',
      });
    }

    const body = await request.json();
    const validation = createCommentSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse({
        ...ApiErrors.VALIDATION_ERROR,
        message: 'Invalid comment data',
        details: validation.error.flatten(),
      });
    }

    // Check if post exists
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, validation.data.postId))
      .limit(1);

    if (!post) {
      return errorResponse({
        ...ApiErrors.NOT_FOUND,
        message: 'Post not found',
      });
    }

    // Create comment and update post comment count
    const [newComment] = await db
      .insert(comments)
      .values({
        content: validation.data.content,
        postId: validation.data.postId,
        userId: user.id,
      })
      .returning();

    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} + 1` })
      .where(eq(posts.id, validation.data.postId));

    return successResponse({
      data: {
        ...newComment,
        author: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
      },
      status: 201,
    });
  } catch (error) {
    console.error('Comments POST error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to create comment',
    });
  }
};
