import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PurchaseReturnItemService } from './purchaseReturnItems.service';
import sendResponse from '../../../shared/sendResponse';
import { IPurchaseReturnItem } from './purchaseReturnItems.interface';

const createPurchaseReturnItem = catchAsync(async (req: Request, res: Response) => {
  const { ...purchaseReturnItemData } = req.body;
  const result = await PurchaseReturnItemService.createPurchaseReturnItem(purchaseReturnItemData);

  sendResponse<IPurchaseReturnItem>(res, {
    statusCode: 201,
    success: true,
    message: 'Purchase return item created successfully',
    data: result,
  });
});

const getAllPurchaseReturnItems = catchAsync(async (req: Request, res: Response) => {
  const result = await PurchaseReturnItemService.getAllPurchaseReturnItems();

  sendResponse<IPurchaseReturnItem[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase return items retrieved successfully',
    data: result,
  });
});

const getSinglePurchaseReturnItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PurchaseReturnItemService.getSinglePurchaseReturnItem(id);

  sendResponse<IPurchaseReturnItem>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase return item retrieved successfully',
    data: result,
  });
});

const updatePurchaseReturnItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;
  const result = await PurchaseReturnItemService.updatePurchaseReturnItem(id, updatedData);

  sendResponse<IPurchaseReturnItem>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase return item updated successfully',
    data: result,
  });
});

const deletePurchaseReturnItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PurchaseReturnItemService.deletePurchaseReturnItem(id);

  sendResponse<IPurchaseReturnItem>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase return item deleted successfully',
    data: result,
  });
});

export const PurchaseReturnItemController = {
  createPurchaseReturnItem,
  getAllPurchaseReturnItems,
  getSinglePurchaseReturnItem,
  updatePurchaseReturnItem,
  deletePurchaseReturnItem,
};
