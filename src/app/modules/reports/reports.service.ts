import { PipelineStage } from "mongoose";
import { Sale } from "../sales/sales.model";
import { Sale as SaleV2 } from "../sales-v2/sales.model";
import { Payment } from "../payments/payments.model";
import { Stock } from "../stock/stock.model";

export const getMedicineSalesStatemntFromDB = async (
  payload: Record<string, any>,
) => {
  // Default to current date if no startDate and endDate are provided
  const startDate = payload.startDate
    ? new Date(payload.startDate)
    : new Date();
  const endDate = payload.endDate ? new Date(payload.endDate) : new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const query: PipelineStage[] = [
    {
      $match: {
        saleDate: {
          $gte: startDate,
          $lte: endDate,
        },
        status: "posted",
      },
    },
    {
      $lookup: {
        from: "payments",
        let: {
          invoiceNo: "$invoiceNo",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$invoice_no", "$$invoiceNo"],
              },
            },
          },
          {
            $group: {
              _id: null,
              dueCollectionPaid: {
                $sum: {
                  $cond: [
                    { $eq: ["$purpose", "due-collection"] },
                    { $ifNull: ["$paid", 0] },
                    0,
                  ],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              dueCollectionPaid: 1,
            },
          },
        ],
        as: "paymentSummary",
      },
    },
    {
      $unwind: {
        path: "$paymentSummary",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        invoice_no: "$invoiceNo",
        name: "$current.customer.name",
        contact_no: "$current.customer.contactNo",
        reg_no: "$current.customer.customerUuid",
        bed_no: "$current.customer.bedNo",
        createdAt: "$saleDate",
        discountAmount: { $ifNull: ["$current.finance.lineDiscountTotal", 0] },
        extraDiscount: { $ifNull: ["$current.finance.extraDiscount", 0] },
        totalBill: {
          $add: [
            { $ifNull: ["$current.finance.subTotal", 0] },
            { $ifNull: ["$current.finance.lineDiscountTotal", 0] },
          ],
        },
        totalDiscount: {
          $add: [
            { $ifNull: ["$current.finance.lineDiscountTotal", 0] },
            { $ifNull: ["$current.finance.extraDiscount", 0] },
          ],
        },
        advanceAmount: { $ifNull: ["$current.finance.paid", 0] },
        netPayable: { $ifNull: ["$current.finance.netPayable", 0] },
        "paymentDetails.paid": {
          $add: [
            { $ifNull: ["$current.finance.paid", 0] },
            { $ifNull: ["$paymentSummary.dueCollectionPaid", 0] },
          ],
        },
      },
    },
    {
      $addFields: {
        due: {
          $max: [
            {
              $subtract: ["$netPayable", "$paymentDetails.paid"],
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        contact_no: 1,
        reg_no: 1,
        bed_no: 1,
        invoice_no: 1,
        discountAmount: 1,
        totalBill: 1,
        due: 1,
        // totalPaid: 1,
        totalDiscount: 1,
        extraDiscount: 1,
        advanceAmount: 1,
        netPayable: 1,
        createdAt: 1,
        "paymentDetails.paid": 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: null,
        records: { $push: "$$ROOT" },
        totalBill: { $sum: "$totalBill" },
        totalDiscount: { $sum: "$totalDiscount" },
        totalNetPayable: { $sum: "$netPayable" },
        totalPaid: { $sum: "$paymentDetails.paid" },
        totalDue: { $sum: "$due" },
      },
    },
  ];

  return await Sale.aggregate(query);
};
export const getDueCollectionStatemntFromDB = async (
  payload: Record<string, any>,
) => {
  // Default to current date if no startDate and endDate are provided
  const startDate = payload.startDate
    ? new Date(payload.startDate)
    : new Date();
  const endDate = payload.endDate ? new Date(payload.endDate) : new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const query: PipelineStage[] = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },

    {
      $lookup: {
        from: "sales",
        localField: "invoice_no",
        foreignField: "invoice_no",
        as: "salesInfo",
      },
    },

    {
      $unwind: {
        path: "$salesInfo",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 0,

        invoice_no: 1,
        createdAt: 1,
        purpose: 1,
        paid: 1,
        totalBill: "$salesInfo.totalBill",
        netPayable: "$salesInfo.netPayable",
        totalPaid: "$salesInfo.paid",
        totalDue: "$salesInfo.due",
      },
    },

    {
      $sort: { createdAt: -1 },
    },

    {
      $group: {
        _id: null,
        records: { $push: "$$ROOT" },
        grandTotal: { $sum: "$paid" },
      },
    },
  ];

  const [result] = await Payment.aggregate(query);
  return result;
};

