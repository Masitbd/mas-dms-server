import { TSupplier } from "./supplier.interface";
import { Supplier } from "./supplier.model";

const createSupplierIntoDB = async (payload: TSupplier) => {
  return Supplier.create(payload);
};

export const supplierServices = {
  createSupplierIntoDB,
};
