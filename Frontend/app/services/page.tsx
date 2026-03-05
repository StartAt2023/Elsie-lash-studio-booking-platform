import Link from "next/link";

const SERVICES = [
  {
    name: "Classic",
    price: "From $120",
    duration: "90–120 min",
    description:
      "One extension per natural lash for a refined, natural look. Perfect for everyday wear and first-time clients.",
  },
  {
    name: "Hybrid",
    price: "From $140",
    duration: "90–120 min",
    description:
      "A blend of classic and volume lashes for added fullness with a soft, wispy effect. Ideal for a balanced, eye-opening look.",
  },
  {
    name: "Volume",
    price: "From $160",
    duration: "120–150 min",
    description:
      "Lightweight multi-dimensional fans create a full, fluffy lash line. Great for drama without heaviness.",
  },
  {
    name: "Mega Volume",
    price: "From $180",
    duration: "150–180 min",
    description:
      "Maximum density and impact with ultra-fine fans. For those who want bold, statement lashes.",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="px-5 py-24 sm:py-32 md:py-40">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted sm:text-sm">
            Services
          </p>
          <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-charcoal sm:text-5xl">
            Our lash services
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Expert lash extensions and lifts tailored to your style. Choose the
            look that suits you.
          </p>
        </div>
      </section>

      {/* Service cards */}
      <section className="border-t border-borderSoft/80 px-5 pb-24 sm:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <article
                key={service.name}
                className="flex flex-col rounded-2xl border border-borderSoft/60 bg-white p-8 shadow-soft transition hover:shadow-cardHover"
              >
                <h2 className="font-serif text-2xl font-semibold tracking-tight text-charcoal">
                  {service.name}
                </h2>
                <div className="mt-5 flex flex-wrap gap-2 text-sm text-muted">
                  <span className="font-medium">{service.price}</span>
                  <span className="text-borderSoft">·</span>
                  <span>{service.duration}</span>
                </div>
                <p className="mt-5 flex-1 leading-relaxed text-muted">
                  {service.description}
                </p>
                <Link
                  href="/booking"
                  className="mt-8 block w-full rounded-full bg-gold py-3.5 text-center text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream"
                >
                  Book Now
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Aftercare */}
      <section className="border-t border-borderSoft/80 px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl">
          <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
            Aftercare
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
            Maintenance & care
          </h2>
          <p className="mt-4 text-muted">
            Get the most out of your lash extensions.
          </p>

          <div className="mt-14 space-y-14">
            <div>
              <h3 className="font-serif text-xl font-semibold text-charcoal">
                How long do lashes last?
              </h3>
              <p className="mt-4 leading-relaxed text-muted">
                With proper care, classic and volume lash extensions typically
                last 3–4 weeks as your natural lashes shed. We recommend a fill
                every 2–3 weeks to keep your look full. Lash lifts and tints
                last 6–8 weeks depending on your lash growth cycle.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl font-semibold text-charcoal">
                Maintenance tips
              </h3>
              <ul className="mt-4 space-y-3 leading-relaxed text-muted">
                <li className="flex gap-3">
                  <span className="text-gold">·</span>
                  <span>
                    Avoid water, steam, and heavy rubbing for the first 24–48
                    hours after your appointment.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold">·</span>
                  <span>
                    Use oil-free makeup remover and avoid oil-based products
                    near the lash line.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold">·</span>
                  <span>
                    Gently brush lashes with a clean spoolie to keep them
                    separated and tidy.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold">·</span>
                  <span>
                    Book fills every 2–3 weeks to maintain fullness and avoid
                    large gaps.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16">
            <Link
              href="/booking"
              className="inline-block rounded-full bg-gold px-8 py-3.5 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream"
            >
              Book your appointment
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
