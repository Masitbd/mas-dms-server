import { z } from 'zod';

const createGenericZodSchema = z.object({
  body: z.object({
    genericId: z.string().optional(),
    name: z.string({
      required_error: 'Generic name is required',
    }),
  }),
});

const updateGenericZodSchema = z.object({
  body: z.object({
    genericId: z.string().optional(),
    name: z.string().optional(),
  }),
});

export const GenericValidation = {
  createGenericZodSchema,
  updateGenericZodSchema,
};