import { db } from '@/lib/db';
import { products, posts, users, partners } from '@/lib/db/schema';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ApiErrors } from '@/lib/api/errors';
import { sql, eq } from 'drizzle-orm';

export const GET = async () => {
  try {
    const [
      productsResult,
      postsResult,
      usersResult,
      partnersResult,
      totalUpvotesResult,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(products),
      db.select({ count: sql<number>`count(*)::int` }).from(posts),
      db.select({ count: sql<number>`count(*)::int` }).from(users),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(partners)
        .where(eq(partners.isActive, true)),
      db
        .select({ total: sql<number>`coalesce(sum(${products.upvotes}), 0)::int` })
        .from(products),
    ]);

    const stats = {
      totalProducts: productsResult[0]?.count ?? 0,
      totalPosts: postsResult[0]?.count ?? 0,
      totalUsers: usersResult[0]?.count ?? 0,
      activePartners: partnersResult[0]?.count ?? 0,
      totalUpvotes: totalUpvotesResult[0]?.total ?? 0,
    };

    return successResponse({ data: stats });
  } catch (error) {
    console.error('Stats GET error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to fetch statistics',
    });
  }
};
