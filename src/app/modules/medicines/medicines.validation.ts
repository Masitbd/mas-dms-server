import { z } from 'zod';
import { Types } from 'mongoose';

const createMedicineZodSchema = z.object({
  body: z.object({
    medicineId: z.string().optional(),
    name: z.string({
      required_error: 'Medicine name is required',
    }),
    genericName: z.string({
      required_error: 'Generic name is required',
    }),
    category: z.string({
      required_error: 'Category is required',
    }),
    supplierName: z.string({
      required_error: 'Supplier name is required',
    }),
    reOrderLevel: z.number({
      required_error: 'Reorder level is required',
    }),
    unit: z.string({
      required_error: 'Unit is required',
    }),
    openingBalance: z.number({
      required_error: 'Opening balance is required',
    }),
    openingBalanceDate: z.string({
      required_error: 'Opening balance date is required',
    }).datetime(),
    openingBalanceRate: z.number({
      required_error: 'Opening balance rate is required',
    }),
    salesRate: z.number({
      required_error: 'Sales rate is required',
    }),
    discount: z.number({
      required_error: 'Discount is required',
    }),
    alertQty: z.number({
      required_error: 'Alert quantity is required',
    }),
  }),
});

const updateMedicineZodSchema = z.object({
  body: z.object({
    medicineId: z.string().optional(),
    name: z.string().optional(),
    genericName: z.string().optional(),
    category: z.string().optional(),
    supplierName: z.string().optional(),
    reOrderLevel: z.number().optional(),
    unit: z.string().optional(),
    openingBalance: z.number().optional(),
    openingBalanceDate: z.string().datetime().optional(),
    openingBalanceRate: z.number().optional(),
    salesRate: z.number().optional(),
    discount: z.number().optional(),
    alertQty: z.number().optional(),
  }),
});

export const MedicineValidation = {
  createMedicineZodSchema,
  updateMedicineZodSchema,
};