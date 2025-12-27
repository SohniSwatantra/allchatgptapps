import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const timeRangeSchema = z.enum(['daily', 'weekly', 'monthly', 'yearly']).default('daily');

export const idParamSchema = z.object({
  id: z.coerce.number().positive(),
});

export const sortOrderSchema = z.enum(['asc', 'desc']).default('desc');

export type PaginationParams = z.infer<typeof paginationSchema>;
export type TimeRange = z.infer<typeof timeRangeSchema>;
export type SortOrder = z.infer<typeof sortOrderSchema>;
