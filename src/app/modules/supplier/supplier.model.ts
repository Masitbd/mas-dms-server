import { Schema, model } from 'mongoose';
import { ISupplier, SupplierModel } from './supplier.interface';

const supplierSchema = new Schema<ISupplier, SupplierModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
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