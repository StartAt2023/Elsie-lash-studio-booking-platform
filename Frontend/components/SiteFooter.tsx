"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function SiteFooter() {
  const { m } = useLocale();
  return (
    <footer className="border-t border-borderSoft/80 bg-cream/80 px-5 py-14">
      <div className="mx-auto max-w-5xl text-center">
        <p className="font-serif text-lg font-medium text-charcoal">{m.header.brand}</p>
        <p className="mt-3 text-sm text-muted">
          © {new Date().getFullYear()} {m.header.brand}. {m.home.footer}
        </p>
      </div>
    </footer>
  );
}
