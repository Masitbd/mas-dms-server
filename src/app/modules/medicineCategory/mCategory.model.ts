import { model, Schema } from "mongoose";
import { TMCategoryAndGeneric } from "./mCategory.interface";

const categorySchema = new Schema<TMCategoryAndGeneric>(
  {
    name: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

export const Category = model("Category", categorySchema);
