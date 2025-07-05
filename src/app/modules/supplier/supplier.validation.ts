import { z } from 'zod';

const createSupplierZodSchema = z.object({
  body: z.object({
    supplierId: z.string().optional(),
    name: z.string({
      required_error: 'Supplier name is required',
    }),
    contactPerson: z.string({
      required_error: 'Contact person is required',
    }),
    address: z.string({
      required_error: 'Address is required',
    }),
    phone: z.string({
      required_error: 'Phone number is required',
    }),
    fax: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    email: z.string().email().optional(),
  }),
});

const updateSupplierZodSchema = z.object({
  body: z.object({
    supplierId: z.string().optional(),
    name: z.string().optional(),
    contactPerson: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    fax: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    email: z.string().email().optional(),
  }),
});

export const SupplierValidation = {
  createSupplierZodSchema,
  updateSupplierZodSchema,
};