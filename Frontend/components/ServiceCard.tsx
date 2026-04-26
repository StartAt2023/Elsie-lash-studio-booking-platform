import Link from "next/link";
import type { Service } from "@/lib/api";

type Props = {
  service: Service;
  bookLabel: string;
  priceLine: string;
  durationLine: string;
};

/**
 * Public services grid card — pass formatted `priceLine` and `durationLine` for i18n.
 */
export default function ServiceCard({ service, bookLabel, priceLine, durationLine }: Props) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-borderSoft/60 bg-white p-7 shadow-soft transition duration-200 hover:shadow-cardHover sm:p-8">
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-charcoal group-hover:text-gold/90">
        {service.name}
      </h2>
      <div className="mt-4 flex flex-wrap items-baseline gap-2 text-sm text-muted">
        <span className="font-medium text-charcoal/90">{priceLine}</span>
        <span className="text-borderSoft">·</span>
        <span>{durationLine}</span>
      </div>
      {service.description && (
        <p className="mt-5 flex-1 leading-relaxed text-muted">{service.description}</p>
      )}
      <Link
        href="/booking"
        className="mt-8 block w-full rounded-full bg-gold py-3.5 text-center text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      >
        {bookLabel}
      </Link>
    </article>
  );
}
