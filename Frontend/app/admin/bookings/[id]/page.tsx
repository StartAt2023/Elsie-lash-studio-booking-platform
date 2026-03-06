"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  getBooking,
  updateBooking,
  type Booking,
  type ApiError,
  getApiErrorMessage,
} from "@/lib/api";

type ActivityItem =
  | { type: "created"; at: string }
  | { type: "status_updated"; to: string; at: string }
  | { type: "notes_updated"; at: string }
  | { type: "date_updated"; at: string };

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
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[s] ?? styles.pending}`}
    >
      {label}
    </span>
  );
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

export default function AdminBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getBooking(id)
      .then((data) => {
        if (!cancelled) {
          setBooking(data);
          setEditStatus(data.status || "pending");
          setEditNotes(data.notes || "");
          setEditDate(data.date ? data.date.slice(0, 10) : "");
          setActivities([
            { type: "created", at: data.createdAt || new Date().toISOString() },
          ]);
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
  }, [id]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleSave() {
    if (!id || !booking) return;
    setSaving(true);
    try {
      const updated = await updateBooking(id, {
        status: editStatus as Booking["status"],
        notes: editNotes,
        date: editDate || booking.date,
      });
      setBooking(updated);
      const newActivities: ActivityItem[] = [];
      if (updated.status !== booking.status) {
        newActivities.push({
          type: "status_updated",
          to: updated.status || "pending",
          at: new Date().toISOString(),
        });
      }
      if ((updated.notes ?? "") !== (booking.notes ?? "")) {
        newActivities.push({ type: "notes_updated", at: new Date().toISOString() });
      }
      if ((updated.date ?? "") !== (booking.date ?? "")) {
        newActivities.push({ type: "date_updated", at: new Date().toISOString() });
      }
      setActivities((prev) => [...prev, ...newActivities]);
      setToast("Booking updated.");
    } catch (err) {
      setToast(getApiErrorMessage(err as ApiError));
    } finally {
      setSaving(false);
    }
  }

  function copyPhone() {
    if (!booking?.phone) return;
    navigator.clipboard.writeText(booking.phone).then(() => setToast("Phone copied."));
  }

  const hasEdits =
    (editStatus !== (booking?.status || "pending")) ||
    (editNotes !== (booking?.notes ?? "")) ||
    (editDate !== (booking?.date ? booking.date.slice(0, 10) : ""));

  if (!id) {
    return (
      <div>
        <p className="text-muted">Invalid booking.</p>
        <Link href="/admin/bookings" className="mt-2 inline-block text-sm text-gold hover:underline">
          Back to bookings
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <p className="text-muted">Loading booking…</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div>
        <p className="font-medium text-charcoal">Something went wrong</p>
        <p className="mt-1 text-sm text-muted">{error || "Booking not found."}</p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => (error ? window.location.reload() : router.push("/admin/bookings"))}
            className="rounded-full bg-gold px-4 py-2 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f]"
          >
            {error ? "Try again" : "Back to bookings"}
          </button>
          <Link
            href="/admin/bookings"
            className="rounded-full border border-borderSoft/80 bg-white px-4 py-2 text-sm font-medium text-charcoal transition hover:bg-cream"
          >
            Back to bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/bookings"
        className="text-sm font-medium text-muted transition hover:text-charcoal"
      >
        ← Back to bookings
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
            Booking #{String(booking.id)}
          </p>
          <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
            {booking.fullName || "—"}
          </h1>
          <p className="mt-1 text-muted">{booking.service} · {formatDate(booking.date)}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {toast && (
        <div className="mt-4 rounded-xl border border-borderSoft/80 bg-white px-4 py-3 shadow-soft" role="status">
          <p className="text-sm text-charcoal">{toast}</p>
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Customer quick info */}
        <section className="rounded-2xl border border-borderSoft/60 bg-white p-5 shadow-soft">
          <h2 className="font-serif text-sm font-semibold uppercase tracking-luxury-wide text-muted">
            Customer
          </h2>
          <p className="mt-2 font-medium text-charcoal">{booking.fullName || "—"}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-muted">{booking.phone || "—"}</span>
            {booking.phone && (
              <button
                type="button"
                onClick={copyPhone}
                className="rounded-lg p-1.5 text-muted transition hover:bg-cream hover:text-charcoal"
                title="Copy phone"
                aria-label="Copy phone number"
              >
                <CopyIcon />
              </button>
            )}
          </div>
        </section>

        {/* Editable details */}
        <section className="rounded-2xl border border-borderSoft/60 bg-white p-5 shadow-soft sm:col-span-2 lg:col-span-2">
          <h2 className="font-serif text-sm font-semibold uppercase tracking-luxury-wide text-muted">
            Edit booking
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="detail-status" className="mb-1 block text-xs font-medium text-muted">
                Status
              </label>
              <select
                id="detail-status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-borderSoft/60 bg-cream/50 px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label htmlFor="detail-date" className="mb-1 block text-xs font-medium text-muted">
                Preferred date
              </label>
              <input
                id="detail-date"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-borderSoft/60 bg-cream/50 px-3 py-2 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
              <p className="mt-1 text-xs text-muted">Australia/Sydney</p>
            </div>
            <div>
              <label htmlFor="detail-notes" className="mb-1 block text-xs font-medium text-muted">
                Notes
              </label>
              <textarea
                id="detail-notes"
                rows={4}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Client notes…"
                className="w-full rounded-lg border border-borderSoft/60 bg-cream/50 px-3 py-2 text-sm text-charcoal placeholder-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
            {hasEdits && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            )}
          </div>
        </section>

        {/* Activity (frontend-only for now) */}
        <section className="rounded-2xl border border-borderSoft/60 bg-white p-5 shadow-soft sm:col-span-2 lg:col-span-1">
          <h2 className="font-serif text-sm font-semibold uppercase tracking-luxury-wide text-muted">
            Activity
          </h2>
          <p className="mt-1 text-xs text-muted">Recent activity (this session).</p>
          <ul className="mt-4 space-y-3">
            {activities.map((a, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
                <span className="text-gold">·</span>
                <span className="text-charcoal">
                  {a.type === "created" && "Booking created"}
                  {a.type === "status_updated" && `Status set to ${a.to.charAt(0).toUpperCase() + a.to.slice(1)}`}
                  {a.type === "notes_updated" && "Notes updated"}
                  {a.type === "date_updated" && "Date updated"}
                </span>
                <span className="text-muted text-xs">
                  {formatDateTime(a.at)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Read-only summary */}
      <section className="mt-8 rounded-2xl border border-borderSoft/60 bg-cream/30 p-5">
        <h2 className="font-serif text-sm font-semibold uppercase tracking-luxury-wide text-muted">
          Summary
        </h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Service</dt>
            <dd className="font-medium text-charcoal">{booking.service || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">Created</dt>
            <dd className="text-charcoal">{formatDateTime(booking.createdAt || "")}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
