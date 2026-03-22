import Gallery from "../models/Gallery.js";
import {
  uploadImageBuffer,
  isCloudinaryConfigured,
  destroyImage,
} from "../services/cloudinaryService.js";

function toResponse(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id,
    title: obj.title,
    imageUrl: obj.imageUrl,
    publicId: obj.publicId ?? "",
    category: obj.category ?? "Classic",
    description: obj.description ?? "",
    active: obj.active,
    sortOrder: obj.sortOrder ?? 0,
    createdAt: obj.createdAt,
  };
}

/**
 * POST /api/gallery/upload — multipart: image (file), title, category, description, sortOrder, active
 */
export async function uploadGalleryImageHandler(req, res) {
  if (!isCloudinaryConfigured()) {
    return res.status(503).json({
      message: "Image upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
    });
  }
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ message: "image file is required" });
  }
  const title = (req.body.title || "").trim();
  if (!title) {
    return res.status(400).json({ message: "title is required" });
  }
  try {
    const { url, publicId } = await uploadImageBuffer(req.file.buffer);
    const item = await Gallery.create({
      title,
      imageUrl: url,
      publicId,
      category: (req.body.category || "Classic").trim(),
      description: (req.body.description || "").trim(),
      active: req.body.active === "false" || req.body.active === false ? false : true,
      sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) || 0 : 0,
    });
    res.status(201).json(toResponse(item));
  } catch (err) {
    console.error("[galleryUpload]", err);
    res.status(500).json({ message: err.message || "Upload failed" });
  }
}

/**
 * POST /api/gallery/:id/replace-image — new image + optional metadata fields in multipart body
 */
export async function replaceGalleryImageHandler(req, res) {
  if (!isCloudinaryConfigured()) {
    return res.status(503).json({ message: "Cloudinary is not configured." });
  }
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ message: "image file is required" });
  }
  try {
    const existing = await Gallery.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Gallery item not found" });

    const oldPublicId = existing.publicId;
    const { url, publicId } = await uploadImageBuffer(req.file.buffer);

    existing.imageUrl = url;
    existing.publicId = publicId;
    if (req.body.title !== undefined) existing.title = String(req.body.title).trim();
    if (req.body.category !== undefined) existing.category = String(req.body.category).trim();
    if (req.body.description !== undefined) existing.description = String(req.body.description).trim();
    if (req.body.sortOrder !== undefined) existing.sortOrder = Number(req.body.sortOrder) || 0;
    if (req.body.active !== undefined) {
      existing.active = req.body.active === "false" || req.body.active === false ? false : true;
    }
    await existing.save();

    if (oldPublicId) await destroyImage(oldPublicId);

    res.json(toResponse(existing));
  } catch (err) {
    console.error("[replaceGalleryImage]", err);
    res.status(500).json({ message: err.message || "Replace failed" });
  }
}