export const getDueCollectionSummeryFromDB = async (
  payload: Record<string, any>,
) => {
  // Default to current date if no startDate and endDate are provided
  const startDate = payload.startDate
    ? new Date(payload.startDate)
    : new Date();
  const endDate = payload.endDate ? new Date(payload.endDate) : new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const match: Record<string, any> = {
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
    purpose: "due-collection",
  };

  if (payload.userId) {
    match.posted_by = payload.userId;
  }

  const query: PipelineStage[] = [
    {
      $match: match,
    },

    {
      $project: {
        _id: 0,

        invoice_no: 1,
        createdAt: 1,
        paid: 1,
        due: 1,
        posted_by: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },

    {
      $group: {
        _id: "$posted_by",
        latestInvoice: { $first: "$$ROOT" },
        totalDueCollection: { $sum: "$paid" },
      },
    },
    {
      $project: {
        _id: 0,
        posted_by: "$_id",
        invoice_no: "$latestInvoice.invoice_no",
        createdAt: "$latestInvoice.createdAt",
        paid: "$latestInvoice.paid",
        totalDueCollection: 1,
      },
    },
  ];

  return await Payment.aggregate(query);
};

export const getPatientSaleDueStatementFromDB = async (
  payload: Record<string, any>,
) => {
  // Default to current date if no startDate and endDate are provided
  const startDate = payload.startDate
    ? new Date(payload.startDate)
    : new Date();
  const endDate = payload.endDate ? new Date(payload.endDate) : new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const query: PipelineStage[] = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        $expr: { $lt: ["$paid", "$netPayable"] },
      },
    },

    {
      $lookup: {
        from: "beds",
        localField: "bed_no",
        foreignField: "_id",
        as: "bedDetails",
      },
    },
    {
      $unwind: {
        path: "$bedDetails",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 0,

        invoice_no: 1,
        createdAt: 1,
        paid: 1,
        posted_by: 1,
        totalBill: 1,
        totalDiscount: 1,
        netPayable: 1,
        due: 1,
        // posted_by: 1,
        bed: "$bedDetails?.name",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: null,
        records: { $push: "$$ROOT" }, // keep all documents
        totalBill: { $sum: "$totalBill" },
        totalPaid: { $sum: "$paid" },
        totalDiscount: { $sum: "$totalDiscount" },
        totalNetPayable: { $sum: "$netPayable" },
        totalDue: { $sum: "$due" },
      },
    },
  ];

  return await Sale.aggregate(query);
};

// ? All Patient due summery

