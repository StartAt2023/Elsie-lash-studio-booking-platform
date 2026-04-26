"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { Locale } from "@/lib/i18n";

const ORDER: { locale: Locale; short: string }[] = [
  { locale: "en", short: "EN" },
  { locale: "zh", short: "中文" },
];

type Props = {
  className?: string;
  /** Compact pill for tight headers */
  compact?: boolean;
};

export default function LanguageSwitcher({ className = "", compact = false }: Props) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-borderSoft/80 bg-white/80 p-0.5 shadow-soft backdrop-blur-sm ${className}`}
      role="group"
      aria-label="Language"
    >
      {ORDER.map(({ locale: l, short }) => {
        const on = locale === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={`min-w-[2.5rem] rounded-full px-2.5 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
              compact ? "px-2 py-1 text-[0.7rem]" : "sm:px-3.5"
            } ${
              on
                ? "bg-gold text-cream shadow-sm"
                : "text-muted hover:bg-cream/80 hover:text-charcoal"
            }`}
            aria-pressed={on}
            aria-label={l === "en" ? "English" : "中文"}
          >
            {short}
          </button>
        );
      })}
    </div>
  );
}
