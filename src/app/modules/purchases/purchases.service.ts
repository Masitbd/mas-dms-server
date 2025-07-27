import { IPurchase } from "./purchases.interface";
import { Purchase } from "./purchases.model";
import { PurchaseItem } from "../purchaseItems/purchaseItems.model";
import { Stock } from "../stock/stock.model";
import { generateInvoiceNo } from "../../../utils/generateInvoiceNo";

const createPurchase = async (payload: IPurchase): Promise<IPurchase> => {
  const { purchaseItems, ...purchaseData } = payload;
  purchaseData.invoiceNo = await generateInvoiceNo();
  const purchase = await Purchase.create(purchaseData);

  for (const item of purchaseItems) {
    item.purchaseId = purchase._id;
    const purchaseItem = await PurchaseItem.create({
      ...item,
      purchaseId: purchase?._id,
    });

    await Stock.create({
      productId: purchaseItem.medicineName,
      purchaseItemId: purchaseItem._id,
      batchNo: purchaseItem.batchNo,
      expiryDate: purchaseItem.dateExpire,
      quantityIn: purchaseItem.quantity,
      currentQuantity: purchaseItem.quantity,
    });
  }

  return purchase;
};

const getAllPurchases = async (): Promise<IPurchase[]> => {
  const result = await Purchase.find({}).populate("supplierId");
  return result;
};

const getSinglePurchase = async (id: string): Promise<IPurchase | null> => {
  const result = await Purchase.findById(id)
    .populate("supplierId")
    .populate("createdBy");
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
