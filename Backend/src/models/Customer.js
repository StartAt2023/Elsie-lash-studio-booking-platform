import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Customer", customerSchema);
