import { Model, Types } from "mongoose";

export type IMedicine = {
  medicineId: string;
  name: string;
  genericName: string;
  category: Types.ObjectId;
  supplierName: Types.ObjectId;
  reOrderLevel: number;
  unit: string;
  openingBalance: number;
  openingBalanceDate: Date;
  openingBalanceRate: number;
  salesRate: number;
  discount: number;
  alertQty: number;
  isDeleted: boolean;
};

export type MedicineModel = Model<IMedicine, Record<string, unknown>>;
