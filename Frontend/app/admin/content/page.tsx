"use client";

import { useEffect, useState } from "react";
import { getContent, updateContent, type SiteContent, type ApiError, getApiErrorMessage } from "@/lib/api";
import { useToast } from "@/components/admin/ToastContext";
import { ErrorState } from "@/components/admin/ErrorState";

const POLICY_KEYS: { key: keyof NonNullable<SiteContent["policies"]>; label: string }[] = [
  { key: "bookingDeposits", label: "Booking & deposits" },
  { key: "cancellationReschedule", label: "Cancellation & reschedule" },
  { key: "noShow", label: "No-show" },
  { key: "lateArrival", label: "Late arrival" },
  { key: "refundSatisfaction", label: "Refund / satisfaction" },
  { key: "prepRequirements", label: "Prep requirements" },
  { key: "aftercare", label: "Aftercare" },
  { key: "allergies", label: "Allergies / patch test" },
  { key: "privacy", label: "Privacy" },
];

function PreviewText({ text }: { text: string }) {
  const lines = text.split("\n").filter(Boolean);
  return (
    <div className="prose prose-sm max-w-none text-charcoal">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) return <h3 key={i} className="mt-3 font-serif text-lg font-semibold">{line.slice(3)}</h3>;
        if (line.startsWith("- ")) return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
        return <p key={i} className="mt-1">{line}</p>;
      })}
    </div>
  );
}

export default function AdminContentPage() {
  const { showToast } = useToast();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SiteContent>({
    aboutText: "",
    certificateUrls: [],
    policies: {} as SiteContent["policies"],
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getContent()
      .then((data) => {
        if (!cancelled) {
          setContent(data);
          setForm({
            aboutText: data.aboutText ?? "",
            certificateUrls: data.certificateUrls ?? [],
            policies: data.policies ?? ({} as SiteContent["policies"]),
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateContent(form);
      setContent(updated);
      showToast("Content saved.");
    } catch (err) {
      showToast(getApiErrorMessage(err as ApiError));
    } finally {
      setSaving(false);
    }
  }

  function setCertUrl(i: number, value: string) {
    const next = [...(form.certificateUrls ?? [])];
    next[i] = value;
    setForm((p) => ({ ...p, certificateUrls: next }));
  }

  function addCertUrl() {
    setForm((p) => ({ ...p, certificateUrls: [...(p.certificateUrls ?? []), ""] }));
  }

  function removeCertUrl(i: number) {
    setForm((p) => ({
      ...p,
      certificateUrls: (p.certificateUrls ?? []).filter((_, j) => j !== i),
    }));
  }

  if (loading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <p className="text-muted">Loading content…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">Admin</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal">Content</h1>
        <div className="mt-6">
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">Admin</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">Content</h1>
      <p className="mt-2 text-muted">Edit site content. Use ## for headings, - for bullets. Changes take effect without redeploy.</p>

      <form onSubmit={handleSave} className="mt-6 space-y-8">
        <section className="rounded-2xl border border-borderSoft/60 bg-white p-6 shadow-soft">
          <h2 className="font-serif text-lg font-semibold text-charcoal">About text</h2>
          <textarea
            value={form.aboutText}
            onChange={(e) => setForm((p) => ({ ...p, aboutText: e.target.value }))}
            rows={6}
            placeholder="About section copy…"
            className="mt-3 w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm text-charcoal placeholder-muted"
          />
          <div className="mt-3 rounded-lg border border-borderSoft/40 bg-cream/20 p-3">
            <p className="text-xs font-medium text-muted">Preview</p>
            <PreviewText text={form.aboutText || "(empty)"} />
          </div>
        </section>

        <section className="rounded-2xl border border-borderSoft/60 bg-white p-6 shadow-soft">
          <h2 className="font-serif text-lg font-semibold text-charcoal">Certificate image URLs</h2>
          <p className="mt-1 text-sm text-muted">One URL per line or per field. Image URLs for certificates section.</p>
          <div className="mt-3 space-y-2">
            {(form.certificateUrls ?? []).map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={url}
                  onChange={(e) => setCertUrl(i, e.target.value)}
                  placeholder={`Certificate image URL ${i + 1}`}
                  className="flex-1 rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm"
                />
                <button type="button" onClick={() => removeCertUrl(i)} className="rounded-lg border border-borderSoft/60 px-3 py-2 text-sm text-muted hover:bg-cream/50">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addCertUrl} className="rounded-lg border border-borderSoft/60 px-3 py-2 text-sm font-medium text-charcoal hover:bg-cream/50">
              Add URL
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-borderSoft/60 bg-white p-6 shadow-soft">
          <h2 className="font-serif text-lg font-semibold text-charcoal">Policies (multi-section)</h2>
          <p className="mt-1 text-sm text-muted">Use ## for heading, - for bullet points.</p>
          <div className="mt-4 space-y-4">
            {POLICY_KEYS.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-charcoal">{label}</label>
                <textarea
                  value={(form.policies ?? {})[key] ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      policies: { ...(p.policies ?? {}), [key]: e.target.value },
                    }))
                  }
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm text-charcoal"
                />
                <div className="mt-1 rounded border border-borderSoft/40 bg-cream/20 p-2">
                  <PreviewText text={((form.policies ?? {})[key] as string) || "(empty)"} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <button type="submit" disabled={saving} className="rounded-full bg-gold px-6 py-3 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] disabled:opacity-60">
          {saving ? "Saving…" : "Save all content"}
        </button>
      </form>
    </div>
  );
}
