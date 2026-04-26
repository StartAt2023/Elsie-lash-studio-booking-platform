"use client";

import BookingForm from "@/components/BookingForm";
import { useLocale } from "@/components/LocaleProvider";

export default function BookingPage() {
  const { m } = useLocale();
  const p = m.bookingPage;
  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto max-w-lg px-5 py-20 sm:py-28 lg:py-32">
        <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
          {p.kicker}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
          {p.title}
        </h1>
        <p className="mt-4 leading-relaxed text-muted">{p.lead}</p>
        <div className="mt-12 sm:mt-16">
          <BookingForm />
        </div>
      </div>
    </main>
  );
}
