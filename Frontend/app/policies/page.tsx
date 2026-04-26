"use client";

import Link from "next/link";
import PoliciesAccordion, { type AccordionSection } from "@/components/PoliciesAccordion";
import { useLocale } from "@/components/LocaleProvider";
import CTAButton from "@/components/CTAButton";
import type { MessageDict } from "@/locales/en";

const SECTION_ORDER: (keyof MessageDict["policySections"])[] = [
  "booking-deposits",
  "cancellation-reschedule",
  "no-show",
  "late-arrival",
  "refund-satisfaction",
  "prep",
  "aftercare",
  "allergies",
  "privacy",
];

function PolicyContent({
  id,
  block,
}: {
  id: string;
  block: MessageDict["policySections"][keyof MessageDict["policySections"]];
}) {
  if (id === "prep" && "li1" in block) {
    return (
      <>
        <p>{block.p1}</p>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-muted">
          <li>{block.li1}</li>
          <li>{block.li2}</li>
          <li>{block.li3}</li>
        </ul>
        <p className="mt-3">{block.p2}</p>
      </>
    );
  }
  if ("p1" in block && "p2" in block) {
    return (
      <>
        <p>{block.p1}</p>
        {block.p2 && <p className="mt-3">{block.p2}</p>}
      </>
    );
  }
  return null;
}

export default function PoliciesPage() {
  const { m } = useLocale();
  const p = m.policiesPage;
  const pol = m.policySections;

  const sections: AccordionSection[] = SECTION_ORDER.map((key) => {
    const id = String(key);
    const data = pol[key];
    return {
      id,
      title: data.title,
      content: <PolicyContent id={id} block={data} />,
    };
  });

  return (
    <main className="min-h-screen bg-cream">
      <section className="px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
            {p.kicker}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
            {p.title}
          </h1>
          <p className="mt-4 leading-relaxed text-muted sm:text-lg">{p.lead}</p>
        </div>
      </section>

      <section className="border-t border-borderSoft/80 px-5 pb-24 sm:pb-32">
        <div className="mx-auto max-w-2xl pt-12 sm:pt-16">
          <PoliciesAccordion sections={sections} />

          <div className="mt-16 flex justify-center">
            <CTAButton href="/booking" variant="primary">
              {p.cta}
            </CTAButton>
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            <Link href="/" className="text-gold underline-offset-2 hover:underline">
              {m.common.backToSite}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
