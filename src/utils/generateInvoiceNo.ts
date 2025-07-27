import { Purchase } from '../app/modules/purchases/purchases.model';

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
  let currentId = '0';
  const lastInvoiceNo = await findLastInvoiceNo();

  if (lastInvoiceNo) {
    currentId = lastInvoiceNo.substring(4);
  }

  const incrementId = (Number(currentId) + 1).toString().padStart(6, '0');

  return `INV-${incrementId}`;
};
