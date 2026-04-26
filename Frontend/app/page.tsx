"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { SectionTitle } from "@/components/SectionTitle";
import CTAButton from "@/components/CTAButton";

export default function HomePage() {
  const { m } = useLocale();
  const { home: h } = m;

  const featured = [
    { key: "classic" as const, href: "/services" },
    { key: "volume" as const, href: "/services" },
    { key: "lift" as const, href: "/services" },
  ];

  return (
    <main className="min-h-screen bg-cream">
      <section className="relative overflow-hidden px-5 pb-28 pt-24 sm:pb-36 sm:pt-32 md:pb-44 md:pt-40">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(198, 167, 110, 0.18), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted sm:text-sm">
            {h.heroKicker}
          </p>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.12] tracking-tight text-charcoal sm:text-5xl md:text-6xl">
            {h.heroTitle}{" "}
            <span className="text-gold">{h.heroTitleAccent}</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            {h.heroSubtitle}
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:mt-14 sm:flex-row sm:justify-center">
            <CTAButton href="/booking" variant="primary">
              {h.heroCta}
            </CTAButton>
            <CTAButton href="/services" variant="secondary">
              {h.browseServicesCta}
            </CTAButton>
          </div>
        </div>
      </section>

      <section className="border-t border-borderSoft/80 px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            kicker={h.servicesKicker}
            title={h.servicesTitle}
            lead={h.servicesLead}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {featured.map(({ key, href }) => {
              const item = h.featured[key];
              return (
                <Link
                  key={key}
                  href={href}
                  className="group flex flex-col rounded-2xl border border-borderSoft/60 bg-white p-8 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-cardHover"
                >
                  <h3 className="font-serif text-xl font-semibold tracking-tight text-charcoal transition group-hover:text-gold">
                    {item.title}
                  </h3>
                  <p className="mt-4 flex-1 leading-relaxed text-muted">{item.desc}</p>
                  <span className="mt-6 text-sm font-medium text-gold">
                    {m.common.learnMore} →
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-14 text-center">
            <Link
              href="/services"
              className="text-sm font-medium text-gold underline-offset-4 transition hover:underline"
            >
              {h.servicesViewAll}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-borderSoft/80 px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            kicker={h.portfolioKicker}
            title={h.portfolioTitle}
            lead={h.portfolioLead}
          />
          <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-[3/4] items-center justify-center rounded-2xl border border-borderSoft/50 bg-gradient-to-b from-white to-cream/80 shadow-soft"
                aria-hidden
              >
                <span className="font-serif text-4xl text-gold/40">✦</span>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <CTAButton href="/gallery" variant="secondary">
              {h.viewGallery}
            </CTAButton>
          </div>
        </div>
      </section>

      <section className="border-t border-borderSoft/80 px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            kicker={h.testimonialKicker}
            title={h.testimonialTitle}
            lead={h.testimonialLead}
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
            {h.testimonials.map((row: { quote: string; author: string }, i: number) => (
              <blockquote
                key={i}
                className="flex h-full flex-col rounded-2xl border border-borderSoft/60 bg-white p-8 shadow-soft"
              >
                <p className="font-serif text-lg italic leading-relaxed text-charcoal">
                  &ldquo;{row.quote}&rdquo;
                </p>
                <footer className="mt-6 text-sm font-medium text-muted">— {row.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-borderSoft/80 px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
            {h.contactKicker}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
            {h.contactTitle}
          </h2>
          <p className="mt-4 text-muted">{h.contactLead}</p>
          <div className="mt-12 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:gap-8">
            <a
              href={`tel:${h.contactPhone.replace(/\s/g, "")}`}
              className="flex items-center gap-4 rounded-2xl border border-borderSoft/60 bg-white px-6 py-5 text-left shadow-soft transition hover:shadow-card sm:min-w-[260px]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream text-gold">
                <PhoneIcon />
              </span>
              <span className="font-medium text-charcoal">{h.contactPhone}</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-borderSoft/60 bg-white px-6 py-5 text-left shadow-soft transition hover:shadow-card sm:min-w-[260px]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream text-gold">
                <InstagramIcon />
              </span>
              <span className="min-w-0 break-words font-medium text-charcoal">{h.contactInstagram}</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C2.95 22.5 0 19.55 0 15.75V9A3 3 0 013 6h1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
