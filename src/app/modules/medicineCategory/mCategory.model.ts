import { model, Schema } from "mongoose";
import { TMCategoryAndGeneric } from "./mCategory.interface";

const mCategorySchema = new Schema<TMCategoryAndGeneric>(
  {
    name: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

export const MCATEGORY = model("MCATEGORY", mCategorySchema);
