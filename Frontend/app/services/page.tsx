"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getServices, type Service, type ApiError } from "@/lib/api";

function formatPrice(price: number): string {
  return `From $${price}`;
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}–${h + 1} h` : `${h} h`;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getServices()
      .then((data) => {
        if (!cancelled) setServices(data);
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

      {/* Service cards — from API */}
      <section className="border-t border-borderSoft/80 px-5 pb-24 sm:pb-32">
        <div className="mx-auto max-w-5xl">
          {loading && (
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-borderSoft/60 bg-white shadow-soft">
              <p className="text-muted">Loading services…</p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-borderSoft/60 bg-white p-8 shadow-soft">
              <p className="text-charcoal font-medium">Something went wrong</p>
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

          {!loading && !error && services.length === 0 && (
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-borderSoft/60 bg-white shadow-soft">
              <p className="text-muted">No services available at the moment. Check back later.</p>
            </div>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="flex flex-col rounded-2xl border border-borderSoft/60 bg-white p-8 shadow-soft transition hover:shadow-cardHover"
                >
                  <h2 className="font-serif text-2xl font-semibold tracking-tight text-charcoal">
                    {service.name}
                  </h2>
                  <div className="mt-5 flex flex-wrap gap-2 text-sm text-muted">
                    <span className="font-medium">{formatPrice(service.price)}</span>
                    <span className="text-borderSoft">·</span>
                    <span>{formatDuration(service.durationMinutes)}</span>
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
          )}
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
