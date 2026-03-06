"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getAdminSession, clearAdminSession } from "@/lib/adminAuth";

/**
 * TEMPORARY: Protects /admin routes with sessionStorage flag. Replace with server-side auth later.
 */

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/settings", label: "Settings" },
];

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
      <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAllowed(true);
      return;
    }
    if (!getAdminSession()) {
      router.replace("/admin/login");
      return;
    }
    setAllowed(true);
  }, [isLoginPage, router]);

  function handleLogout() {
    clearAdminSession();
    router.replace("/admin/login");
  }

  if (isLoginPage) {
    return <div className="min-h-screen bg-cream">{children}</div>;
  }

  if (allowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Top header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-borderSoft/80 bg-white px-4 py-3 shadow-soft md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="rounded-lg p-2 text-charcoal transition hover:bg-cream focus:outline-none focus:ring-2 focus:ring-gold md:hidden"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <XIcon /> : <MenuIcon />}
          </button>
          <Link href="/admin" className="font-serif text-lg font-semibold tracking-tight text-charcoal md:text-xl">
            Elsie Admin
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium tracking-luxury text-muted transition hover:text-charcoal"
          >
            Log out
          </button>
          <Link
            href="/"
            className="text-sm font-medium tracking-luxury text-muted transition hover:text-charcoal"
          >
            Back to site
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - overlay on mobile when open */}
        <aside
          className={`fixed left-0 top-[53px] bottom-0 z-30 w-64 transform border-r border-borderSoft/80 bg-white shadow-card transition-transform duration-200 ease-out md:static md:top-0 md:translate-x-0 md:shadow-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex flex-col gap-1 p-4 md:pt-6" aria-label="Admin navigation">
            {navItems.map(({ href, label }) => {
              const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium tracking-luxury transition ${
                    isActive
                      ? "bg-gold/15 text-charcoal"
                      : "text-muted hover:bg-cream hover:text-charcoal"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile overlay when sidebar is open */}
        {sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-charcoal/20 md:hidden"
            aria-label="Close menu"
          />
        )}

        {/* Main content */}
        <main className="min-h-[calc(100vh-53px)] flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
