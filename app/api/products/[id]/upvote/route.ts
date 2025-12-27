import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { products, upvotes } from '@/lib/db/schema';
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
        message: 'Authentication required to upvote',
      });
    }

    const { id } = await params;
    const validation = idParamSchema.safeParse({ id });

    if (!validation.success) {
      return errorResponse({
        ...ApiErrors.VALIDATION_ERROR,
        message: 'Invalid product ID',
      });
    }

    const productId = validation.data.id;

    // Check if product exists
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      return errorResponse({
        ...ApiErrors.NOT_FOUND,
        message: 'Product not found',
      });
    }

    // Check for existing upvote
    const [existingUpvote] = await db
      .select()
      .from(upvotes)
      .where(and(eq(upvotes.userId, user.id), eq(upvotes.productId, productId)))
      .limit(1);

    if (existingUpvote) {
      // Remove upvote (toggle off)
      await db
        .delete(upvotes)
        .where(and(eq(upvotes.userId, user.id), eq(upvotes.productId, productId)));

      await db
        .update(products)
        .set({ upvotes: sql`${products.upvotes} - 1` })
        .where(eq(products.id, productId));

      const [updatedProduct] = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      return successResponse({
        data: {
          action: 'removed',
          upvoted: false,
          upvotes: updatedProduct.upvotes,
        },
      });
    }

    // Add upvote
    await db.insert(upvotes).values({
      userId: user.id,
      productId,
    });

    await db
      .update(products)
      .set({ upvotes: sql`${products.upvotes} + 1` })
      .where(eq(products.id, productId));

    const [updatedProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    return successResponse({
      data: {
        action: 'added',
        upvoted: true,
        upvotes: updatedProduct.upvotes,
      },
      status: 201,
    });
  } catch (error) {
    console.error('Upvote POST error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to process upvote',
    });
  }
};
