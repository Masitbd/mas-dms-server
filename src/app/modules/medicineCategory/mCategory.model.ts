"use client";
import { model, Schema } from "mongoose";
import { TMCategoryAndGeneric } from "./mCategory.interface";

const categorySchema = new Schema<TMCategoryAndGeneric>(
  {
    categoryId: { type: String, unique: true, required: true },
    name: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

export const Category = model("Category", categorySchema);
