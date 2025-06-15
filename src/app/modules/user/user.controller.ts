import status from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

const createStudent = catchAsync(async (req, res) => {
  const result = 10;

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Student is created successfully",
    data: result,
  });
});

export const UserControllers = {
  createStudent,
};
