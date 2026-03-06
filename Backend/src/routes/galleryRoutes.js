import { Router } from "express";
import {
  getGalleryItems,
  getGalleryItem,
  createGalleryItemHandler,
  updateGalleryItemHandler,
  deleteGalleryItemHandler,
} from "../controllers/galleryController.js";

const router = Router();

router.get("/", getGalleryItems);
router.get("/:id", getGalleryItem);
router.post("/", createGalleryItemHandler);
router.put("/:id", updateGalleryItemHandler);
router.delete("/:id", deleteGalleryItemHandler);

export default router;

