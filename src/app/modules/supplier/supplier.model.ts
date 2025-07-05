import { Schema, model } from 'mongoose';
import { ISupplier, SupplierModel } from './supplier.interface';

const supplierSchema = new Schema<ISupplier, SupplierModel>(
  {
    supplierId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    fax: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Supplier = model<ISupplier, SupplierModel>(
  'Supplier',
  supplierSchema
);