import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { comments, posts } from '@/lib/db/schema';
import { idParamSchema } from '@/lib/schemas/common';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ApiErrors } from '@/lib/api/errors';
import { getAuthUser } from '@/lib/auth/getUser';
import { eq, sql } from 'drizzle-orm';

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
        message: 'Invalid comment ID',
      });
    }

    const [existingComment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, validation.data.id))
      .limit(1);

    if (!existingComment) {
      return errorResponse({
        ...ApiErrors.NOT_FOUND,
        message: 'Comment not found',
      });
    }

    if (existingComment.userId !== user.id) {
      return errorResponse({
        ...ApiErrors.FORBIDDEN,
        message: 'You can only delete your own comments',
      });
    }

    await db.delete(comments).where(eq(comments.id, validation.data.id));

    // Decrement post comment count
    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} - 1` })
      .where(eq(posts.id, existingComment.postId));

    return successResponse({ data: { deleted: true } });
  } catch (error) {
    console.error('Comment DELETE error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to delete comment',
    });
  }
};
