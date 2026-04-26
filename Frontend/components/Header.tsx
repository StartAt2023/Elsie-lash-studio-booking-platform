"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocale } from "@/components/LocaleProvider";

export default function Header() {
  const pathname = usePathname();
  const { m } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: m.nav.home },
    { href: "/services", label: m.nav.services },
    { href: "/gallery", label: m.nav.gallery },
    { href: "/booking", label: m.nav.book },
    { href: "/about", label: m.nav.about },
    { href: "/policies", label: m.nav.policies },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-borderSoft/80 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 font-serif text-lg font-semibold tracking-tight text-charcoal sm:gap-3 sm:text-xl md:text-2xl"
        >
          <Image
            src="/logo.png"
            alt={m.header.brand}
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
            priority
          />
          <span className="truncate">{m.header.brand}</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex gap-8" aria-label={m.header.mainNav}>
            {navLinks.map(({ href, label }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-medium tracking-luxury transition-colors ${
                    active ? "text-charcoal" : "text-muted hover:text-charcoal"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <LanguageSwitcher />
          <Link
            href="/booking"
            className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            {m.header.bookCta}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher compact />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2.5 text-charcoal transition hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={m.header.openMenu}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" id="mobile-nav">
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            aria-label={m.header.closeMenu}
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-borderSoft/80 bg-cream shadow-card">
            <div className="flex items-center justify-between border-b border-borderSoft/60 px-4 py-4">
              <span className="font-serif text-lg font-semibold text-charcoal">{m.nav.menuTitle}</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-muted hover:bg-white/80"
                aria-label={m.header.closeMenu}
              >
                <CloseIcon />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-3" aria-label={m.header.mainNav}>
              {navLinks.map(({ href, label }) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-xl px-4 py-3 text-sm font-medium tracking-luxury transition ${
                      active ? "bg-gold/15 text-charcoal" : "text-muted hover:bg-white/60 hover:text-charcoal"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              <Link
                href="/booking"
                className="mt-3 rounded-full bg-gold px-4 py-3.5 text-center text-sm font-medium tracking-luxury text-cream shadow-soft"
              >
                {m.header.bookCta}
              </Link>
            </nav>
            <div className="mt-auto border-t border-borderSoft/60 p-4">
              <LanguageSwitcher className="w-full justify-center" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
      <path
        fillRule="evenodd"
        d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
      <path
        fillRule="evenodd"
        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
