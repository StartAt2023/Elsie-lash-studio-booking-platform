"use client";

import { useEffect, useState } from "react";
import { getGallery, type ApiError, type GalleryItemApi } from "@/lib/api";
import Gallery from "@/components/Gallery";

export type GalleryItemClient = {
  id: string;
  category: "Classic" | "Hybrid" | "Volume";
  src?: string;
  alt: string;
};

function mapApiToGalleryItem(item: GalleryItemApi): GalleryItemClient {
  const category =
    item.category === "Hybrid" || item.category === "Volume"
      ? item.category
      : "Classic";
  return {
    id: String(item.id),
    category,
    src: item.imageUrl || undefined,
    alt: item.title,
  };
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItemClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getGallery()
      .then((data) => {
        if (!cancelled) setItems(data.map(mapApiToGalleryItem));
      })
      .catch((err: ApiError) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto max-w-5xl px-5 py-24 sm:py-32">
        <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
          Portfolio
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
          Gallery
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Browse our lash styles by category.
        </p>

        {loading && (
          <div className="mt-16 flex min-h-[320px] items-center justify-center rounded-2xl border border-borderSoft/60 bg-white shadow-soft">
            <p className="text-muted">Loading gallery…</p>
          </div>
        )}

        {error && (
          <div className="mt-16 rounded-2xl border border-borderSoft/60 bg-white p-8 shadow-soft">
            <p className="font-medium text-charcoal">Something went wrong</p>
            <p className="mt-2 text-muted">{error.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-gold px-6 py-2.5 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="mt-16">
            <Gallery items={items} />
          </div>
        )}
      </div>
    </main>
  );
}
