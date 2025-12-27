import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { posts, likes } from '@/lib/db/schema';
import { idParamSchema } from '@/lib/schemas/common';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ApiErrors } from '@/lib/api/errors';
import { getAuthUser } from '@/lib/auth/getUser';
import { eq, and, sql } from 'drizzle-orm';

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const user = await getAuthUser({ request });

    if (!user) {
      return errorResponse({
        ...ApiErrors.UNAUTHORIZED,
        message: 'Authentication required to like a post',
      });
    }

    const { id } = await params;
    const validation = idParamSchema.safeParse({ id });

    if (!validation.success) {
      return errorResponse({
        ...ApiErrors.VALIDATION_ERROR,
        message: 'Invalid post ID',
      });
    }

    const postId = validation.data.id;

    // Check if post exists
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return errorResponse({
        ...ApiErrors.NOT_FOUND,
        message: 'Post not found',
      });
    }

    // Check for existing like
    const [existingLike] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, user.id), eq(likes.postId, postId)))
      .limit(1);

    if (existingLike) {
      // Remove like (toggle off)
      await db
        .delete(likes)
        .where(and(eq(likes.userId, user.id), eq(likes.postId, postId)));

      await db
        .update(posts)
        .set({ likes: sql`${posts.likes} - 1` })
        .where(eq(posts.id, postId));

      const [updatedPost] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1);

      return successResponse({
        data: {
          action: 'removed',
          liked: false,
          likes: updatedPost.likes,
        },
      });
    }

    // Add like
    await db.insert(likes).values({
      userId: user.id,
      postId,
    });

    await db
      .update(posts)
      .set({ likes: sql`${posts.likes} + 1` })
      .where(eq(posts.id, postId));

    const [updatedPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    return successResponse({
      data: {
        action: 'added',
        liked: true,
        likes: updatedPost.likes,
      },
      status: 201,
    });
  } catch (error) {
    console.error('Like POST error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to process like',
    });
  }
};
