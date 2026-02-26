export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero + intro */}
      <section className="bg-gradient-to-b from-pink-50 to-white px-4 py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-12">
            {/* Profile image placeholder */}
            <div
              className="shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200/80 shadow-md ring-1 ring-pink-100/50"
              style={{ width: "min(280px, 100%)", aspectRatio: "1" }}
            >
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-6xl font-serif text-pink-400/60">✦</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-pink-900 sm:text-4xl">
                Meet your lash artist
              </h1>
              <p className="mt-6 text-pink-700/90 leading-relaxed">
                With over five years of experience in lash artistry, I’m
                dedicated to helping you look and feel your best. What started as
                a passion for beauty and precision has grown into a studio
                built on trust, technique, and attention to detail.
              </p>
              <p className="mt-4 text-pink-700/90 leading-relaxed">
                Every set is customized to your eye shape and style—whether
                you want a natural enhancement or bold volume. I’m here to
                guide you through the process and ensure a comfortable,
                beautiful result.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="border-t border-pink-100 px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-2xl font-semibold text-pink-900 sm:text-3xl">
            Certifications & training
          </h2>
          <p className="mt-2 text-pink-700/80">
            Continuously trained in technique, safety, and hygiene.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-xl bg-gradient-to-br from-pink-50 to-pink-100/80 flex flex-col items-center justify-center border border-pink-100 p-4"
              >
                <span className="text-3xl font-serif text-pink-400/60">◆</span>
                <span className="mt-2 text-sm font-medium text-pink-700/80">
                  Certification {i}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hygiene & safety */}
      <section className="border-t border-pink-100 bg-pink-50/40 px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-pink-900 sm:text-3xl">
            Hygiene & safety
          </h2>
          <p className="mt-2 text-pink-700/80">
            Your comfort and safety come first.
          </p>
          <div className="mt-8 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-pink-800/90 leading-relaxed">
              Every appointment is carried out in a clean, sanitized
              environment. All tools are disinfected between clients, and
              single-use disposables are used where appropriate. Premium,
              eye-safe adhesives and products are selected for quality and
              compatibility. If you have allergies or sensitivities, please
              let me know before your visit so we can plan accordingly.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
