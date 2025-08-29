import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import {
  getDueCollectionStatemntFromDB,
  getMedicineSalesStatemntFromDB,
} from "./reports.service";
import sendResponse from "../../../utils/sendResponse";

export const getMedicineSalesStatement = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getMedicineSalesStatemntFromDB(req.query);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Report Retrive successfully",
      data: result,
    });
  }
);
export const getDueCollectionStatement = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getDueCollectionStatemntFromDB(req.query);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Due collection Report Retrive successfully",
      data: result,
    });
  }
);
