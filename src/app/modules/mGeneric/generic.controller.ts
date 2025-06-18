import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";

import sendResponse from "../../../utils/sendResponse";
import { genericServices } from "./generic.service";

const createGeneric = catchAsync(async (req: Request, res: Response) => {
  const result = await genericServices.createGenericIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Medicine Generic Created",
    data: result,
  });
});

// ! export

export const genericControllers = {
  createGeneric,
};
