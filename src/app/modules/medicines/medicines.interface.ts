import { Model, Types } from 'mongoose';

export type IMedicine = {
  name: string;
  genericName: Types.ObjectId;
  category: Types.ObjectId;
  unit: string;
  alertQty: number;
};

export type MedicineModel = Model<IMedicine, Record<string, unknown>>;
