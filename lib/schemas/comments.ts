import { z } from 'zod';
import { paginationSchema } from './common';

export const commentQuerySchema = paginationSchema.extend({
  postId: z.coerce.number().positive(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  postId: z.number().positive(),
});

export type CommentQuery = z.infer<typeof commentQuerySchema>;
export type CreateComment = z.infer<typeof createCommentSchema>;
