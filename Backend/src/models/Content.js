import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    aboutText: { type: String, default: "" },
    certificateUrls: [{ type: String }],
    policies: {
      bookingDeposits: { type: String, default: "" },
      cancellationReschedule: { type: String, default: "" },
      noShow: { type: String, default: "" },
      lateArrival: { type: String, default: "" },
      refundSatisfaction: { type: String, default: "" },
      prepRequirements: { type: String, default: "" },
      aftercare: { type: String, default: "" },
      allergies: { type: String, default: "" },
      privacy: { type: String, default: "" },
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Content", contentSchema);
