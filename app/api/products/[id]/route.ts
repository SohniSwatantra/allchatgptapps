import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { updateProductSchema } from '@/lib/schemas/products';
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
        message: 'Invalid product ID',
      });
    }

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, validation.data.id))
      .limit(1);

    if (!product) {
      return errorResponse({
        ...ApiErrors.NOT_FOUND,
        message: 'Product not found',
      });
    }

    return successResponse({ data: product });
  } catch (error) {
    console.error('Product GET error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to fetch product',
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
        message: 'Invalid product ID',
      });
    }

    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, idValidation.data.id))
      .limit(1);

    if (!existingProduct) {
      return errorResponse({
        ...ApiErrors.NOT_FOUND,
        message: 'Product not found',
      });
    }

    if (existingProduct.userId !== user.id) {
      return errorResponse({
        ...ApiErrors.FORBIDDEN,
        message: 'You can only edit your own products',
      });
    }

    const body = await request.json();
    const validation = updateProductSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse({
        ...ApiErrors.VALIDATION_ERROR,
        message: 'Invalid product data',
        details: validation.error.flatten(),
      });
    }

    const [updatedProduct] = await db
      .update(products)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(products.id, idValidation.data.id))
      .returning();

    return successResponse({ data: updatedProduct });
  } catch (error) {
    console.error('Product PATCH error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to update product',
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
        message: 'Invalid product ID',
      });
    }

    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, validation.data.id))
      .limit(1);

    if (!existingProduct) {
      return errorResponse({
        ...ApiErrors.NOT_FOUND,
        message: 'Product not found',
      });
    }

    if (existingProduct.userId !== user.id) {
      return errorResponse({
        ...ApiErrors.FORBIDDEN,
        message: 'You can only delete your own products',
      });
    }

    await db.delete(products).where(eq(products.id, validation.data.id));

    return successResponse({ data: { deleted: true } });
  } catch (error) {
    console.error('Product DELETE error:', error);
    return errorResponse({
      ...ApiErrors.INTERNAL_ERROR,
      message: 'Failed to delete product',
    });
  }
};
