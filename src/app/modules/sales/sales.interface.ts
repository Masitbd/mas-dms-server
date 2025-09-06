import { Schema } from "mongoose";

export interface IMedicineSale {
  medicineId: Schema.Types.ObjectId;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount: number;
  discount_type: string;
  batchNo: string;
}

export interface ISale {
  name: string;
  address?: string;
  contact_no?: string;
  transaction_date?: Date;
  paymentId: Schema.Types.ObjectId;
  invoice_no: string;
  percentDiscount: number;
  discountAmount: number;
  totalBill: number;
  totalVat: number;
  serviceCharge: number;
  totalDiscount: number;
  extraDiscount: number;
  advanceAmount: number;
  netPayable: number;
  paid: number;
  due: number;
  patient_type: "outdoor" | "indoor";
  bed_no?: string;
  indoor_bill_no?: string;
  medicines: [IMedicineSale];
  posted_by: string;
  isDeleted?: boolean;
}
