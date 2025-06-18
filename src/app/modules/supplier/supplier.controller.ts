import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";

import sendResponse from "../../../utils/sendResponse";
import { supplierServices } from "./supplier.service";

const createSupplier = catchAsync(async (req: Request, res: Response) => {
  const result = await supplierServices.createSupplierIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Supplier Created",
    data: result,
  });
});

// ! export

export const supplierControllers = {
  createSupplier,
};
