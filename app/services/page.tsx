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
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-pink-50 to-white px-4 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-pink-900 sm:text-5xl">
            Our Lash Services
          </h1>
          <p className="mt-4 text-lg text-pink-700/90">
            Expert lash extensions and lifts tailored to your style. Choose the
            look that suits you.
          </p>
        </div>
      </section>

      {/* Service cards */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <article
                key={service.name}
                className="flex flex-col rounded-2xl border border-pink-100 bg-white p-6 shadow-sm transition hover:border-pink-200 hover:shadow-md"
              >
                <h2 className="font-serif text-2xl font-semibold text-pink-900">
                  {service.name}
                </h2>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-pink-600">
                  <span className="font-medium">{service.price}</span>
                  <span className="text-pink-300">·</span>
                  <span>{service.duration}</span>
                </div>
                <p className="mt-4 flex-1 text-pink-700/90 leading-relaxed">
                  {service.description}
                </p>
                <Link
                  href="/booking"
                  className="mt-6 block w-full rounded-full bg-pink-500 py-3 text-center text-sm font-medium text-white transition hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                >
                  Book Now
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Aftercare */}
      <section className="border-t border-pink-100 bg-pink-50/40 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold text-pink-900 sm:text-4xl">
            Aftercare & maintenance
          </h2>
          <p className="mt-2 text-pink-700/80">
            Get the most out of your lash extensions.
          </p>

          <div className="mt-10 space-y-10">
            <div>
              <h3 className="font-serif text-xl font-semibold text-pink-900">
                How long do lashes last?
              </h3>
              <p className="mt-3 text-pink-700/90 leading-relaxed">
                With proper care, classic and volume lash extensions typically
                last 3–4 weeks as your natural lashes shed. We recommend a fill
                every 2–3 weeks to keep your look full. Lash lifts and tints
                last 6–8 weeks depending on your lash growth cycle.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl font-semibold text-pink-900">
                Maintenance tips
              </h3>
              <ul className="mt-3 space-y-2 text-pink-700/90 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-pink-400">•</span>
                  <span>
                    Avoid water, steam, and heavy rubbing for the first 24–48
                    hours after your appointment.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-400">•</span>
                  <span>
                    Use oil-free makeup remover and avoid oil-based products
                    near the lash line.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-400">•</span>
                  <span>
                    Gently brush lashes with a clean spoolie to keep them
                    separated and tidy.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-400">•</span>
                  <span>
                    Book fills every 2–3 weeks to maintain fullness and avoid
                    large gaps.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <Link
            href="/booking"
            className="mt-10 inline-block rounded-full bg-pink-500 px-6 py-3 font-medium text-white transition hover:bg-pink-600"
          >
            Book your appointment
          </Link>
        </div>
      </section>
    </main>
  );
}
