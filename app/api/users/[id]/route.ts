import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users, products, posts } from '@/lib/db/schema';
import { updateUserSchema } from '@/lib/schemas/users';
import { idParamSchema } from '@/lib/schemas/common';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ApiErrors } from '@/lib/api/errors';
import { getAuthUser } from '@/lib/auth/getUser';
import { eq, sql } from 'drizzle-orm';

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
        message: 'Invalid user ID',
      });
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, validation.data.id))
      .limit(1);

    if (!user) {
      return errorResponse({
        ...ApiErrors.NOT_FOUND,
        message: 'User not found',
      });
    }

    // Get user statistics
    const [productsCount, postsCount] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(eq(products.userId, validation.data.id)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(posts)
        .where(eq(posts.userId, validation.data.id)),
    ]);

    return successResponse({
      data: {
        ...user,
        stats: {
          products: productsCount[0]?.count ?? 0,
          posts: postsCount[0]?.count ?? 0,
        },
      },
    });
  } catch (error) {
    console.error('User GET error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to fetch user',
    });
  }
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const authUser = await getAuthUser({ request });

    if (!authUser) {
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
        message: 'Invalid user ID',
      });
    }

    if (authUser.id !== idValidation.data.id) {
      return errorResponse({
        ...ApiErrors.FORBIDDEN,
        message: 'You can only update your own profile',
      });
    }

    const body = await request.json();
    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse({
        ...ApiErrors.VALIDATION_ERROR,
        message: 'Invalid user data',
        details: validation.error.flatten(),
      });
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, idValidation.data.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return successResponse({ data: updatedUser });
  } catch (error) {
    console.error('User PATCH error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to update user',
    });
  }
};
