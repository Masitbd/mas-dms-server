import { model, Schema } from "mongoose";
import { TGeneric } from "./generic.interface";

const genericSchema = new Schema<TGeneric>(
  {
    genericId: { type: String, unique: true, required: true },
    name: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

export const Generic = model("Generic", genericSchema);
