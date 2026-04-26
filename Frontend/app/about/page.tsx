"use client";

import { useLocale } from "@/components/LocaleProvider";
import { SectionTitle } from "@/components/SectionTitle";

export default function AboutPage() {
  const { m, t } = useLocale();
  const a = m.aboutPage;
  return (
    <main className="min-h-screen bg-cream">
      <section className="px-5 py-20 sm:py-28 md:py-36">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-14 md:flex-row md:items-start md:gap-20 lg:gap-24">
            <div
              className="w-full max-w-sm shrink-0 overflow-hidden rounded-2xl border border-borderSoft/60 bg-gradient-to-b from-white to-cream/80 shadow-soft"
              style={{ aspectRatio: "1" }}
            >
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-serif text-7xl text-gold/30">✦</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
                {a.kicker}
              </p>
              <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
                {a.title}
              </h1>
              <p className="mt-8 leading-relaxed text-muted sm:text-lg">{a.p1}</p>
              <p className="mt-6 leading-relaxed text-muted sm:text-lg">{a.p2}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-borderSoft/80 px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            kicker={a.credKicker}
            title={a.credTitle}
            lead={a.credLead}
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:mt-16 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center rounded-2xl border border-borderSoft/50 bg-white p-8 text-center shadow-soft"
              >
                <span className="font-serif text-3xl text-gold/40">◆</span>
                <span className="mt-3 text-sm font-medium text-muted">
                  {t("aboutPage.certPlaceholder", { n: i })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-borderSoft/80 px-5 py-20 sm:py-32">
        <div className="mx-auto max-w-2xl">
          <SectionTitle kicker={a.safetyKicker} title={a.safetyTitle} lead={a.safetyLead} />
          <div className="mt-10 rounded-2xl border border-borderSoft/60 bg-white p-8 shadow-soft sm:mt-12 sm:p-10">
            <p className="leading-relaxed text-muted">{a.safetyBody}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
