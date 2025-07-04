import { IPurchaseReturnItem } from './purchaseReturnItems.interface';
import { PurchaseReturnItem } from './purchaseReturnItems.model';

const createPurchaseReturnItem = async (payload: IPurchaseReturnItem): Promise<IPurchaseReturnItem> => {
  const result = await PurchaseReturnItem.create(payload);
  return result;
};

const getAllPurchaseReturnItems = async (): Promise<IPurchaseReturnItem[]> => {
  const result = await PurchaseReturnItem.find({}).populate('returnId').populate('purchaseItemId');
  return result;
};

const getSinglePurchaseReturnItem = async (id: string): Promise<IPurchaseReturnItem | null> => {
  const result = await PurchaseReturnItem.findById(id).populate('returnId').populate('purchaseItemId');
  return result;
};

const updatePurchaseReturnItem = async (
  id: string,
  payload: Partial<IPurchaseReturnItem>
): Promise<IPurchaseReturnItem | null> => {
  const result = await PurchaseReturnItem.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deletePurchaseReturnItem = async (id: string): Promise<IPurchaseReturnItem | null> => {
  const result = await PurchaseReturnItem.findByIdAndDelete(id);
  return result;
};

export const PurchaseReturnItemService = {
  createPurchaseReturnItem,
  getAllPurchaseReturnItems,
  getSinglePurchaseReturnItem,
  updatePurchaseReturnItem,
  deletePurchaseReturnItem,
};
