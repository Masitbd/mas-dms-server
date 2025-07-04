import { IPurchase } from './purchases.interface';
import { Purchase } from './purchases.model';

const createPurchase = async (payload: IPurchase): Promise<IPurchase> => {
  const result = await Purchase.create(payload);
  return result;
};

const getAllPurchases = async (): Promise<IPurchase[]> => {
  const result = await Purchase.find({}).populate('supplierId').populate('createdBy');
  return result;
};

const getSinglePurchase = async (id: string): Promise<IPurchase | null> => {
  const result = await Purchase.findById(id).populate('supplierId').populate('createdBy');
  return result;
};

const updatePurchase = async (
  id: string,
  payload: Partial<IPurchase>
): Promise<IPurchase | null> => {
  const result = await Purchase.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deletePurchase = async (id: string): Promise<IPurchase | null> => {
  const result = await Purchase.findByIdAndDelete(id);
  return result;
};

export const PurchaseService = {
  createPurchase,
  getAllPurchases,
  getSinglePurchase,
  updatePurchase,
  deletePurchase,
};
