import { Request, Response } from "express";
import { Types } from "mongoose";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SalesServiceV_2 as SalesService } from "./sales.service";
import pick from "../../../shared/pick";

// adjust path/name to your actual service export

// If you have these interfaces in your module, import them instead
// import { ISale } from "./sales.interface";

type Role = "admin" | "staff";
type Actor = { userId: Types.ObjectId; role: Role };

// What your service returns for create/update (adjust if you return full sale doc)
type SaleWriteResult = {
  saleId: string;
  invoiceNo: string;
  version: number;
};

function getActor(req: Request): Actor {
  const u: any = (req as any).user;
  return {
    userId: new Types.ObjectId(String("665de6c27a941a6c448694f9")),
    role: "admin",
  };

  // Your auth middleware MUST populate req.user
  if (!u) {
    // your global error handler should convert thrown errors into proper response
    throw new Error("Unauthorized: req.user not found");
  }

  const rawId = u.userId || u.id || u._id;
  if (!rawId || !Types.ObjectId.isValid(String(rawId))) {
    throw new Error("Unauthorized: invalid user id");
  }

  const role: Role = u.role === "admin" ? "admin" : "staff";

  // return { userId: new Types.ObjectId(String(rawId)), role };
}

/* ============================================================
 * CREATE/POST SALE
 * ============================================================
 */
const createSale = catchAsync(async (req: Request, res: Response) => {
  const actor = getActor(req);
  console.log("hi-c");
  // This is "post sale" (create + posted) in your current requirement
  const result = await SalesService.postSale(req.body, actor);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Sale posted successfully",
    data: result,
  });
});

/* ============================================================
 * ADMIN UPDATE POSTED SALE (same invoice, new version)
 * ============================================================
 */
const updateSale = catchAsync(async (req: Request, res: Response) => {
  const actor = getActor(req);
  const { id } = req.params;

  const result = await SalesService.updatePostedSale(id, req.body, actor);

  sendResponse<SaleWriteResult>(res, {
    statusCode: 200,
    success: true,
    message: "Sale updated successfully",
    data: result,
  });
});

/* ============================================================
 * GET SINGLE SALE FOR INVOICE (supports version query)
 *  - GET /sales/:id/invoice?version=2
 * ============================================================
 */
const getSaleInvoice = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const versionRaw = req.query.version;

  const version =
    versionRaw === undefined ||
    versionRaw === null ||
    String(versionRaw).trim() === ""
      ? undefined
      : Number(versionRaw);

  if (version !== undefined && (!Number.isFinite(version) || version < 1)) {
    throw new Error("Invalid version query param");
  }

  const result = await SalesService.getSaleForInvoice(id, version);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sale invoice retrieved successfully",
    data: result,
  });
});

/* ============================================================
 * GET SINGLE SALE FOR UI (hydration/edit view)
 *  - GET /sales/:id/ui
 * ============================================================
 */
const getSaleUi = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SalesService.getSaleForUi(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sale UI data retrieved successfully",
    data: result,
  });
});

/* ============================================================
 * GET SINGLE SALE FOR edit (hydration/edit view)
 *  - GET /sales/:id/ui
 * ============================================================
 */
const getSaleForPatch = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SalesService.getSalesForUpdate(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sale UI data retrieved successfully",
    data: result,
  });
});

/* ============================================================
 * GET all SALE FOR edit (hydration/edit view)
 * ============================================================
 */
const getAllSales = catchAsync(async (req: Request, res: Response) => {
  const query = pick(req.query, [
    "page",
    "limit",
    "searchTerm",
    "status",
    "startDate",
    "endDate",
  ]);

  const result = await SalesService.getAllSales(query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All sales retrieved successfully",
    data: result,
  });
});

export const SalesController = {
  createSale,
  updateSale,
  getSaleInvoice,
  getSaleUi,
  getSaleForPatch,
  getAllSales,
};
