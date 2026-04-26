"use client";

import { useEffect, useState } from "react";
import { getServices, type Service, type ApiError } from "@/lib/api";
import { useLocale } from "@/components/LocaleProvider";
import { getLocaleDateTag } from "@/lib/i18n";
import { SectionTitle } from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import CTAButton from "@/components/CTAButton";

function useAudFormat(locale: "en" | "zh") {
  const tag = getLocaleDateTag(locale);
  return (n: number) =>
    new Intl.NumberFormat(tag === "zh-CN" ? "zh-CN" : "en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(n);
}

function formatDurationLabel(
  mins: number,
  t: (k: string, p?: Record<string, string | number | undefined | null>) => string
) {
  if (mins < 60) return t("servicesPage.durationMin", { n: mins });
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (m) return t("servicesPage.durationRange", { a: h, b: h + 1 });
  return t("servicesPage.durationH", { n: h });
}

export default function ServicesPage() {
  const { t, m, locale } = useLocale();
  const s = m.servicesPage;
  const formatAud = useAudFormat(locale);

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
      <section className="px-5 pb-20 pt-20 sm:pb-28 sm:pt-28 md:pb-32 md:pt-36">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted sm:text-sm">
            {s.kicker}
          </p>
          <h1 className="mt-5 font-serif text-4xl font-semibold tracking-tight text-charcoal sm:text-5xl">
            {s.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">{s.lead}</p>
        </div>
      </section>

      <section className="border-t border-borderSoft/80 px-5 pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl">
          {loading && (
            <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-borderSoft/60 bg-white/80 shadow-soft">
              <p className="text-muted">{s.loading}</p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-borderSoft/60 bg-white p-8 shadow-soft">
              <p className="font-medium text-charcoal">{m.common.errorTitle}</p>
              <p className="mt-2 text-muted">{error.message}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-full bg-gold px-6 py-2.5 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
              >
                {m.common.tryAgain}
              </button>
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-borderSoft/80 bg-white/60 py-16 shadow-soft">
              <p className="max-w-md text-center text-muted">{s.empty}</p>
            </div>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  bookLabel={m.common.bookNow}
                  priceLine={t("servicesPage.fromPrice", { price: formatAud(service.price) })}
                  durationLine={formatDurationLabel(service.durationMinutes, t)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-borderSoft/80 px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl">
          <SectionTitle
            kicker={s.aftercareKicker}
            title={s.aftercareTitle}
            lead={s.aftercareLead}
          />
          <div className="mt-12 space-y-10 sm:mt-16 sm:space-y-12">
            <div>
              <h3 className="font-serif text-xl font-semibold text-charcoal">{s.faq1Title}</h3>
              <p className="mt-4 leading-relaxed text-muted">{s.faq1Body}</p>
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-charcoal">{s.faq2Title}</h3>
              <ul className="mt-4 space-y-3 leading-relaxed text-muted">
                <li className="flex gap-3">
                  <span className="shrink-0 text-gold">·</span>
                  <span>{s.faq2b1}</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-gold">·</span>
                  <span>{s.faq2b2}</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-gold">·</span>
                  <span>{s.faq2b3}</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-gold">·</span>
                  <span>{s.faq2b4}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-14 sm:mt-16">
            <CTAButton href="/booking" variant="primary">
              {s.cta}
            </CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}
