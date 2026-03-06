"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setAdminSession } from "@/lib/adminAuth";

/**
 * TEMPORARY: Password gate for admin. No backend auth.
 * Replace with server-side login (e.g. NextAuth) later.
 * Uses NEXT_PUBLIC_ADMIN_PASSWORD (visible in client bundle — use a throwaway password).
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!expectedPassword) {
      setError("Admin login is not configured. Set NEXT_PUBLIC_ADMIN_PASSWORD.");
      setLoading(false);
      return;
    }
    if (password !== expectedPassword) {
      setError("Incorrect password.");
      setLoading(false);
      return;
    }
    setAdminSession();
    router.replace("/admin");
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-sm pt-16">
      <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
        Admin
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-charcoal">
        Sign in
      </h1>
      <p className="mt-2 text-sm text-muted">
        Temporary password gate. Replace with real auth later.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="admin-password" className="sr-only">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            autoComplete="current-password"
            className="w-full rounded-xl border border-borderSoft/60 bg-white px-4 py-3.5 text-charcoal placeholder-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            disabled={loading}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gold py-3.5 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center">
        <Link href="/" className="text-sm text-muted hover:text-charcoal">
          Back to site
        </Link>
      </p>
    </div>
  );
}
