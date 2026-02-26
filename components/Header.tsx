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
    <header className="sticky top-0 z-50 border-b border-pink-100/60 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-tight text-pink-900 sm:text-2xl"
        >
          Elsie Lash Studio
        </Link>
        <nav className="hidden gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-pink-800 transition hover:text-pink-600"
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/booking"
          className="rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-pink-600"
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}
