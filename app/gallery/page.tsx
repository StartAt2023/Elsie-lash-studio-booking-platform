import Gallery from "@/components/Gallery";

export default function GalleryPage() {
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
        <div className="mt-16">
          <Gallery />
        </div>
      </div>
    </main>
  );
}
