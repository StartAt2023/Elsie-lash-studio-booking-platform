import mongoose from "mongoose";

const statusEnum = ["pending", "confirmed", "completed", "cancelled"];

const bookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: String, required: true },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: statusEnum,
      default: "pending",
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Booking", bookingSchema);