export const getPatientDueSummeryFromDB = async (
  payload: Record<string, any>,
) => {
  // Default to current date if no startDate and endDate are provided
  const startDate = payload.startDate
    ? new Date(payload.startDate)
    : new Date();
  const endDate = payload.endDate ? new Date(payload.endDate) : new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const query: PipelineStage[] = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        $expr: { $lt: ["$paid", "$netPayable"] },
      },
    },

    {
      $lookup: {
        from: "beds",
        localField: "bed_no",
        foreignField: "_id",
        as: "bedDetails",
      },
    },
    {
      $unwind: {
        path: "$bedDetails",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 0,

        invoice_no: 1,
        createdAt: 1,
        paid: 1,
        posted_by: 1,
        totalBill: 1,
        totalDiscount: 1,
        netPayable: 1,
        due: 1,
        // posted_by: 1,
        bed: "$bedDetails?.name",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: "$invoice_no",
        records: { $push: "$$ROOT" }, // keep all documents
        totalBill: { $sum: "$totalBill" },
        totalPaid: { $sum: "$paid" },
        totalDiscount: { $sum: "$totalDiscount" },
        totalNetPayable: { $sum: "$netPayable" },
        totalDue: { $sum: "$due" },
      },
    },
  ];

  return await Sale.aggregate(query);
};

//? stock reports

export const getMedicineStockRecordFromDB = async (page = 1, limit = 100) => {
  const skip = (page - 1) * limit;

  // Step 1: Count total distinct products with available stock
  const totalDocsAgg = await Stock.aggregate([
    { $match: { currentQuantity: { $gt: 0 } } },
    { $group: { _id: "$productId" } },
    { $count: "totalDocs" },
  ]);

  const totalDocs = totalDocsAgg[0]?.totalDocs || 0;
  const totalPages = Math.ceil(totalDocs / limit);

  // Step 2: Fetch paginated products with FIFO
  const records = await Stock.aggregate([
    { $match: { currentQuantity: { $gt: 0 } } },

    // populate product
    {
      $lookup: {
        from: "medicines",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "categories",
        localField: "product.category",
        foreignField: "_id",
        as: "productCategory",
      },
    },
    { $unwind: "$productCategory" },

    // populate purchase item
    {
      $lookup: {
        from: "purchaseitems",
        localField: "purchaseItemId",
        foreignField: "_id",
        as: "purchaseItem",
      },
    },
    { $unwind: "$purchaseItem" },

    // sort by oldest batch first (FIFO)
    { $sort: { createdAt: 1 } },

    // group by product, pick the first batch with stock
    {
      $group: {
        _id: "$product._id",
        medicineName: { $first: "$product.name" },
        medicineCategory: { $first: "$productCategory.name" },
        currentQty: { $sum: "$currentQuantity" }, // total available stock
        qtyIn: { $first: "$quantityIn" }, // qty in first batch
        purchaseRate: { $first: "$purchaseItem.purchaseRate" },
        salesRate: { $first: "$purchaseItem.salesRate" },
      },
    },

    // pagination
    { $skip: skip },
    { $limit: limit },
  ]);

  const meta = {
    totalDocs,
    limit,
    page,
    totalPages,
  };

  return { records, meta };
};

