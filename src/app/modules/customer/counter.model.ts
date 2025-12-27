// models/counter.model.ts
import mongoose, { Schema, model, models, type Model } from "mongoose";

export type CounterDoc = {
  _id: string; // e.g. "customer"
  seq: number;
};

const CounterSchema = new Schema<CounterDoc>(
  {
    _id: { type: String, required: true },
    seq: { type: Number, required: true, default: 0 },
  },
  { versionKey: false, timestamps: false }
);

// Strongly type the model
export const Counter: Model<CounterDoc> =
  (models.Counter as Model<CounterDoc>) ||
  model<CounterDoc>("Counter", CounterSchema);

// Atomic increment
export async function getNextSequence(name: string): Promise<number> {
  const doc = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } }, // atomic
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
    .lean<CounterDoc>()
    .exec();

  if (!doc) throw new Error("Failed to generate sequence value.");
  return doc.seq;
}
