import { z } from 'zod';
import { paginationSchema } from './common';

export const commentQuerySchema = paginationSchema.extend({
  postId: z.coerce.number().optional(),
  productId: z.coerce.number().optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  postId: z.number().positive().optional(),
  productId: z.number().positive().optional(),
}).refine(
  (data) => (data.postId !== undefined) !== (data.productId !== undefined),
  { message: 'Exactly one of postId or productId must be provided' }
);

export type CommentQuery = z.infer<typeof commentQuerySchema>;
export type CreateComment = z.infer<typeof createCommentSchema>;
