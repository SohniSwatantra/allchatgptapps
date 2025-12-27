import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { posts, users } from '@/lib/db/schema';
import { updatePostSchema } from '@/lib/schemas/posts';
import { idParamSchema } from '@/lib/schemas/common';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ApiErrors } from '@/lib/api/errors';
import { getAuthUser } from '@/lib/auth/getUser';
import { eq } from 'drizzle-orm';

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const validation = idParamSchema.safeParse({ id });

    if (!validation.success) {
      return errorResponse({
        ...ApiErrors.VALIDATION_ERROR,
        message: 'Invalid post ID',
      });
    }

    const [post] = await db
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
      .where(eq(posts.id, validation.data.id))
      .limit(1);

    if (!post) {
      return errorResponse({
        ...ApiErrors.NOT_FOUND,
        message: 'Post not found',
      });
    }

    return successResponse({ data: post });
  } catch (error) {
    console.error('Post GET error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to fetch post',
    });
  }
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const user = await getAuthUser({ request });

    if (!user) {
      return errorResponse({
        ...ApiErrors.UNAUTHORIZED,
        message: 'Authentication required',
      });
    }

    const { id } = await params;
    const idValidation = idParamSchema.safeParse({ id });

    if (!idValidation.success) {
      return errorResponse({
        ...ApiErrors.VALIDATION_ERROR,
        message: 'Invalid post ID',
      });
    }

    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, idValidation.data.id))
      .limit(1);

    if (!existingPost) {
      return errorResponse({
        ...ApiErrors.NOT_FOUND,
        message: 'Post not found',
      });
    }

    if (existingPost.userId !== user.id) {
      return errorResponse({
        ...ApiErrors.FORBIDDEN,
        message: 'You can only edit your own posts',
      });
    }

    const body = await request.json();
    const validation = updatePostSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse({
        ...ApiErrors.VALIDATION_ERROR,
        message: 'Invalid post data',
        details: validation.error.flatten(),
      });
    }

    const [updatedPost] = await db
      .update(posts)
      .set({
        content: validation.data.content,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, idValidation.data.id))
      .returning();

    return successResponse({ data: updatedPost });
  } catch (error) {
    console.error('Post PATCH error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to update post',
    });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const user = await getAuthUser({ request });

    if (!user) {
      return errorResponse({
        ...ApiErrors.UNAUTHORIZED,
        message: 'Authentication required',
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

    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, validation.data.id))
      .limit(1);

    if (!existingPost) {
      return errorResponse({
        ...ApiErrors.NOT_FOUND,
        message: 'Post not found',
      });
    }

    if (existingPost.userId !== user.id) {
      return errorResponse({
        ...ApiErrors.FORBIDDEN,
        message: 'You can only delete your own posts',
      });
    }

    await db.delete(posts).where(eq(posts.id, validation.data.id));

    return successResponse({ data: { deleted: true } });
  } catch (error) {
    console.error('Post DELETE error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to delete post',
    });
  }
};
