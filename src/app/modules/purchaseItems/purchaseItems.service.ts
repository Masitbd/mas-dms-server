import mongoose, { Mongoose, Schema } from "mongoose";
import { IPurchaseItem } from "./purchaseItems.interface";
import { PurchaseItem } from "./purchaseItems.model";

const createPurchaseItem = async (
  payload: IPurchaseItem
): Promise<IPurchaseItem> => {
  const result = await PurchaseItem.create(payload);
  return result;
};

const getAllPurchaseItems = async (): Promise<IPurchaseItem[]> => {
  const result = await PurchaseItem.find({})
    .populate("purchaseId")
    .populate("productId");
  return result;
};

const getSinglePurchaseItem = async (
  id: string
): Promise<IPurchaseItem | null> => {
  const result = await PurchaseItem.findById(id)
    .populate("purchaseId")
    .populate("productId");
  return result;
};

const updatePurchaseItem = async (
  id: string,
  payload: Partial<IPurchaseItem>
): Promise<IPurchaseItem | null> => {
  const result = await PurchaseItem.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deletePurchaseItem = async (
  id: string
): Promise<IPurchaseItem | null> => {
  const result = await PurchaseItem.findByIdAndDelete(id);
  return result;
};

const getPurchaseItemForSinglePurchase = async (
  id: string
): Promise<IPurchaseItem[] | null> => {
  console.log(id);
  const result = await PurchaseItem.find({
    purchaseId: new mongoose.Types.ObjectId(id),
  });
  return result;
};

export const PurchaseItemService = {
  createPurchaseItem,
  getAllPurchaseItems,
  getSinglePurchaseItem,
  updatePurchaseItem,
  deletePurchaseItem,
  getPurchaseItemForSinglePurchase,
};
