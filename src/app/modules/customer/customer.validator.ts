// src/modules/customer/customer.validation.ts
import { z } from "zod";

const CustomerTypeEnum = z.enum(["Regular", "Patient", "Corporate"]);
const GenderEnum = z.enum(["Male", "Female", "Other", "Prefer not to say"]);

const phoneRegex = /^\+?\d{8,15}$/; // allow +, normalize in service/model
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const addressSchema = z
  .object({
    line1: z.string().max(120).optional(),
    line2: z.string().max(120).optional(),
    city: z.string().max(60).optional(),
    state: z.string().max(60).optional(),
    postalCode: z.string().max(12).optional(),
  })
  .optional();

const medicalSchema = z
  .object({
    allergies: z.string().max(200).optional(),
    chronicConditions: z.string().max(200).optional(),
  })
  .optional();

const createCustomerZodSchema = z.object({
  body: z
    .object({
      // uuid is auto-generated in DB, so NOT accepted from client
      customerType: CustomerTypeEnum.default("Patient"),

      fullName: z
        .string({ required_error: "Full name is required" })
        .min(2, "Full name is too short")
        .max(80, "Full name is too long"),

      phone: z
        .string({ required_error: "Phone is required" })
        .regex(phoneRegex, "Invalid phone number"),

      email: z.string().regex(emailRegex, "Invalid email format").optional(),

      dateOfBirth: z
        .union([z.string(), z.date(), z.null()])
        .optional()
        .transform((v) => {
          if (v === undefined) return undefined;
          if (v === null) return null;
          const d = v instanceof Date ? v : new Date(v);
          return Number.isNaN(d.getTime()) ? null : d;
        })
        .refine((d) => {
          if (d === undefined || d === null) return true;
          return d.getTime() <= Date.now();
        }, "DOB cannot be in the future"),

      gender: GenderEnum.optional(),

      nidOrPassport: z.string().max(40).optional(),

      address: addressSchema,

      loyaltyId: z.string().max(32).optional(),

      allowCredit: z
        .boolean({ required_error: "allowCredit is required" })
        .default(false),

      creditLimit: z
        .number()
        .min(0, "Credit limit cannot be negative")
        .max(10_000_000, "Credit limit is too high")
        .optional()
        .nullable(),

      discountPercent: z
        .number()
        .min(0, "Discount cannot be negative")
        .max(100, "Discount cannot exceed 100")
        .optional()
        .nullable(),

      medical: medicalSchema,

      notes: z.string().max(800).optional(),

      isActive: z
        .boolean({ required_error: "isActive is required" })
        .default(true),
    })
    // enforce credit policy at validation level too
    .superRefine((val, ctx) => {
      if (val.allowCredit) {
        if (val.creditLimit === null || val.creditLimit === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "creditLimit is required when allowCredit is true",
            path: ["creditLimit"],
          });
        }
      }
    }),
});

const updateCustomerZodSchema = z.object({
  body: z
    .object({
      // uuid not updatable (immutable)
      customerType: CustomerTypeEnum.optional(),

      fullName: z.string().min(2).max(80).optional(),

      phone: z.string().regex(phoneRegex, "Invalid phone number").optional(),

      email: z
        .union([z.string().regex(emailRegex), z.literal(""), z.null()])
        .optional(),

      dateOfBirth: z
        .union([z.string(), z.date(), z.null()])
        .optional()
        .transform((v) => {
          if (v === undefined) return undefined;
          if (v === null) return null;
          const d = v instanceof Date ? v : new Date(v);
          return Number.isNaN(d.getTime()) ? null : d;
        })
        .refine((d) => {
          if (d === undefined || d === null) return true;
          return d.getTime() <= Date.now();
        }, "DOB cannot be in the future"),

      gender: GenderEnum.optional(),

      nidOrPassport: z.string().max(40).optional(),

      address: z
        .object({
          line1: z.string().max(120).optional(),
          line2: z.string().max(120).optional(),
          city: z.string().max(60).optional(),
          state: z.string().max(60).optional(),
          postalCode: z.string().max(12).optional(),
        })
        .optional(),

      loyaltyId: z.string().max(32).optional(),

      allowCredit: z.boolean().optional(),

      creditLimit: z.number().min(0).max(10_000_000).nullable().optional(),

      discountPercent: z.number().min(0).max(100).nullable().optional(),

      medical: z
        .object({
          allergies: z.string().max(200).optional(),
          chronicConditions: z.string().max(200).optional(),
        })
        .optional(),

      notes: z.string().max(800).optional(),

      isActive: z.boolean().optional(),
    })
    .superRefine((val, ctx) => {
      // if allowCredit is being set to true in patch, require creditLimit in same request
      if (val.allowCredit === true && val.creditLimit === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "creditLimit is required when allowCredit is true",
          path: ["creditLimit"],
        });
      }
      // if allowCredit is being set to false, creditLimit can be omitted; DB will force 0
      if (val.creditLimit != null && val.creditLimit < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "creditLimit cannot be negative",
          path: ["creditLimit"],
        });
      }
    }),
});

export const CustomerValidation = {
  createCustomerZodSchema,
  updateCustomerZodSchema,
};
