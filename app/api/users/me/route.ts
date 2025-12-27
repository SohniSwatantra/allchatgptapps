import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ApiErrors } from '@/lib/api/errors';
import { getAuthUser } from '@/lib/auth/getUser';

export const GET = async (request: NextRequest) => {
  try {
    const user = await getAuthUser({ request });

    if (!user) {
      return errorResponse({
        ...ApiErrors.UNAUTHORIZED,
        message: 'Authentication required',
      });
    }

    return successResponse({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('User me GET error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to fetch user profile',
    });
  }
};
