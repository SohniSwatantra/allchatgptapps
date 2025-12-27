import { z } from 'zod';
import { paginationSchema, sortOrderSchema } from './common';

export const postQuerySchema = paginationSchema.extend({
  userId: z.coerce.number().optional(),
  sortBy: z.enum(['likes', 'createdAt']).default('createdAt'),
  sortOrder: sortOrderSchema,
});

export const createPostSchema = z.object({
  content: z.string().min(1).max(2000),
});

export const updatePostSchema = z.object({
  content: z.string().min(1).max(2000),
});

export type PostQuery = z.infer<typeof postQuerySchema>;
export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
