import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    businessHours: { type: String, default: "" },
    depositAmount: { type: Number, default: 0 },
    cancellationWindowHours: { type: Number, default: 24 },
    lateArrivalGraceMinutes: { type: Number, default: 10 },
    touchUpPolicyWindow: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Settings", settingsSchema);
