import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/booking", label: "Book" },
  { href: "/about", label: "About" },
  { href: "/policies", label: "Policies" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-borderSoft/80 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-tight text-charcoal sm:text-2xl"
        >
          Elsie Lash Studio
        </Link>
        <nav className="hidden gap-10 md:flex" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium tracking-luxury text-muted transition-colors hover:text-charcoal"
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/booking"
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream hidden sm:inline-block"
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}
