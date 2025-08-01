import { Schema } from "mongoose";

export interface ISale {
  name: string;
  address?: string;
  contact_no?: string;
  transaction_date?: Date;
  paymentId: Schema.Types.ObjectId;
  invoice_no: string;
  patient_type: "outdoor" | "indoor";
  bed_no?: string;
  indoor_bill_no?: string;
}
