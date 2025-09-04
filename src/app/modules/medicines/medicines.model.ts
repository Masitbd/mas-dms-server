import { Schema, model } from "mongoose";
import { IMedicine, MedicineModel } from "./medicines.interface";

const medicineSchema = new Schema<IMedicine, MedicineModel>(
  {
    medicineId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    genericName: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    supplierName: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    reOrderLevel: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    openingBalance: {
      type: Number,
      required: true,
    },
    openingBalanceDate: {
      type: Date,
      required: true,
    },
    openingBalanceRate: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
    },
    alertQty: {
      type: Number,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Medicine = model<IMedicine, MedicineModel>(
  "Medicine",
  medicineSchema
);
