import { Purchase } from "../app/modules/purchases/purchases.model";
import { Sale } from "../app/modules/sales/sales.model";

const findLastInvoiceNo = async () => {
  const lastItem = await Purchase.findOne(
    {},
    {
      invoiceNo: 1,
      _id: 0,
    }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastItem?.invoiceNo ? lastItem.invoiceNo : undefined;
};

export const generateInvoiceNo = async () => {
  let currentId = "0";
  const lastInvoiceNo = await findLastInvoiceNo();

  if (lastInvoiceNo) {
    currentId = lastInvoiceNo.substring(4);
  }

  const incrementId = (Number(currentId) + 1).toString().padStart(6, "0");

  return `INV-${incrementId}`;
};

// ! sales inv

const findLastSalesInvoiceNo = async () => {
  const lastItem = await Sale.findOne(
    {},
    {
      invoice_no: 1,
      _id: 0,
    }
  )
    .sort({
      createdAt: -1,
    })
    .lean();
  // inv-24000001

  return lastItem?.invoice_no ? lastItem.invoice_no : undefined;
};

export const generateSalesInvoiceNo = async () => {
  let currentId = "0";
  const currentYear = new Date().getFullYear().toString().slice(-2);

  const lastInvoiceNo = await findLastSalesInvoiceNo();

  if (lastInvoiceNo && currentYear === lastInvoiceNo.slice(4, 6)) {
    currentId = lastInvoiceNo.substring(6);
  }

  const incrementId = (Number(currentId) + 1).toString().padStart(6, "0");

  return `INV-${currentYear}${incrementId}`;
};
