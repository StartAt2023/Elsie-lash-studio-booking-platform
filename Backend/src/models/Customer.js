import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    notes: { type: String, default: "" },
    tags: { type: [String], default: [] },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Customer", customerSchema);
