import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";

import sendResponse from "../../../utils/sendResponse";
import { categoryServices } from "./mCategory.service";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryServices.createCategoryIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Medicine Category Created",
    data: result,
  });
});

// ! export

export const categoryControllers = {
  createCategory,
};
