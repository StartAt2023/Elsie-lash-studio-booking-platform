"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  getBookings,
  getBooking,
  updateBooking,
  type Booking,
  type ApiError,
  getApiErrorMessage,
} from "@/lib/api";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekStart(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

function formatWeekRange(weekStart: Date): string {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  return `${weekStart.toLocaleDateString("en-AU", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}`;
}

function StatusBadge({ status }: { status: string | undefined }) {
  const s = status || "pending";
  const styles: Record<string, string> = {
    pending: "bg-cream text-muted border-borderSoft/80",
    confirmed: "bg-gold/15 text-charcoal border-gold/40",
    completed: "bg-green-50 text-green-800 border-green-200",
    cancelled: "bg-red-50 text-red-800 border-red-200",
  };
  const label = (s.charAt(0).toUpperCase() + s.slice(1)) as string;
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${styles[s] ?? styles.pending}`}
    >
      {label}
    </span>
  );
}

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [panelBooking, setPanelBooking] = useState<Booking | null>(null);
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelSaving, setPanelSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [weekStart]);

  const bookingsByDay = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    weekDays.forEach((d) => {
      map[formatDateKey(d)] = [];
    });
    bookings.forEach((b) => {
      const key = b.date ? b.date.slice(0, 10) : "";
      if (map[key]) map[key].push(b);
    });
    Object.keys(map).forEach((k) => {
      map[k].sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
    });
    return map;
  }, [bookings, weekDays]);

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

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (selectedId == null) {
      setPanelBooking(null);
      return;
    }
    setPanelLoading(true);
    getBooking(selectedId)
      .then(setPanelBooking)
      .catch(() => setPanelBooking(null))
      .finally(() => setPanelLoading(false));
  }, [selectedId]);

  function goPrevWeek() {
    const next = new Date(weekStart);
    next.setDate(next.getDate() - 7);
    setWeekStart(next);
  }

  function goNextWeek() {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  }

  function goToday() {
    setWeekStart(getWeekStart(new Date()));
  }

  async function setStatus(id: string | number, status: Booking["status"]) {
    if (!status) return;
    setPanelSaving(true);
    try {
      const updated = await updateBooking(id, { status });
      setPanelBooking(updated);
      setBookings((prev) =>
        prev.map((b) => (String(b.id) === String(id) ? updated : b))
      );
      setToast("Booking updated.");
    } catch (err) {
      setToast(getApiErrorMessage(err as ApiError));
    } finally {
      setPanelSaving(false);
    }
  }

  const hasBookingsThisWeek = weekDays.some(
    (d) => (bookingsByDay[formatDateKey(d)]?.length ?? 0) > 0
  );

  return (
    <div>
      <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
        Admin
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
        Calendar
      </h1>
      <p className="mt-2 text-muted">
        Weekly view. Click a booking to view details and update status.
      </p>

      {toast && (
        <div
          className="mt-4 rounded-xl border border-borderSoft/80 bg-white px-4 py-3 shadow-soft"
          role="status"
        >
          <p className="text-sm text-charcoal">{toast}</p>
        </div>
      )}

      {/* Week navigation */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-borderSoft/60 bg-white px-4 py-3 shadow-soft">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrevWeek}
            className="rounded-lg p-2 text-muted transition hover:bg-cream hover:text-charcoal"
            aria-label="Previous week"
          >
            <span className="text-lg font-medium">←</span>
          </button>
          <button
            type="button"
            onClick={goNextWeek}
            className="rounded-lg p-2 text-muted transition hover:bg-cream hover:text-charcoal"
            aria-label="Next week"
          >
            <span className="text-lg font-medium">→</span>
          </button>
          <button
            type="button"
            onClick={goToday}
            className="ml-2 rounded-full border border-borderSoft/60 bg-white px-3 py-1.5 text-sm font-medium text-charcoal transition hover:bg-cream"
          >
            Today
          </button>
        </div>
        <p className="font-medium text-charcoal">{formatWeekRange(weekStart)}</p>
      </div>

      {/* Calendar grid */}
      <div className="mt-6 rounded-2xl border border-borderSoft/60 bg-white shadow-soft overflow-hidden">
        {loading && (
          <div className="flex min-h-[320px] items-center justify-center p-8">
            <p className="text-muted">Loading bookings…</p>
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

        {!loading && !error && (
          <div className="grid min-w-0 grid-cols-7 overflow-x-auto sm:overflow-visible">
            {weekDays.map((day) => (
              <div
                key={formatDateKey(day)}
                className="min-h-[200px] min-w-[120px] border-r border-borderSoft/40 last:border-r-0"
              >
                <div className="border-b border-borderSoft/80 bg-cream/50 px-3 py-2 text-center">
                  <p className="text-xs font-medium uppercase tracking-luxury-wide text-muted">
                    {DAY_NAMES[day.getDay() === 0 ? 6 : day.getDay() - 1]}
                  </p>
                  <p className="mt-0.5 font-medium text-charcoal">
                    {formatDayLabel(day)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 p-2">
                  {(bookingsByDay[formatDateKey(day)] ?? []).map((b) => (
                    <button
                      key={String(b.id)}
                      type="button"
                      onClick={() => setSelectedId(b.id)}
                      className="text-left rounded-xl border border-borderSoft/60 bg-white p-2.5 shadow-soft transition hover:border-gold/50 hover:shadow-card focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-white"
                    >
                      <p className="truncate font-medium text-charcoal text-sm">
                        {b.fullName || "—"}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {b.service || "—"}
                      </p>
                      <div className="mt-1.5">
                        <StatusBadge status={b.status} />
                      </div>
                    </button>
                  ))}
                  {(!bookingsByDay[formatDateKey(day)]?.length) && (
                    <p className="py-4 text-center text-xs text-muted">—</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && !error && !hasBookingsThisWeek && (
        <p className="mt-4 text-center text-sm text-muted">
          No bookings this week.
        </p>
      )}

      {/* Side panel */}
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
            aria-label="Booking details"
          >
            <div className="flex items-center justify-between border-b border-borderSoft/80 px-4 py-3">
              <h2 className="font-serif text-lg font-semibold text-charcoal">
                Booking details
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
              {panelLoading && (
                <div className="flex justify-center py-8">
                  <p className="text-muted">Loading…</p>
                </div>
              )}
              {!panelLoading && panelBooking && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-luxury-wide text-muted">
                      Client
                    </p>
                    <p className="mt-1 font-medium text-charcoal">
                      {panelBooking.fullName || "—"}
                    </p>
                    <p className="text-sm text-muted">{panelBooking.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-luxury-wide text-muted">
                      Service · Date
                    </p>
                    <p className="mt-1 text-charcoal">
                      {panelBooking.service || "—"} · {panelBooking.date || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-luxury-wide text-muted">
                      Status
                    </p>
                    <div className="mt-1.5">
                      <StatusBadge status={panelBooking.status} />
                    </div>
                  </div>
                  {panelBooking.notes && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-luxury-wide text-muted">
                        Notes
                      </p>
                      <p className="mt-1 text-sm text-charcoal">
                        {panelBooking.notes}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-borderSoft/80 pt-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-luxury-wide text-muted">
                      Update status
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {panelBooking.status !== "confirmed" && (
                        <button
                          type="button"
                          onClick={() => setStatus(panelBooking.id, "confirmed")}
                          disabled={panelSaving}
                          className="rounded-full border border-borderSoft/60 bg-white px-3 py-1.5 text-sm font-medium text-charcoal transition hover:bg-cream disabled:opacity-50"
                        >
                          Confirm
                        </button>
                      )}
                      {panelBooking.status !== "completed" && (
                        <button
                          type="button"
                          onClick={() => setStatus(panelBooking.id, "completed")}
                          disabled={panelSaving}
                          className="rounded-full border border-borderSoft/60 bg-white px-3 py-1.5 text-sm font-medium text-charcoal transition hover:bg-cream disabled:opacity-50"
                        >
                          Complete
                        </button>
                      )}
                      {panelBooking.status !== "cancelled" && (
                        <>
                          <button
                            type="button"
                            onClick={() => setStatus(panelBooking.id, "cancelled")}
                            disabled={panelSaving}
                            className="rounded-full border border-borderSoft/60 bg-white px-3 py-1.5 text-sm font-medium text-charcoal transition hover:bg-cream disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(panelBooking.id, "cancelled")}
                            disabled={panelSaving}
                            className="rounded-full border border-borderSoft/60 bg-white px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-cream disabled:opacity-50"
                          >
                            No-show
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/admin/bookings/${panelBooking.id}`}
                    className="mt-4 inline-block text-sm font-medium text-gold hover:underline"
                  >
                    Open full booking details →
                  </Link>
                </div>
              )}
              {!panelLoading && !panelBooking && (
                <p className="text-muted">Could not load booking.</p>
              )}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
