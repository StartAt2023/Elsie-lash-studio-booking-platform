// Simple in-memory gallery items. Replace with persistent storage when ready.

let items = [
  { id: 1, category: "Classic", title: "Classic set 1", imageUrl: "/gallery/classic-1.jpg" },
  { id: 2, category: "Hybrid", title: "Hybrid set 1", imageUrl: "/gallery/hybrid-1.jpg" },
  { id: 3, category: "Volume", title: "Volume set 1", imageUrl: "/gallery/volume-1.jpg" },
];

let currentId = items.length + 1;

export function listGallery() {
  return items;
}

export function getGalleryItemById(id) {
  return items.find((i) => i.id === id) || null;
}

export function createGalleryItem(data) {
  const item = {
    id: currentId++,
    title: data.title,
    category: data.category || "Classic",
    imageUrl: data.imageUrl || "",
    description: data.description || "",
    createdAt: new Date().toISOString(),
  };
  items.push(item);
  return item;
}

export function deleteGalleryItem(id) {
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  return true;
}

