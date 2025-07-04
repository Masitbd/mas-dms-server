import { Model } from 'mongoose';

export type ISupplier = {
  name: string;
  contactPerson: string;
  phone: string;
  address: string;
};

export type SupplierModel = Model<ISupplier, Record<string, unknown>>;