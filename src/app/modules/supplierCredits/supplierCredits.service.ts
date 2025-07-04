import { ISupplierCredit } from './supplierCredits.interface';
import { SupplierCredit } from './supplierCredits.model';

const createSupplierCredit = async (payload: ISupplierCredit): Promise<ISupplierCredit> => {
  const result = await SupplierCredit.create(payload);
  return result;
};

const getAllSupplierCredits = async (): Promise<ISupplierCredit[]> => {
  const result = await SupplierCredit.find({}).populate('supplierId').populate('returnId').populate('usedOnPayment');
  return result;
};

const getSingleSupplierCredit = async (id: string): Promise<ISupplierCredit | null> => {
  const result = await SupplierCredit.findById(id).populate('supplierId').populate('returnId').populate('usedOnPayment');
  return result;
};

const updateSupplierCredit = async (
  id: string,
  payload: Partial<ISupplierCredit>
): Promise<ISupplierCredit | null> => {
  const result = await SupplierCredit.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteSupplierCredit = async (id: string): Promise<ISupplierCredit | null> => {
  const result = await SupplierCredit.findByIdAndDelete(id);
  return result;
};

export const SupplierCreditService = {
  createSupplierCredit,
  getAllSupplierCredits,
  getSingleSupplierCredit,
  updateSupplierCredit,
  deleteSupplierCredit,
};
