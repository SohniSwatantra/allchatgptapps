import { z } from 'zod';
import { paginationSchema, timeRangeSchema, sortOrderSchema } from './common';

export const productQuerySchema = paginationSchema.extend({
  timeRange: timeRangeSchema.optional(),
  category: z.string().optional(),
  isApproved: z.coerce.boolean().optional(),
  sortBy: z.enum(['upvotes', 'createdAt', 'rank', 'name']).default('upvotes'),
  sortOrder: sortOrderSchema,
});

export const createProductSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  iconUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().max(100).optional(),
  launchDate: z.coerce.date().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type ProductQuery = z.infer<typeof productQuerySchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
