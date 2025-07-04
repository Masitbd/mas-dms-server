import { IPurchaseReturn } from './purchaseReturns.interface';
import { PurchaseReturn } from './purchaseReturns.model';

const createPurchaseReturn = async (payload: IPurchaseReturn): Promise<IPurchaseReturn> => {
  const result = await PurchaseReturn.create(payload);
  return result;
};

const getAllPurchaseReturns = async (): Promise<IPurchaseReturn[]> => {
  const result = await PurchaseReturn.find({}).populate('purchaseId').populate('createdBy');
  return result;
};

const getSinglePurchaseReturn = async (id: string): Promise<IPurchaseReturn | null> => {
  const result = await PurchaseReturn.findById(id).populate('purchaseId').populate('createdBy');
  return result;
};

const updatePurchaseReturn = async (
  id: string,
  payload: Partial<IPurchaseReturn>
): Promise<IPurchaseReturn | null> => {
  const result = await PurchaseReturn.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deletePurchaseReturn = async (id: string): Promise<IPurchaseReturn | null> => {
  const result = await PurchaseReturn.findByIdAndDelete(id);
  return result;
};

export const PurchaseReturnService = {
  createPurchaseReturn,
  getAllPurchaseReturns,
  getSinglePurchaseReturn,
  updatePurchaseReturn,
  deletePurchaseReturn,
};
