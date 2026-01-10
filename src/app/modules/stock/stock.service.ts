import { Schema, Types } from "mongoose";
import { IStock } from "./stock.interface";
import { Stock } from "./stock.model";

const createStock = async (payload: IStock): Promise<IStock> => {
  const result = await Stock.create(payload);
  return result;
};

const getAllStocks = async (): Promise<IStock[]> => {
  const result = await Stock.find({})
    .populate({
      path: "productId",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .select("productId");
  return result;
};

const getSingleStock = async (id: string): Promise<IStock[] | null> => {
  const result = await Stock.find({ productId: id });

  return result;
};

const updateStock = async (
  id: string,
  payload: Partial<IStock>
): Promise<IStock | null> => {
  const result = await Stock.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteStock = async (id: string): Promise<IStock | null> => {
  const result = await Stock.findByIdAndDelete(id);
  return result;
};

const getStockByMedicineName = async (id: string) => {
  return await Stock.aggregate([
    {
      $match: {
        productId: new Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "medicines",
        localField: "productId",
        foreignField: "_id",
        as: "productId",
      },
    },
    {
      $unwind: {
        path: "$productId",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "productId.category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "generics",
        localField: "productId.genericName",
        foreignField: "_id",
        as: "generic",
      },
    },

    {
      $unwind: {
        path: "$generic",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "suppliers",
        localField: "supplierName",
        foreignField: "_id",
        as: "suppler",
      },
    },
    {
      $unwind: {
        path: "$supplier",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
};

export const StockService = {
  createStock,
  getAllStocks,
  getSingleStock,
  updateStock,
  deleteStock,
  getStockByMedicineName,
};
