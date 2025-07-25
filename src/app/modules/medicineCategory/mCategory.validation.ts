import { z } from 'zod';

const createCategoryZodSchema = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    name: z.string({
      required_error: 'Category name is required',
    }),
  }),
});

const updateCategoryZodSchema = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    name: z.string().optional(),
  }),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};