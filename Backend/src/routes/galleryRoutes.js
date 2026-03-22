import { Router } from "express";
import multer from "multer";
import {
  getGalleryItems,
  getGalleryAdminItems,
  getGalleryItem,
  createGalleryItemHandler,
  updateGalleryItemHandler,
  deleteGalleryItemHandler,
} from "../controllers/galleryController.js";
import {
  uploadGalleryImageHandler,
  replaceGalleryImageHandler,
} from "../controllers/galleryUploadController.js";
import { requireAdminPassword } from "../middleware/adminAuth.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ok = /^image\/(jpeg|jpg|png|gif|webp)$/i.test(file.mimetype);
    if (!ok) return cb(new Error("Only image uploads are allowed (jpeg, png, gif, webp)."));
    cb(null, true);
  },
});

function handleUploadSingle(req, res, next) {
  upload.single("image")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || "Invalid file" });
    next();
  });
}

const router = Router();

router.get("/admin/all", requireAdminPassword, getGalleryAdminItems);
router.post("/upload", requireAdminPassword, handleUploadSingle, uploadGalleryImageHandler);
router.post(
  "/:id/replace-image",
  requireAdminPassword,
  handleUploadSingle,
  replaceGalleryImageHandler
);
router.get("/", getGalleryItems);
router.get("/:id", getGalleryItem);
router.post("/", createGalleryItemHandler);
router.put("/:id", updateGalleryItemHandler);
router.delete("/:id", deleteGalleryItemHandler);

export default router;
