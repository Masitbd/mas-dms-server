import { Schema, model } from 'mongoose';
import { IMedicine, MedicineModel } from './medicines.interface';

const medicineSchema = new Schema<IMedicine, MedicineModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    genericName: {
      type: Schema.Types.ObjectId,
      ref: 'Generic',
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    alertQty: {
      type: Number,
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

export const Medicine = model<IMedicine, MedicineModel>(
  'Medicine',
  medicineSchema
);
