"use client";

import { useCallback, useEffect, useState } from "react";

export type GalleryCategory = "All" | "Classic" | "Hybrid" | "Volume";

const CATEGORIES: GalleryCategory[] = ["All", "Classic", "Hybrid", "Volume"];

export interface GalleryItem {
  id: string;
  category: Exclude<GalleryCategory, "All">;
  /** 添加图片时在此处填写路径，例如 "/gallery/classic-1.jpg" */
  src?: string;
  alt: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { id: "1", category: "Classic", alt: "Classic lash style 1" },
  { id: "2", category: "Classic", alt: "Classic lash style 2" },
  { id: "3", category: "Classic", alt: "Classic lash style 3" },
  { id: "4", category: "Classic", alt: "Classic lash style 4" },
  { id: "5", category: "Hybrid", alt: "Hybrid lash style 1" },
  { id: "6", category: "Hybrid", alt: "Hybrid lash style 2" },
  { id: "7", category: "Hybrid", alt: "Hybrid lash style 3" },
  { id: "8", category: "Hybrid", alt: "Hybrid lash style 4" },
  { id: "9", category: "Volume", alt: "Volume lash style 1" },
  { id: "10", category: "Volume", alt: "Volume lash style 2" },
  { id: "11", category: "Volume", alt: "Volume lash style 3" },
  { id: "12", category: "Volume", alt: "Volume lash style 4" },
];

function ImagePlaceholderBox({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200/80 ${className ?? ""}`}
      aria-hidden
    >
      <span className="text-pink-400/60 text-4xl font-serif">✦</span>
    </div>
  );
}

export default function Gallery() {
  const [category, setCategory] = useState<GalleryCategory>("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filtered =
    category === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === category);

  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  useEffect(() => {
    if (!lightboxItem) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [lightboxItem, closeLightbox]);

  return (
    <>
      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition sm:px-5 sm:py-2.5 ${
              category === cat
                ? "bg-pink-500 text-white shadow-md"
                : "bg-pink-100 text-pink-800 hover:bg-pink-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Responsive grid - 每个位置是一个框，有 src 时显示图片 */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:gap-6">
        {filtered.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightboxItem(item)}
            className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
          >
            {item.src ? (
              <>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-pink-900/0 transition group-hover:bg-pink-900/10" />
              </>
            ) : (
              <ImagePlaceholderBox className="absolute inset-0 h-full w-full transition group-hover:opacity-90" />
            )}
          </button>
        ))}
      </div>

      {/* Lightbox modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close lightbox"
          >
            <CloseIcon />
          </button>
          <div
            className="relative max-h-[90vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxItem.src ? (
              <img
                src={lightboxItem.src}
                alt={lightboxItem.alt}
                className="max-h-[90vh] w-auto rounded-lg object-contain shadow-2xl"
              />
            ) : (
              <ImagePlaceholderBox className="aspect-[4/5] w-full max-w-md rounded-lg sm:max-w-lg" />
            )}
            <p className="mt-2 text-center text-sm text-white/90">
              {lightboxItem.category} — {lightboxItem.alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
