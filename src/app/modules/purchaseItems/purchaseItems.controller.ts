import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PurchaseItemService } from './purchaseItems.service';
import sendResponse from '../../../shared/sendResponse';
import { IPurchaseItem } from './purchaseItems.interface';

const createPurchaseItem = catchAsync(async (req: Request, res: Response) => {
  const { ...purchaseItemData } = req.body;
  const result = await PurchaseItemService.createPurchaseItem(purchaseItemData);

  sendResponse<IPurchaseItem>(res, {
    statusCode: 201,
    success: true,
    message: 'Purchase item created successfully',
    data: result,
  });
});

const getAllPurchaseItems = catchAsync(async (req: Request, res: Response) => {
  const result = await PurchaseItemService.getAllPurchaseItems();

  sendResponse<IPurchaseItem[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase items retrieved successfully',
    data: result,
  });
});

const getSinglePurchaseItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PurchaseItemService.getSinglePurchaseItem(id);

  sendResponse<IPurchaseItem>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase item retrieved successfully',
    data: result,
  });
});

const updatePurchaseItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;
  const result = await PurchaseItemService.updatePurchaseItem(id, updatedData);

  sendResponse<IPurchaseItem>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase item updated successfully',
    data: result,
  });
});

const deletePurchaseItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PurchaseItemService.deletePurchaseItem(id);

  sendResponse<IPurchaseItem>(res, {
    statusCode: 200,
    success: true,
    message: 'Purchase item deleted successfully',
    data: result,
  });
});

export const PurchaseItemController = {
  createPurchaseItem,
  getAllPurchaseItems,
  getSinglePurchaseItem,
  updatePurchaseItem,
  deletePurchaseItem,
};
