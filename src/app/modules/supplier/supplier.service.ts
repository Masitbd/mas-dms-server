import { ISupplier } from './supplier.interface';
import { Supplier } from './supplier.model';

const createSupplier = async (payload: ISupplier): Promise<ISupplier> => {
  const result = await Supplier.create(payload);
  return result;
};

const getAllSuppliers = async (): Promise<ISupplier[]> => {
  const result = await Supplier.find({});
  return result;
};

const getSingleSupplier = async (id: string): Promise<ISupplier | null> => {
  const result = await Supplier.findById(id);
  return result;
};

const updateSupplier = async (
  id: string,
  payload: Partial<ISupplier>
): Promise<ISupplier | null> => {
  const result = await Supplier.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteSupplier = async (id: string): Promise<ISupplier | null> => {
  const result = await Supplier.findByIdAndDelete(id);
  return result;
};

export const SupplierService = {
  createSupplier,
  getAllSuppliers,
  getSingleSupplier,
  updateSupplier,
  deleteSupplier,
};