import Gallery from "@/components/Gallery";

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-3xl font-semibold text-pink-900 sm:text-4xl">
          Gallery
        </h1>
        <p className="mt-2 text-pink-700/80">
          Browse our lash styles by category.
        </p>
        <Gallery />
      </div>
    </main>
  );
}
