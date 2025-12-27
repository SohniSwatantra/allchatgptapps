import { db } from '@/lib/db';
import { partners } from '@/lib/db/schema';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ApiErrors } from '@/lib/api/errors';
import { eq } from 'drizzle-orm';

export const GET = async () => {
  try {
    const data = await db
      .select()
      .from(partners)
      .where(eq(partners.isActive, true));

    return successResponse({ data });
  } catch (error) {
    console.error('Partners GET error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to fetch partners',
    });
  }
};
