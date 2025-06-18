import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { mCategoryServices } from "./mCategory.service";
import sendResponse from "../../../utils/sendResponse";

const createMCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await mCategoryServices.createMCategoryIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Medicine Category Created",
    data: result,
  });
});

// ! export

export const mCategoryControllers = {
  createMCategory,
};
