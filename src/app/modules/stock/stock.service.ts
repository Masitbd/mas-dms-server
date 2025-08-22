import { Schema } from "mongoose";
import { IStock } from "./stock.interface";
import { Stock } from "./stock.model";

const createStock = async (payload: IStock): Promise<IStock> => {
  const result = await Stock.create(payload);
  return result;
};

const getAllStocks = async (): Promise<IStock[]> => {
  const result = await Stock.find({})
    .populate("productId")
    .populate("purchaseItemId");
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

export const StockService = {
  createStock,
  getAllStocks,
  getSingleStock,
  updateStock,
  deleteStock,
};
