"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  getCustomers,
  getCustomer,
  getBookings,
  createCustomer,
  updateCustomer,
  type Customer,
  type Booking,
  type ApiError,
  getApiErrorMessage,
} from "@/lib/api";
import { useToast } from "@/components/admin/ToastContext";

const PREDEFINED_TAGS = ["VIP", "Sensitive", "Regular"] as const;

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [drawerSaving, setDrawerSaving] = useState(false);
  const [drawerNotes, setDrawerNotes] = useState("");
  const [drawerTags, setDrawerTags] = useState<string[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [createSaving, setCreateSaving] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", phone: "", email: "", notes: "" });

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getCustomers(), getBookings()])
      .then(([custData, bookData]) => {
        if (!cancelled) {
          setCustomers(custData);
          setBookings(bookData);
        }
      })
      .catch((err: ApiError) => {
        if (!cancelled) setError(getApiErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (selectedId == null) {
      setDetailCustomer(null);
      return;
    }
    setDetailLoading(true);
    getCustomer(selectedId)
      .then((c) => {
        setDetailCustomer(c);
        setDrawerNotes(c.notes ?? "");
        setDrawerTags(c.tags ?? []);
      })
      .catch(() => setDetailCustomer(null))
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  const bookingHistoryForCustomer = useMemo(() => {
    if (!detailCustomer) return [];
    return bookings.filter(
      (b) =>
        (b.phone && b.phone === detailCustomer.phone) ||
        (b.fullName && detailCustomer.name && b.fullName.toLowerCase() === detailCustomer.name.toLowerCase())
    ).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }, [bookings, detailCustomer]);

  async function handleSaveDrawer() {
    if (selectedId == null || !detailCustomer) return;
    setDrawerSaving(true);
    try {
      const updated = await updateCustomer(selectedId, {
        notes: drawerNotes,
        tags: drawerTags,
      });
      setDetailCustomer(updated);
      setCustomers((prev) =>
        prev.map((c) => (String(c.id) === String(selectedId) ? updated : c))
      );
      showToast("Customer updated.");
    } catch (err) {
      showToast(getApiErrorMessage(err as ApiError));
    } finally {
      setDrawerSaving(false);
    }
  }

  function toggleTag(tag: string) {
    setDrawerTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function addCustomTag(tag: string) {
    const t = tag.trim();
    if (t && !drawerTags.includes(t)) setDrawerTags((prev) => [...prev, t]);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.name.trim() || !createForm.phone.trim()) {
      showToast("Name and phone are required.");
      return;
    }
    setCreateSaving(true);
    try {
      const created = await createCustomer({
        name: createForm.name.trim(),
        phone: createForm.phone.trim(),
        email: createForm.email.trim() || undefined,
        notes: createForm.notes.trim() || undefined,
      });
      setCustomers((prev) => [created, ...prev]);
      setCreateForm({ name: "", phone: "", email: "", notes: "" });
      setShowCreate(false);
      showToast("Customer created.");
    } catch (err) {
      showToast(getApiErrorMessage(err as ApiError));
    } finally {
      setCreateSaving(false);
    }
  }

  return (
    <div>
      <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
        Admin
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
        Customers
      </h1>
      <p className="mt-2 text-muted">
        Search and manage customer records. Click a row to view details.
      </p>

      {/* Search + Create */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="min-w-[200px] flex-1">
          <label htmlFor="customer-search" className="sr-only">
            Search by name or phone
          </label>
          <input
            id="customer-search"
            type="text"
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-borderSoft/60 bg-white px-4 py-2.5 text-sm text-charcoal placeholder-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f]"
        >
          New customer
        </button>
      </div>

      {/* List */}
      <div className="mt-6 rounded-2xl border border-borderSoft/60 bg-white shadow-soft overflow-hidden">
        {loading && (
          <div className="flex min-h-[280px] items-center justify-center p-8">
            <p className="text-muted">Loading customers…</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-6">
            <p className="font-medium text-charcoal">Something went wrong</p>
            <p className="mt-1 text-sm text-muted">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 rounded-full bg-gold px-4 py-2 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f]"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filteredCustomers.length === 0 && (
          <div className="flex min-h-[200px] items-center justify-center p-8">
            <p className="text-muted">
              {customers.length === 0
                ? "No customers yet. Create one to get started."
                : "No customers match your search."}
            </p>
          </div>
        )}

        {!loading && !error && filteredCustomers.length > 0 && (
          <ul className="divide-y divide-borderSoft/40">
            {filteredCustomers.map((c) => (
              <li key={String(c.id)}>
                <button
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-cream/50 sm:px-6"
                >
                  <div>
                    <p className="font-medium text-charcoal">{c.name || "—"}</p>
                    <p className="text-sm text-muted">{c.phone || "—"}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(c.tags ?? []).slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-borderSoft/60 bg-cream/50 px-2 py-0.5 text-xs text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detail drawer */}
      {selectedId != null && (
        <>
          <div
            className="fixed inset-0 z-40 bg-charcoal/30"
            aria-hidden
            onClick={() => setSelectedId(null)}
          />
          <aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-borderSoft/80 bg-white shadow-card"
            role="dialog"
            aria-modal="true"
            aria-label="Customer details"
          >
            <div className="flex items-center justify-between border-b border-borderSoft/80 px-4 py-3">
              <h2 className="font-serif text-lg font-semibold text-charcoal">
                Customer details
              </h2>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-lg p-2 text-muted transition hover:bg-cream hover:text-charcoal"
                aria-label="Close"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {detailLoading && (
                <div className="flex justify-center py-8">
                  <p className="text-muted">Loading…</p>
                </div>
              )}
              {!detailLoading && detailCustomer && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-luxury-wide text-muted">
                      Contact
                    </p>
                    <p className="mt-1 font-medium text-charcoal">{detailCustomer.name}</p>
                    <p className="text-sm text-muted">{detailCustomer.phone}</p>
                    {detailCustomer.email && (
                      <p className="text-sm text-muted">{detailCustomer.email}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-luxury-wide text-muted">
                      Notes
                    </p>
                    <textarea
                      rows={3}
                      value={drawerNotes}
                      onChange={(e) => setDrawerNotes(e.target.value)}
                      placeholder="Internal notes…"
                      className="mt-1.5 w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm text-charcoal placeholder-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-luxury-wide text-muted">
                      Tags
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {PREDEFINED_TAGS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleTag(t)}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                            drawerTags.includes(t)
                              ? "border-gold bg-gold/15 text-charcoal"
                              : "border-borderSoft/60 bg-white text-muted hover:bg-cream/50"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                      {drawerTags.filter((t) => !PREDEFINED_TAGS.includes(t as typeof PREDEFINED_TAGS[number])).map((t) => (
                        <span
                          key={t}
                          className="flex items-center gap-1 rounded-full border border-borderSoft/60 bg-cream/50 px-3 py-1 text-xs text-charcoal"
                        >
                          {t}
                          <button
                            type="button"
                            onClick={() => setDrawerTags((prev) => prev.filter((x) => x !== t))}
                            className="text-muted hover:text-charcoal"
                            aria-label={`Remove ${t}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <form
                      className="mt-2 flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const input = (e.currentTarget.elements.namedItem("newTag") as HTMLInputElement);
                        addCustomTag(input.value);
                        input.value = "";
                      }}
                    >
                      <input
                        name="newTag"
                        type="text"
                        placeholder="Add tag"
                        className="flex-1 rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-1.5 text-sm placeholder-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-borderSoft/60 bg-white px-3 py-1.5 text-sm font-medium text-charcoal hover:bg-cream"
                      >
                        Add
                      </button>
                    </form>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-luxury-wide text-muted">
                      Booking history
                    </p>
                    {bookingHistoryForCustomer.length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {bookingHistoryForCustomer.slice(0, 10).map((b) => (
                          <li key={String(b.id)}>
                            <Link
                              href={`/admin/bookings/${b.id}`}
                              className="block rounded-lg border border-borderSoft/40 bg-cream/20 px-3 py-2 text-sm text-charcoal hover:bg-cream/40"
                            >
                              <span className="font-medium">{b.service}</span>
                              <span className="text-muted"> · {b.date || "—"}</span>
                            </Link>
                          </li>
                        ))}
                        {bookingHistoryForCustomer.length > 10 && (
                          <p className="text-xs text-muted">
                            +{bookingHistoryForCustomer.length - 10} more
                          </p>
                        )}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-muted">
                        No bookings linked yet. Bookings are matched by name or phone.
                      </p>
                    )}
                  </div>

                  <div className="border-t border-borderSoft/80 pt-4">
                    <button
                      type="button"
                      onClick={handleSaveDrawer}
                      disabled={drawerSaving}
                      className="w-full rounded-full bg-gold py-2.5 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] disabled:opacity-60"
                    >
                      {drawerSaving ? "Saving…" : "Save notes & tags"}
                    </button>
                  </div>
                </div>
              )}
              {!detailLoading && !detailCustomer && (
                <p className="text-muted">Could not load customer.</p>
              )}
            </div>
          </aside>
        </>
      )}

      {/* Create customer modal */}
      {showCreate && (
        <>
          <div
            className="fixed inset-0 z-40 bg-charcoal/30"
            aria-hidden
            onClick={() => setShowCreate(false)}
          />
          <div
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-borderSoft/80 bg-white p-6 shadow-card"
            role="dialog"
            aria-modal="true"
            aria-label="Create customer"
          >
            <h2 className="font-serif text-xl font-semibold text-charcoal">
              New customer
            </h2>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label htmlFor="create-name" className="mb-1 block text-xs font-medium text-muted">
                  Name *
                </label>
                <input
                  id="create-name"
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </div>
              <div>
                <label htmlFor="create-phone" className="mb-1 block text-xs font-medium text-muted">
                  Phone *
                </label>
                <input
                  id="create-phone"
                  type="tel"
                  required
                  value={createForm.phone}
                  onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </div>
              <div>
                <label htmlFor="create-email" className="mb-1 block text-xs font-medium text-muted">
                  Email
                </label>
                <input
                  id="create-email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </div>
              <div>
                <label htmlFor="create-notes" className="mb-1 block text-xs font-medium text-muted">
                  Notes
                </label>
                <textarea
                  id="create-notes"
                  rows={2}
                  value={createForm.notes}
                  onChange={(e) => setCreateForm((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 rounded-full border border-borderSoft/80 bg-white py-2.5 text-sm font-medium text-charcoal hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSaving}
                  className="flex-1 rounded-full bg-gold py-2.5 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] disabled:opacity-60"
                >
                  {createSaving ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
