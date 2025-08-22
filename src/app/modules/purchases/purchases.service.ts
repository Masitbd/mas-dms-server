import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../helpers/paginationHelper";
import { IGenericResponse } from "../../interface/common";
import { IPaginationOptions } from "../../interface/pagination";
import { generateInvoiceNo } from "../../../utils/generateInvoiceNo";
import { PurchaseItem } from "../purchaseItems/purchaseItems.model";
import { Stock } from "../stock/stock.model";
import { IPurchase, IPurchaseFilters } from "./purchases.interface";
import { Purchase } from "./purchases.model";
import { PurchasePayment } from "../purchasePayments/purchasePayments.model";
import { IPurchaseItem } from "../purchaseItems/purchaseItems.interface";

const createPurchase = async (payload: IPurchase): Promise<IPurchase> => {
  const { purchaseItems, ...purchaseData } = payload;
  // if (payload.paidAmount == payload.totalAmount)
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
      salesRate: purchaseItem.salesRate,
    });
  }

  if (payload.paidAmount > 0) {
    await PurchasePayment.create({
      amount: payload.paidAmount,
      method: "cash",
      note: "Initial Payment",
      paymentDate: new Date(),
      purchaseId: purchase?._id,
    });
  }
  return purchase;
};

const getAllPurchases = async (
  filters: IPurchaseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPurchase[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: [
        {
          invoiceNo: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ],
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Purchase.find(whereConditions)
    .populate("supplierId")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Purchase.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSinglePurchase = async (id: string): Promise<IPurchase | null> => {
  const result = await Purchase.findById(id);

  return result;
};

const updatePurchase = async (
  id: string,
  payload: Partial<IPurchase>
): Promise<IPurchase | null> => {
  const { purchaseItems, ...purchaseData } = payload;

  const purchase = await Purchase.findById(id);
  if (!purchase) {
    throw new Error("Purchase not found");
  }

  // Update purchase data
  Object.assign(purchase, purchaseData);
  await purchase.save();

  // Update purchase payment if paidAmount is changed
  if (purchaseData.paidAmount && purchaseData.paidAmount > 0) {
    const purchasePayment = await PurchasePayment.findOne({ purchaseId: id });
    if (purchasePayment) {
      purchasePayment.amount = purchaseData.paidAmount;
      await purchasePayment.save();
    } else {
      await PurchasePayment.create({
        amount: purchaseData.paidAmount,
        method: "cash",
        note: "Updated Payment",
        paymentDate: new Date(),
        purchaseId: id,
      });
    }
  }

  // Compare and update purchase items and stock
  if (purchaseItems) {
    await updatePurchaseItemsAndStock(id, purchaseItems);
  }

  return purchase;
};

async function updatePurchaseItemsAndStock(
  purchaseId: string,
  newPurchaseItems: IPurchaseItem[]
) {
  const oldPurchaseItems = await PurchaseItem.find({ purchaseId });

  for (const newItem of newPurchaseItems) {
    const oldItem = oldPurchaseItems.find(
      (item) => item._id.toString() === newItem?._id?.toString()
    );

    if (oldItem) {
      const quantityDifference = newItem.quantity - oldItem.quantity;

      if (quantityDifference !== 0) {
        const stock = await Stock.findOne({ purchaseItemId: oldItem._id });
        if (stock) {
          stock.quantityIn += quantityDifference;
          stock.currentQuantity += quantityDifference;
          stock.salesRate = newItem.salesRate as number;
          await stock.save();
        }
      }

      Object.assign(oldItem, newItem);
      await oldItem.save();
    } else {
      const createdItem = await PurchaseItem.create({
        ...newItem,
        purchaseId,
      });
      await Stock.create({
        productId: createdItem.medicineName,
        purchaseItemId: createdItem._id,
        batchNo: createdItem.batchNo,
        expiryDate: createdItem.dateExpire,
        quantityIn: createdItem.quantity,
        currentQuantity: createdItem.quantity,
        salesRate: createdItem.salesRate,
      });
    }
  }

  for (const oldItem of oldPurchaseItems) {
    const newItem = newPurchaseItems.find(
      (item) => item?._id?.toString() === oldItem._id.toString()
    );
    if (!newItem) {
      await Stock.deleteOne({ purchaseItemId: oldItem._id });
      await PurchaseItem.findByIdAndDelete(oldItem._id);
    }
  }
}

const deletePurchase = async (id: string): Promise<IPurchase | null> => {
  const result = await Purchase.findByIdAndDelete(id);
  return result;
};

const getPurchaseForInvoiceAndView = async (id: string) => {
  const purchaseInfo = await Purchase.findById(id).populate("supplierId");
  const purchaseItemInfo = await PurchaseItem.find({
    purchaseId: purchaseInfo?._id,
  })
    .populate("medicineName")
    .populate({
      path: "medicineName",
      populate: {
        path: "category",
        model: "Category",
      },
    });

  return {
    purchaseInfo,
    purchaseItemInfo,
  };
};
export const PurchaseService = {
  createPurchase,
  getAllPurchases,
  getSinglePurchase,
  updatePurchase,
  deletePurchase,
  getPurchaseForInvoiceAndView,
};
