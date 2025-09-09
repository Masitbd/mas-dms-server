import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { StockService } from "./stock.service";
import sendResponse from "../../../shared/sendResponse";
import { IStock } from "./stock.interface";

const createStock = catchAsync(async (req: Request, res: Response) => {
  const { ...stockData } = req.body;
  const result = await StockService.createStock(stockData);

  sendResponse<IStock>(res, {
    statusCode: 201,
    success: true,
    message: "Stock created successfully",
    data: result,
  });
});

const getAllStocks = catchAsync(async (req: Request, res: Response) => {
  const result = await StockService.getAllStocks();

  sendResponse<IStock[]>(res, {
    statusCode: 200,
    success: true,
    message: "Stocks retrieved successfully",
    data: result,
  });
});

const getSingleStock = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StockService.getSingleStock(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stock retrieved successfully",
    data: result,
  });
});

const updateStock = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;
  const result = await StockService.updateStock(id, updatedData);

  sendResponse<IStock>(res, {
    statusCode: 200,
    success: true,
    message: "Stock updated successfully",
    data: result,
  });
});

const deleteStock = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StockService.deleteStock(id);

  sendResponse<IStock>(res, {
    statusCode: 200,
    success: true,
    message: "Stock deleted successfully",
    data: result,
  });
});

export const StockController = {
  createStock,
  getAllStocks,
  getSingleStock,
  updateStock,
  deleteStock,
};
