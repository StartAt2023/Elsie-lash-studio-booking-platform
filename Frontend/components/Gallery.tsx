"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";

export type GalleryCategory = "All" | "Classic" | "Hybrid" | "Volume";

export interface GalleryItem {
  id: string;
  category: Exclude<GalleryCategory, "All">;
  src?: string;
  alt: string;
}

const PLACEHOLDER_ITEMS: GalleryItem[] = [
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
      className={`flex items-center justify-center rounded-2xl border border-borderSoft/60 bg-gradient-to-b from-white to-cream/80 shadow-soft ${className ?? ""}`}
      aria-hidden
    >
      <span className="font-serif text-4xl text-gold/40">✦</span>
    </div>
  );
}

interface GalleryProps {
  items?: GalleryItem[];
}

export default function Gallery({ items = [] }: GalleryProps) {
  const { m } = useLocale();
  const g = m.gallery;
  const categories: { id: GalleryCategory; label: string }[] = [
    { id: "All", label: g.categoryAll },
    { id: "Classic", label: g.categoryClassic },
    { id: "Hybrid", label: g.categoryHybrid },
    { id: "Volume", label: g.categoryVolume },
  ];

  const [category, setCategory] = useState<GalleryCategory>("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const list = items.length > 0 ? items : PLACEHOLDER_ITEMS;
  const filtered = category === "All" ? list : list.filter((item) => item.category === category);

  const labelFor = (cat: GalleryItem["category"]) =>
    cat === "Classic" ? g.categoryClassic : cat === "Hybrid" ? g.categoryHybrid : g.categoryVolume;

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
      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
        {categories.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setCategory(id)}
            className={`rounded-full px-4 py-2.5 text-sm font-medium tracking-luxury transition sm:px-5 ${
              category === id
                ? "bg-gold text-cream shadow-soft"
                : "border border-borderSoft/60 bg-white text-muted shadow-soft hover:border-gold/60 hover:text-charcoal"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {filtered.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightboxItem(item)}
            className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-borderSoft/50 bg-white shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            {item.src ? (
              <>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent opacity-0 transition group-hover:opacity-100" />
              </>
            ) : (
              <ImagePlaceholderBox className="absolute inset-0 h-full w-full transition group-hover:opacity-95" />
            )}
          </button>
        ))}
      </div>

      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/75 p-5"
          role="dialog"
          aria-modal="true"
          aria-label={g.lightbox}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={m.common.close}
          >
            <CloseIcon />
          </button>
          <div
            className="relative max-h-[85vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxItem.src ? (
              <img
                src={lightboxItem.src}
                alt={lightboxItem.alt}
                className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-cardHover"
              />
            ) : (
              <ImagePlaceholderBox className="aspect-[4/5] w-full max-w-md rounded-2xl sm:max-w-lg" />
            )}
            <p className="mt-4 text-center text-sm text-white/90">
              {labelFor(lightboxItem.category)} — {lightboxItem.alt}
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
