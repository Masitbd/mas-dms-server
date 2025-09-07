import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PurchasePaymentService } from "./purchasePayments.service";
import sendResponse from "../../../shared/sendResponse";
import { IPurchasePayment } from "./purchasePayments.interface";

const createPurchasePayment = catchAsync(
  async (req: Request, res: Response) => {
    const { ...purchasePaymentData } = req.body;
    const result = await PurchasePaymentService.createPurchasePayment(
      purchasePaymentData
    );

    sendResponse<IPurchasePayment>(res, {
      statusCode: 201,
      success: true,
      message: "Purchase payment created successfully",
      data: result,
    });
  }
);

const getAllPurchasePayments = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PurchasePaymentService.getAllPurchasePayments();

    sendResponse<IPurchasePayment[]>(res, {
      statusCode: 200,
      success: true,
      message: "Purchase payments retrieved successfully",
      data: result,
    });
  }
);

const getSinglePurchasePayment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PurchasePaymentService.getSinglePurchasePayment(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Purchase payment retrieved successfully",
      data: result,
    });
  }
);

const updatePurchasePayment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ...updatedData } = req.body;
    const result = await PurchasePaymentService.updatePurchasePayment(
      id,
      updatedData
    );

    sendResponse<IPurchasePayment>(res, {
      statusCode: 200,
      success: true,
      message: "Purchase payment updated successfully",
      data: result,
    });
  }
);

const deletePurchasePayment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PurchasePaymentService.deletePurchasePayment(id);

    sendResponse<IPurchasePayment>(res, {
      statusCode: 200,
      success: true,
      message: "Purchase payment deleted successfully",
      data: result,
    });
  }
);

export const PurchasePaymentController = {
  createPurchasePayment,
  getAllPurchasePayments,
  getSinglePurchasePayment,
  updatePurchasePayment,
  deletePurchasePayment,
};
