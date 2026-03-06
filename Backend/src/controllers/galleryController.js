import Gallery from "../models/Gallery.js";

function toResponse(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id,
    title: obj.title,
    imageUrl: obj.imageUrl,
    category: obj.category ?? "Classic",
    description: obj.description ?? "",
    active: obj.active,
    sortOrder: obj.sortOrder ?? 0,
    createdAt: obj.createdAt,
  };
}

export async function getGalleryItems(req, res) {
  try {
    const docs = await Gallery.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    res.json(
      docs.map((d) => ({
        id: d._id,
        title: d.title,
        imageUrl: d.imageUrl,
        category: d.category ?? "Classic",
        description: d.description ?? "",
        active: d.active,
        sortOrder: d.sortOrder ?? 0,
        createdAt: d.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch gallery" });
  }
}

export async function getGalleryItem(req, res) {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });
    res.json(toResponse(item));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch gallery item" });
  }
}

export async function createGalleryItemHandler(req, res) {
  const { title, imageUrl } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ message: "title and imageUrl are required" });
  }
  try {
    const item = await Gallery.create({
      title: title.trim(),
      imageUrl: imageUrl.trim(),
      category: (req.body.category || "Classic").trim(),
      description: (req.body.description || "").trim(),
      active: req.body.active !== undefined ? req.body.active : true,
      sortOrder: req.body.sortOrder ?? 0,
    });
    res.status(201).json(toResponse(item));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create gallery item" });
  }
}

export async function updateGalleryItemHandler(req, res) {
  try {
    const body = req.body;
    const updates = {};
    ["title", "imageUrl", "category", "description", "active", "sortOrder"].forEach((key) => {
      if (body[key] !== undefined) updates[key] = body[key];
    });
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: "Gallery item not found" });
    res.json(toResponse(item));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update gallery item" });
  }
}

export async function deleteGalleryItemHandler(req, res) {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete gallery item" });
  }
}
