"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings, type SiteSettings, type ApiError, getApiErrorMessage } from "@/lib/api";
import { useToast } from "@/components/admin/ToastContext";
import { ErrorState } from "@/components/admin/ErrorState";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SiteSettings>({
    businessHours: "",
    depositAmount: 0,
    cancellationWindowHours: 24,
    lateArrivalGraceMinutes: 10,
    touchUpPolicyWindow: "",
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getSettings()
      .then((data) => {
        if (!cancelled) {
          setSettings(data);
          setForm({
            businessHours: data.businessHours ?? "",
            depositAmount: data.depositAmount ?? 0,
            cancellationWindowHours: data.cancellationWindowHours ?? 24,
            lateArrivalGraceMinutes: data.lateArrivalGraceMinutes ?? 10,
            touchUpPolicyWindow: data.touchUpPolicyWindow ?? "",
          });
        }
      })
      .catch((err: ApiError) => {
        if (!cancelled) setError(getApiErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  function validate(): string | null {
    if (form.depositAmount < 0 || isNaN(form.depositAmount)) return "Deposit amount must be 0 or greater.";
    if (form.cancellationWindowHours < 0 || isNaN(form.cancellationWindowHours)) return "Cancellation window must be 0 or greater (e.g. 24 or 48).";
    if (form.lateArrivalGraceMinutes < 0 || isNaN(form.lateArrivalGraceMinutes)) return "Late arrival grace must be 0 or greater (minutes).";
    return null;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      showToast(err);
      return;
    }
    setSaving(true);
    try {
      const updated = await updateSettings(form);
      setSettings(updated);
      showToast("Settings saved.");
    } catch (err) {
      showToast(getApiErrorMessage(err as ApiError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <p className="text-muted">Loading settings…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">Admin</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal">Settings</h1>
        <div className="mt-6">
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">Admin</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">Settings</h1>
      <p className="mt-2 text-muted">Business hours, deposit, cancellation window, and other policy settings. Can influence booking copy when wired.</p>

      <form onSubmit={handleSave} className="mt-6 max-w-xl space-y-6">
        <div>
          <label htmlFor="businessHours" className="block text-sm font-medium text-charcoal">Business hours</label>
          <input
            id="businessHours"
            type="text"
            value={form.businessHours}
            onChange={(e) => setForm((p) => ({ ...p, businessHours: e.target.value }))}
            placeholder="e.g. Mon–Fri 9am–6pm"
            className="mt-1 w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm text-charcoal placeholder-muted"
          />
        </div>
        <div>
          <label htmlFor="depositAmount" className="block text-sm font-medium text-charcoal">Deposit amount (optional)</label>
          <input
            id="depositAmount"
            type="number"
            min="0"
            step="0.01"
            value={form.depositAmount}
            onChange={(e) => setForm((p) => ({ ...p, depositAmount: Number(e.target.value) || 0 }))}
            className="mt-1 w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm text-charcoal"
          />
        </div>
        <div>
          <label htmlFor="cancellationWindowHours" className="block text-sm font-medium text-charcoal">Cancellation window (hours)</label>
          <input
            id="cancellationWindowHours"
            type="number"
            min="0"
            value={form.cancellationWindowHours}
            onChange={(e) => setForm((p) => ({ ...p, cancellationWindowHours: Number(e.target.value) || 0 }))}
            placeholder="24 or 48"
            className="mt-1 w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm text-charcoal"
          />
          <p className="mt-1 text-xs text-muted">e.g. 24 or 48 hours notice required</p>
        </div>
        <div>
          <label htmlFor="lateArrivalGraceMinutes" className="block text-sm font-medium text-charcoal">Late arrival grace period (minutes)</label>
          <input
            id="lateArrivalGraceMinutes"
            type="number"
            min="0"
            value={form.lateArrivalGraceMinutes}
            onChange={(e) => setForm((p) => ({ ...p, lateArrivalGraceMinutes: Number(e.target.value) || 0 }))}
            className="mt-1 w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm text-charcoal"
          />
        </div>
        <div>
          <label htmlFor="touchUpPolicyWindow" className="block text-sm font-medium text-charcoal">Touch-up policy window</label>
          <input
            id="touchUpPolicyWindow"
            type="text"
            value={form.touchUpPolicyWindow}
            onChange={(e) => setForm((p) => ({ ...p, touchUpPolicyWindow: e.target.value }))}
            placeholder="e.g. 48–72 hours for fixes"
            className="mt-1 w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm text-charcoal placeholder-muted"
          />
        </div>
        <button type="submit" disabled={saving} className="rounded-full bg-gold px-6 py-3 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] disabled:opacity-60">
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
