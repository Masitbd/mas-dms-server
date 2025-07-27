import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PurchaseService } from './purchases.service';
import sendResponse from '../../../shared/sendResponse';
import { IPurchase } from './purchases.interface';

const createPurchase = catchAsync(async (req: Request, res: Response) => {
  const { purchaseItems, ...purchaseData } = req.body;
  const result = await PurchaseService.createPurchase({
    ...purchaseData,
    purchaseItems,
  });

  sendResponse<IPurchase>(res, {
    statusCode: 201,
    success: true,
    message: 'Purchase created successfully',
    data: result,
  });
});

const getAllPurchases = catchAsync(async (req: Request, res: Response) => {
  const result = await PurchaseService.getAllPurchases();

  sendResponse<IPurchase[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchases retrieved successfully',
    data: result,
  });
});

const getSinglePurchase = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PurchaseService.getSinglePurchase(id);

  sendResponse<IPurchase>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase retrieved successfully',
    data: result,
  });
});

const updatePurchase = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;
  const result = await PurchaseService.updatePurchase(id, updatedData);

  sendResponse<IPurchase>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase updated successfully',
    data: result,
  });
});

const deletePurchase = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PurchaseService.deletePurchase(id);

  sendResponse<IPurchase>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase deleted successfully',
    data: result,
  });
});

export const PurchaseController = {
  createPurchase,
  getAllPurchases,
  getSinglePurchase,
  updatePurchase,
  deletePurchase,
};
