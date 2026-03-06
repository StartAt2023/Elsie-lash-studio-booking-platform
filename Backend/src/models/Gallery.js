import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, default: "Classic" },
    description: { type: String, default: "" },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Gallery", gallerySchema);
