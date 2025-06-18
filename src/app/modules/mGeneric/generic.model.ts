import { model, Schema } from "mongoose";
import { TMCategoryAndGeneric } from "../medicineCategory/mCategory.interface";

const genericSchema = new Schema<TMCategoryAndGeneric>(
  {
    name: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

export const Generic = model("Generic", genericSchema);
