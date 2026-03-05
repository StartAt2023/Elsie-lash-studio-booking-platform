import {
  listGallery,
  getGalleryItemById,
  createGalleryItem,
  deleteGalleryItem,
} from "../models/galleryModel.js";

export function getGalleryItems(req, res) {
  res.json(listGallery());
}

export function getGalleryItem(req, res) {
  const id = Number(req.params.id);
  const item = getGalleryItemById(id);
  if (!item) return res.status(404).json({ message: "Gallery item not found" });
  res.json(item);
}

export function createGalleryItemHandler(req, res) {
  const { title, imageUrl } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ message: "title and imageUrl are required" });
  }
  const item = createGalleryItem(req.body);
  res.status(201).json(item);
}

export function deleteGalleryItemHandler(req, res) {
  const id = Number(req.params.id);
  const ok = deleteGalleryItem(id);
  if (!ok) return res.status(404).json({ message: "Gallery item not found" });
  res.status(204).send();
}

