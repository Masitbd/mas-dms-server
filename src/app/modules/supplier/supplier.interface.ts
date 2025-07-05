import { Model } from 'mongoose';

export type ISupplier = {
  supplierId: string;
  name: string;
  contactPerson: string;
  address: string;
  phone: string;
  fax?: string;
  city?: string;
  country?: string;
  email?: string;
};

export type SupplierModel = Model<ISupplier, Record<string, unknown>>;