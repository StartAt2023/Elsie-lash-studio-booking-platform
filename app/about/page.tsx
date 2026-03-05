export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero + intro */}
      <section className="px-5 py-24 sm:py-32 md:py-40">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-16 md:flex-row md:items-start md:gap-20">
            {/* Profile image placeholder */}
            <div
              className="shrink-0 overflow-hidden rounded-2xl border border-borderSoft/60 bg-white shadow-soft"
              style={{ width: "min(300px, 100%)", aspectRatio: "1" }}
            >
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-serif text-6xl text-gold/50">✦</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
                About
              </p>
              <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
                Meet your lash artist
              </h1>
              <p className="mt-8 leading-relaxed text-muted">
                With over five years of experience in lash artistry, I’m
                dedicated to helping you look and feel your best. What started as
                a passion for beauty and precision has grown into a studio
                built on trust, technique, and attention to detail.
              </p>
              <p className="mt-6 leading-relaxed text-muted">
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
      <section className="border-t border-borderSoft/80 px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
            Credentials
          </p>
          <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
            Certifications & training
          </h2>
          <p className="mt-4 text-muted">
            Continuously trained in technique, safety, and hygiene.
          </p>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-borderSoft/60 bg-white p-6 shadow-soft"
              >
                <span className="font-serif text-3xl text-gold/50">◆</span>
                <span className="mt-3 text-sm font-medium text-muted">
                  Certification {i}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hygiene & safety */}
      <section className="border-t border-borderSoft/80 px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl">
          <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
            Safety
          </p>
          <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
            Hygiene & safety
          </h2>
          <p className="mt-4 text-muted">
            Your comfort and safety come first.
          </p>
          <div className="mt-12 rounded-2xl border border-borderSoft/60 bg-white p-8 shadow-soft sm:p-10">
            <p className="leading-relaxed text-muted">
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
