import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SalesService } from "./sales.service";
import sendResponse from "../../../shared/sendResponse";
import { ISale } from "./sales.interface";

const createSale = catchAsync(async (req: Request, res: Response) => {
  const result = await SalesService.createSale(req.body);

  sendResponse<ISale>(res, {
    statusCode: 201,
    success: true,
    message: "Sale created successfully",
    data: result,
  });
});

const getAllSales = catchAsync(async (req: Request, res: Response) => {
  const result = await SalesService.getAllSales(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sales retrieved successfully",
    data: result,
  });
});

const getSingleSale = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SalesService.getSingleSale(id);

  sendResponse<ISale>(res, {
    statusCode: 200,
    success: true,
    message: "Sale retrieved successfully",
    data: result,
  });
});

const updateSale = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;
  const result = await SalesService.updateSale(id, updatedData);

  sendResponse<ISale>(res, {
    statusCode: 200,
    success: true,
    message: "Sale updated successfully",
    data: result,
  });
});

const deleteSale = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SalesService.deleteSale(id);

  sendResponse<ISale>(res, {
    statusCode: 200,
    success: true,
    message: "Sale deleted successfully",
    data: result,
  });
});

export const SalesController = {
  createSale,
  getAllSales,
  getSingleSale,
  updateSale,
  deleteSale,
};