export const getMedicineStockStatementFromDB = async () => {
  const query: PipelineStage[] = [
    {
      $lookup: {
        from: "medicines",
        localField: "productId",
        foreignField: "_id",
        as: "medicine",
      },
    },
    { $unwind: "$medicine" },
    {
      $match: {
        "medicine.isDeleted": false,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "medicine.category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "purchaseitems",
        localField: "purchaseItemId",
        foreignField: "_id",
        as: "purchaseItem",
      },
    },
    {
      $unwind: {
        path: "$purchaseItem",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        stockQtyLine: { $ifNull: ["$currentQuantity", 0] },
        purchaseQtyLine: { $ifNull: ["$quantityIn", 0] },
        purchaseRateLine: { $ifNull: ["$purchaseItem.purchaseRate", 0] },
      },
    },
    {
      $addFields: {
        totalPValueLine: {
          $multiply: ["$purchaseQtyLine", "$purchaseRateLine"],
        },
      },
    },
    {
      $group: {
        _id: "$medicine._id",
        mCategory: { $first: "$category.name" },
        medicineName: { $first: "$medicine.name" },
        stockQty: { $sum: "$stockQtyLine" },
        purchaseQty: { $sum: "$purchaseQtyLine" },
        totalPValue: { $sum: "$totalPValueLine" },
      },
    },
    {
      $project: {
        _id: 0,
        mCategory: 1,
        medicineName: 1,
        stockQty: 1,
        purchaseQty: 1,
        totalPValue: 1,
        unitPrice: {
          $cond: [
            { $ne: ["$purchaseQty", 0] },
            { $divide: ["$totalPValue", "$purchaseQty"] },
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        totalSValue: { $multiply: ["$stockQty", "$unitPrice"] },
      },
    },
    { $sort: { medicineName: 1 } },
    {
      $group: {
        _id: null,
        records: { $push: "$$ROOT" },
        totalStockQty: { $sum: "$stockQty" },
        totalPurchaseQty: { $sum: "$purchaseQty" },
        totalPurchaseValue: { $sum: "$totalPValue" },
        totalStockValue: { $sum: "$totalSValue" },
      },
    },
    {
      $project: {
        _id: 0,
        records: 1,
        totals: {
          totalStockQty: "$totalStockQty",
          totalPurchaseQty: "$totalPurchaseQty",
          totalPurchaseValue: "$totalPurchaseValue",
          totalStockValue: "$totalStockValue",
        },
      },
    },
  ];

  const [result] = await Stock.aggregate(query);
  return (
    result || {
      records: [],
      totals: {
        totalStockQty: 0,
        totalPurchaseQty: 0,
        totalPurchaseValue: 0,
        totalStockValue: 0,
      },
    }
  );
};

export const getMedicineExpiryStatementFromDB = async (
  payload: Record<string, any>,
) => {
  const startDate = payload.startDate
    ? new Date(payload.startDate)
    : new Date();
  const endDate = payload.endDate ? new Date(payload.endDate) : new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const query: PipelineStage[] = [
    {
      $match: {
        currentQuantity: { $gt: 0 },
        expiryDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $lookup: {
        from: "purchaseitems",
        localField: "purchaseItemId",
        foreignField: "_id",
        as: "purchaseItem",
      },
    },
    {
      $unwind: {
        path: "$purchaseItem",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "purchases",
        localField: "purchaseItem.purchaseId",
        foreignField: "_id",
        as: "purchase",
      },
    },
    {
      $unwind: {
        path: "$purchase",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "suppliers",
        localField: "purchase.supplierId",
        foreignField: "_id",
        as: "supplier",
      },
    },
    {
      $unwind: {
        path: "$supplier",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "medicines",
        localField: "productId",
        foreignField: "_id",
        as: "medicine",
      },
    },
    {
      $unwind: {
        path: "$medicine",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "purchaseItem.category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        invoiceNo: "$purchase.invoiceNo",
        supplierName: "$supplier.name",
        category: "$category.name",
        medicineName: "$medicine.name",
        batchNo: "$batchNo",
        qty: "$currentQuantity",
        rate: "$purchaseItem.purchaseRate",
        amount: {
          $multiply: ["$currentQuantity", "$purchaseItem.purchaseRate"],
        },
        dateMfg: "$purchaseItem.dateMfg",
        dateExp: "$expiryDate",
      },
    },
    {
      $sort: {
        dateExp: 1,
        invoiceNo: 1,
      },
    },
    {
      $group: {
        _id: null,
        records: { $push: "$$ROOT" },
        totalQty: { $sum: "$qty" },
        grandTotalAmount: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        records: 1,
        totalQty: 1,
        grandTotalAmount: 1,
      },
    },
  ];

  const [result] = await Stock.aggregate(query);
  return (
    result || {
      records: [],
      totalQty: 0,
      grandTotalAmount: 0,
    }
  );
};

export const getMedicineIncomeStatementSummaryFromDB = async (
  payload: Record<string, any>,
) => {
  const startDate = payload.startDate
    ? new Date(payload.startDate)
    : new Date();
  const endDate = payload.endDate ? new Date(payload.endDate) : new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const saleDateMatch = {
    saleDate: {
      $gte: startDate,
      $lte: endDate,
    },
    status: "posted",
  };

  const paymentDateMatch = {
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  const [salesSummary, paymentSummary, adjustmentSummary] = await Promise.all([
    SaleV2.aggregate([
      {
        $match: {
          ...saleDateMatch,
        },
      },
      {
        $group: {
          _id: null,
          indoor: {
            $sum: {
              $cond: [
                { $eq: ["$current.customer.patientType", "indoor"] },
                { $ifNull: ["$current.finance.subTotal", 0] },
                0,
              ],
            },
          },
          outdoor: {
            $sum: {
              $cond: [
                { $eq: ["$current.customer.patientType", "outdoor"] },
                { $ifNull: ["$current.finance.subTotal", 0] },
                0,
              ],
            },
          },
          totalDiscount: {
            $sum: {
              $add: [
                { $ifNull: ["$current.finance.lineDiscountTotal", 0] },
                { $ifNull: ["$current.finance.extraDiscount", 0] },
              ],
            },
          },
          totalAdvance: { $sum: { $ifNull: ["$current.finance.paid", 0] } },
          totalDue: { $sum: { $ifNull: ["$current.finance.due", 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          indoor: 1,
          outdoor: 1,
          totalDiscount: 1,
          totalAdvance: 1,
          totalDue: 1,
        },
      },
    ]),
    Payment.aggregate([
      {
        $match: {
          ...paymentDateMatch,
          purpose: "due-collection",
        },
      },
      {
        $group: {
          _id: null,
          dueCollection: { $sum: { $ifNull: ["$paid", 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          dueCollection: 1,
        },
      },
    ]),
    Payment.aggregate([
      {
        $match: {
          ...paymentDateMatch,
          purpose: "adjustment",
        },
      },
      {
        $lookup: {
          from: SaleV2.collection.name,
          localField: "invoice_no",
          foreignField: "invoiceNo",
          as: "saleInfo",
        },
      },
      {
        $unwind: {
          path: "$saleInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          indoorReturn: {
            $sum: {
              $cond: [
                { $eq: ["$saleInfo.current.customer.patientType", "indoor"] },
                { $ifNull: ["$paid", 0] },
                0,
              ],
            },
          },
          outdoorReturn: {
            $sum: {
              $cond: [
                { $eq: ["$saleInfo.current.customer.patientType", "outdoor"] },
                { $ifNull: ["$paid", 0] },
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          indoorReturn: 1,
          outdoorReturn: 1,
        },
      },
    ]),
  ]);

  const saleRow = salesSummary[0] || {};
  const paymentRow = paymentSummary[0] || {};
  const adjustmentRow = adjustmentSummary[0] || {};

  const summary = {
    indoor: saleRow.indoor || 0,
    outdoor: saleRow.outdoor || 0,
    totalDiscount: saleRow.totalDiscount || 0,
    indoorReturn: adjustmentRow.indoorReturn || 0,
    outdoorReturn: adjustmentRow.outdoorReturn || 0,
    dueCollection: paymentRow.dueCollection || 0,
    totalAdvance: saleRow.totalAdvance || 0,
    netCollection:
      (saleRow.totalAdvance || 0) + (paymentRow.dueCollection || 0),
    totalDue: saleRow.totalDue || 0,
  };

  return {
    records: [summary],
    total: summary,
  };
};

// ?

export const getMedicineProfitLossFromDB = async (
  payload: Record<string, any>,
) => {
  const startDate = payload.startDate
    ? new Date(payload.startDate)
    : new Date();
  const endDate = payload.endDate ? new Date(payload.endDate) : new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const match: Record<string, any> = {
    saleDate: {
      $gte: startDate,
      $lte: endDate,
    },
    status: "posted",
  };

  const agreegatePipeline: PipelineStage[] = [
    {
      $match: match,
    },
    { $unwind: "$current.items" },
    {
      $lookup: {
        from: "purchaseitems",
        localField: "current.items.purchaseItemId",
        foreignField: "_id",
        as: "purchaseInfo",
      },
    },
    {
      $unwind: { path: "$purchaseInfo", preserveNullAndEmptyArrays: true },
    },
    {
      $addFields: {
        particulars: "$current.items.medicineSnapshot.name",
        lineQty: { $ifNull: ["$current.items.qty", 0] },
        lineSalesRate: { $ifNull: ["$current.items.rate", 0] },
        lineTotalAmount: {
          $ifNull: [
            "$current.items.gross",
            {
              $multiply: [
                { $ifNull: ["$current.items.qty", 0] },
                { $ifNull: ["$current.items.rate", 0] },
              ],
            },
          ],
        },
        lineDiscount: { $ifNull: ["$current.items.discountAmount", 0] },
        linePurchaseRate: { $ifNull: ["$purchaseInfo.purchaseRate", 0] },
      },
    },
    {
      $addFields: {
        lineNetAmount: { $subtract: ["$lineTotalAmount", "$lineDiscount"] },
        lineTotalPurchaseRate: { $multiply: ["$lineQty", "$linePurchaseRate"] },
      },
    },
    {
      $group: {
        _id: {
          medicineName: "$particulars",
          medicineId: "$current.items.medicineSnapshot.medicineId",
        },
        particulars: { $first: "$particulars" },
        qty: { $sum: "$lineQty" },
        totalAmount: { $sum: "$lineTotalAmount" },
        discount: { $sum: "$lineDiscount" },
        netAmount: { $sum: "$lineNetAmount" },
        totalPRate: { $sum: "$lineTotalPurchaseRate" },
        salesRateFallback: { $first: "$lineSalesRate" },
        purchaseRateFallback: { $first: "$linePurchaseRate" },
      },
    },
    {
      $project: {
        _id: 0,
        particulars: 1,
        qty: 1,
        salesRate: {
          $cond: [
            { $ne: ["$qty", 0] },
            { $divide: ["$totalAmount", "$qty"] },
            "$salesRateFallback",
          ],
        },
        totalAmount: 1,
        purchaseRate: {
          $cond: [
            { $ne: ["$qty", 0] },
            { $divide: ["$totalPRate", "$qty"] },
            "$purchaseRateFallback",
          ],
        },
        discount: 1,
        netAmount: 1,
        totalPRate: 1,
        netProfit: { $subtract: ["$netAmount", "$totalPRate"] },
      },
    },
    { $sort: { particulars: 1 } },
    {
      $group: {
        _id: null,
        records: { $push: "$$ROOT" },
        qty: { $sum: "$qty" },
        salesRate: { $sum: "$salesRate" },
        totalAmount: { $sum: "$totalAmount" },
        purchaseRate: { $sum: "$purchaseRate" },
        discount: { $sum: "$discount" },
        netAmount: { $sum: "$netAmount" },
        totalPRate: { $sum: "$totalPRate" },
        netProfit: { $sum: "$netProfit" },
      },
    },
    {
      $project: {
        _id: 0,
        records: 1,
        totals: {
          qty: "$qty",
          salesRate: "$salesRate",
          totalAmount: "$totalAmount",
          purchaseRate: "$purchaseRate",
          discount: "$discount",
          netAmount: "$netAmount",
          totalPRate: "$totalPRate",
          netProfit: "$netProfit",
        },
      },
    },
  ];

  const [result] = await SaleV2.aggregate(agreegatePipeline);
  return (
    result || {
      records: [],
      totals: {
        qty: 0,
        salesRate: 0,
        totalAmount: 0,
        purchaseRate: 0,
        discount: 0,
        netAmount: 0,
        totalPRate: 0,
        netProfit: 0,
      },
    }
  );
};
