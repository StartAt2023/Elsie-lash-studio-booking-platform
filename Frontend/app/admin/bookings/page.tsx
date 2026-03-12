"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  getBookings,
  updateBooking,
  deleteBooking,
  type Booking,
  type ApiError,
  getApiErrorMessage,
} from "@/lib/api";
import { useToast } from "@/components/admin/ToastContext";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

function formatDate(s: string): string {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(s: string): string {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(s: string | undefined): string {
  if (!s) return "Pending";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function StatusBadge({ status }: { status: string | undefined }) {
  const s = status || "pending";
  const styles: Record<string, string> = {
    pending: "bg-cream text-muted border-borderSoft/80",
    confirmed: "bg-gold/15 text-charcoal border-gold/40",
    completed: "bg-green-50 text-green-800 border-green-200",
    cancelled: "bg-red-50 text-red-800 border-red-200",
  };
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[s] ?? styles.pending}`}
    >
      {statusLabel(s)}
    </span>
  );
}

const DELETE_CONFIRM_MESSAGE =
  "Are you sure you want to permanently delete this booking? This action cannot be undone.";

export default function AdminBookingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | number | null>(null);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getBookings()
      .then((data) => {
        if (!cancelled) setBookings(data);
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

  const filteredBookings = useMemo(() => {
    let list = [...bookings];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (b) =>
          b.fullName?.toLowerCase().includes(q) ||
          b.phone?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      list = list.filter((b) => (b.status || "pending") === statusFilter);
    }
    if (dateFrom) {
      list = list.filter((b) => b.date && b.date >= dateFrom);
    }
    if (dateTo) {
      list = list.filter((b) => b.date && b.date <= dateTo);
    }
    return list.sort((a, b) => {
      const da = a.date || "";
      const db = b.date || "";
      if (da !== db) return db.localeCompare(da);
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });
  }, [bookings, search, statusFilter, dateFrom, dateTo]);

  async function setStatus(id: string | number, status: Booking["status"], label: string) {
    if (actingId !== null) return;
    setActingId(id);
    try {
      await updateBooking(id, { status: status! });
      setBookings((prev) =>
        prev.map((b) => (String(b.id) === String(id) ? { ...b, status } : b))
      );
      showToast(`${label} updated.`);
    } catch (err) {
      showToast(getApiErrorMessage(err as ApiError));
    } finally {
      setActingId(null);
    }
  }

  async function handleDelete(id: string | number) {
    if (!confirm(DELETE_CONFIRM_MESSAGE)) return;
    if (actingId !== null) return;
    setActingId(id);
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => String(b.id) !== String(id)));
      showToast("Booking permanently deleted.");
    } catch (err) {
      showToast(getApiErrorMessage(err as ApiError));
    } finally {
      setActingId(null);
    }
  }

  return (
    <div>
      <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
        Admin
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
        Bookings
      </h1>
      <p className="mt-2 text-muted">
        View and update booking status. Times are in Australia/Sydney.
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-end gap-4 rounded-2xl border border-borderSoft/60 bg-white p-4 shadow-soft">
        <div className="min-w-[140px]">
          <label htmlFor="filter-search" className="mb-1 block text-xs font-medium text-muted">
            Search
          </label>
          <input
            id="filter-search"
            type="text"
            placeholder="Name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-borderSoft/60 bg-cream/50 px-3 py-2 text-sm text-charcoal placeholder-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>
        <div className="min-w-[120px]">
          <label htmlFor="filter-date-from" className="mb-1 block text-xs font-medium text-muted">
            Date from
          </label>
          <input
            id="filter-date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full rounded-lg border border-borderSoft/60 bg-cream/50 px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>
        <div className="min-w-[120px]">
          <label htmlFor="filter-date-to" className="mb-1 block text-xs font-medium text-muted">
            Date to
          </label>
          <input
            id="filter-date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full rounded-lg border border-borderSoft/60 bg-cream/50 px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>
        <div className="min-w-[140px]">
          <label htmlFor="filter-status" className="mb-1 block text-xs font-medium text-muted">
            Status
          </label>
          <select
            id="filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-borderSoft/60 bg-cream/50 px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 rounded-2xl border border-borderSoft/60 bg-white shadow-soft overflow-hidden">
        {loading && (
          <div className="flex min-h-[280px] items-center justify-center p-8">
            <p className="text-muted">Loading bookings…</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-6">
            <p className="text-charcoal font-medium">Something went wrong</p>
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

        {!loading && !error && filteredBookings.length === 0 && (
          <div className="flex min-h-[200px] items-center justify-center p-8">
            <p className="text-muted">
              {bookings.length === 0
                ? "No bookings yet."
                : "No bookings match your filters."}
            </p>
          </div>
        )}

        {!loading && !error && filteredBookings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-borderSoft/80 bg-cream/50">
                  <th className="px-4 py-3 font-medium tracking-luxury text-charcoal">
                    Date
                  </th>
                  <th className="px-4 py-3 font-medium tracking-luxury text-charcoal">
                    Client
                  </th>
                  <th className="px-4 py-3 font-medium tracking-luxury text-charcoal">
                    Phone
                  </th>
                  <th className="px-4 py-3 font-medium tracking-luxury text-charcoal">
                    Service
                  </th>
                  <th className="px-4 py-3 font-medium tracking-luxury text-charcoal">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium tracking-luxury text-charcoal">
                    Notes
                  </th>
                  <th className="px-4 py-3 font-medium tracking-luxury text-charcoal">
                    Created
                  </th>
                  <th className="px-4 py-3 font-medium tracking-luxury text-charcoal">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => {
                  const isActing = actingId !== null && String(actingId) === String(b.id);
                  const canAct = (b.status || "pending") !== "cancelled" && (b.status || "pending") !== "completed";
                  return (
                    <tr
                      key={String(b.id)}
                      role="button"
                      tabIndex={0}
                      onClick={() => router.push(`/admin/bookings/${b.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(`/admin/bookings/${b.id}`);
                        }
                      }}
                      className="cursor-pointer border-b border-borderSoft/40 transition hover:bg-cream/30"
                    >
                      <td className="px-4 py-3 text-charcoal">
                        {formatDate(b.date)}
                      </td>
                      <td className="px-4 py-3 font-medium text-charcoal">
                        {b.fullName || "—"}
                      </td>
                      <td className="px-4 py-3 text-muted">{b.phone || "—"}</td>
                      <td className="px-4 py-3 text-charcoal">{b.service || "—"}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="max-w-[160px] truncate px-4 py-3 text-muted" title={b.notes || undefined}>
                        {b.notes || "—"}
                      </td>
                      <td className="px-4 py-3 text-muted text-xs">
                        {formatDateTime(b.createdAt || "")}
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap items-center gap-1">
                          {canAct ? (
                            <>
                              {(b.status || "pending") === "pending" && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setStatus(b.id, "confirmed", "Booking");
                                  }}
                                  disabled={isActing}
                                  className="rounded-lg border border-borderSoft/60 bg-white px-2.5 py-1.5 text-xs font-medium text-charcoal transition hover:bg-cream disabled:opacity-50"
                                >
                                  Confirm
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setStatus(b.id, "completed", "Booking");
                                }}
                                disabled={isActing}
                                className="rounded-lg border border-borderSoft/60 bg-white px-2.5 py-1.5 text-xs font-medium text-charcoal transition hover:bg-cream disabled:opacity-50"
                              >
                                Complete
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setStatus(b.id, "cancelled", "Booking");
                                }}
                                disabled={isActing}
                                className="rounded-lg border border-borderSoft/60 bg-white px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-cream disabled:opacity-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setStatus(b.id, "cancelled", "No-show");
                                }}
                                disabled={isActing}
                                className="rounded-lg border border-borderSoft/60 bg-white px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-cream disabled:opacity-50"
                              >
                                No-show
                              </button>
                            </>
                          ) : (
                            <span className="text-muted text-xs">—</span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(b.id);
                            }}
                            disabled={isActing}
                            className="rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
