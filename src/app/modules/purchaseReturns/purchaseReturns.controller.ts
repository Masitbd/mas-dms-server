import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PurchaseReturnService } from './purchaseReturns.service';
import sendResponse from '../../../shared/sendResponse';
import { IPurchaseReturn } from './purchaseReturns.interface';

const createPurchaseReturn = catchAsync(async (req: Request, res: Response) => {
  const { ...purchaseReturnData } = req.body;
  const result = await PurchaseReturnService.createPurchaseReturn(purchaseReturnData);

  sendResponse<IPurchaseReturn>(res, {
    statusCode: 201,
    success: true,
    message: 'Purchase return created successfully',
    data: result,
  });
});

const getAllPurchaseReturns = catchAsync(async (req: Request, res: Response) => {
  const result = await PurchaseReturnService.getAllPurchaseReturns();

  sendResponse<IPurchaseReturn[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase returns retrieved successfully',
    data: result,
  });
});

const getSinglePurchaseReturn = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PurchaseReturnService.getSinglePurchaseReturn(id);

  sendResponse<IPurchaseReturn>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase return retrieved successfully',
    data: result,
  });
});

const updatePurchaseReturn = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;
  const result = await PurchaseReturnService.updatePurchaseReturn(id, updatedData);

  sendResponse<IPurchaseReturn>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase return updated successfully',
    data: result,
  });
});

const deletePurchaseReturn = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PurchaseReturnService.deletePurchaseReturn(id);

  sendResponse<IPurchaseReturn>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase return deleted successfully',
    data: result,
  });
});

export const PurchaseReturnController = {
  createPurchaseReturn,
  getAllPurchaseReturns,
  getSinglePurchaseReturn,
  updatePurchaseReturn,
  deletePurchaseReturn,
};
