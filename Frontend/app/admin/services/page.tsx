"use client";

import { useEffect, useState } from "react";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  type Service,
  type ApiError,
  getApiErrorMessage,
} from "@/lib/api";
import { useToast } from "@/components/admin/ToastContext";
import { EmptyState } from "@/components/admin/EmptyState";
import { ErrorState } from "@/components/admin/ErrorState";

export default function AdminServicesPage() {
  const { showToast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [saving, setSaving] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    price: "",
    durationMinutes: "",
    description: "",
    active: true,
    sortOrder: "0",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    durationMinutes: "",
    description: "",
    active: true,
    sortOrder: "0",
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getServices()
      .then((data) => { if (!cancelled) setServices(data); })
      .catch((err: ApiError) => { if (!cancelled) setError(getApiErrorMessage(err)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  function validatePriceDuration(price: number, duration: number): string | null {
    if (price < 0 || isNaN(price)) return "Price must be a positive number.";
    if (duration < 0 || isNaN(duration)) return "Duration must be a positive number.";
    return null;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const price = Number(createForm.price);
    const duration = Number(createForm.durationMinutes);
    const err = validatePriceDuration(price, duration);
    if (err) { showToast(err); return; }
    if (!createForm.name.trim()) { showToast("Name is required."); return; }
    setSaving(true);
    try {
      const created = await createService({
        name: createForm.name.trim(),
        price,
        durationMinutes: duration,
        description: createForm.description.trim() || undefined,
        active: createForm.active,
        sortOrder: parseInt(createForm.sortOrder, 10) || 0,
      });
      setServices((prev) => [...prev, created].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
      setCreateForm({ name: "", price: "", durationMinutes: "", description: "", active: true, sortOrder: "0" });
      setShowCreate(false);
      showToast("Service created.");
    } catch (err) {
      showToast(getApiErrorMessage(err as ApiError));
    } finally {
      setSaving(false);
    }
  }

  function startEdit(s: Service) {
    setEditingId(s.id);
    setEditForm({
      name: s.name,
      price: String(s.price),
      durationMinutes: String(s.durationMinutes),
      description: s.description ?? "",
      active: s.active ?? true,
      sortOrder: String(s.sortOrder ?? 0),
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (editingId == null) return;
    const price = Number(editForm.price);
    const duration = Number(editForm.durationMinutes);
    const err = validatePriceDuration(price, duration);
    if (err) { showToast(err); return; }
    if (!editForm.name.trim()) { showToast("Name is required."); return; }
    setSaving(true);
    try {
      const updated = await updateService(editingId, {
        name: editForm.name.trim(),
        price,
        durationMinutes: duration,
        description: editForm.description.trim() || undefined,
        active: editForm.active,
        sortOrder: parseInt(editForm.sortOrder, 10) || 0,
      });
      setServices((prev) => prev.map((s) => (String(s.id) === String(editingId) ? updated : s)).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
      setEditingId(null);
      showToast("Service updated.");
    } catch (err) {
      showToast(getApiErrorMessage(err as ApiError));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(s: Service) {
    try {
      const updated = await updateService(s.id, { active: !(s.active ?? true) });
      setServices((prev) => prev.map((x) => (String(x.id) === String(s.id) ? updated : x)));
      showToast(updated.active ? "Service enabled." : "Service disabled.");
    } catch (err) {
      showToast(getApiErrorMessage(err as ApiError));
    }
  }

  async function handleDelete(id: string | number) {
    if (!confirm("Delete this service?")) return;
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => String(s.id) !== String(id)));
      setEditingId((curr) => (String(curr) === String(id) ? null : curr));
      showToast("Service deleted.");
    } catch (err) {
      showToast(getApiErrorMessage(err as ApiError));
    }
  }

  return (
    <div>
      <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">Admin</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">Services</h1>
      <p className="mt-2 text-muted">Manage lash services, pricing, and duration.</p>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f]"
        >
          New service
        </button>
      </div>

      <div className="mt-4">
        {loading && (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-borderSoft/60 bg-white shadow-soft">
            <p className="text-muted">Loading services…</p>
          </div>
        )}
        {error && !loading && (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        )}
        {!loading && !error && services.length === 0 && (
          <EmptyState
            message="No services yet. Create one to get started."
            action={{ label: "New service", onClick: () => setShowCreate(true) }}
          />
        )}
        {!loading && !error && services.length > 0 && (
          <ul className="space-y-3">
            {services.map((s) => (
              <li key={String(s.id)} className="rounded-2xl border border-borderSoft/60 bg-white p-4 shadow-soft">
                {editingId === s.id ? (
                  <form onSubmit={handleUpdate} className="space-y-3">
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Name"
                      className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm"
                      required
                    />
                    <div className="flex gap-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                        placeholder="Price"
                        className="w-24 rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        min="0"
                        value={editForm.durationMinutes}
                        onChange={(e) => setEditForm((p) => ({ ...p, durationMinutes: e.target.value }))}
                        placeholder="Duration (min)"
                        className="w-24 rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        value={editForm.sortOrder}
                        onChange={(e) => setEditForm((p) => ({ ...p, sortOrder: e.target.value }))}
                        placeholder="Order"
                        className="w-20 rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm"
                      />
                    </div>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Description"
                      rows={2}
                      className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-sm text-muted">
                        <input
                          type="checkbox"
                          checked={editForm.active}
                          onChange={(e) => setEditForm((p) => ({ ...p, active: e.target.checked }))}
                          className="rounded border-borderSoft/60"
                        />
                        Active
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" disabled={saving} className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-cream shadow-soft disabled:opacity-60">
                        Save
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="rounded-full border border-borderSoft/80 px-4 py-2 text-sm font-medium text-charcoal">
                        Cancel
                      </button>
                      <button type="button" onClick={() => handleDelete(s.id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700">
                        Delete
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-charcoal">{s.name}</h3>
                        {!(s.active ?? true) && (
                          <span className="rounded-full bg-muted/30 px-2 py-0.5 text-xs text-muted">Inactive</span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted">${s.price} · {s.durationMinutes} min</p>
                      {s.description && <p className="mt-1 text-sm text-muted">{s.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(s)}
                        className="rounded-lg border border-borderSoft/60 px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-cream/50"
                      >
                        {(s.active ?? true) ? "Deactivate" : "Activate"}
                      </button>
                      <button type="button" onClick={() => startEdit(s)} className="rounded-lg border border-borderSoft/60 px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-cream/50">
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {showCreate && (
        <>
          <div className="fixed inset-0 z-40 bg-charcoal/30" aria-hidden onClick={() => setShowCreate(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-borderSoft/80 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-charcoal">New service</h2>
            <form onSubmit={handleCreate} className="mt-4 space-y-3">
              <input
                value={createForm.name}
                onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Name *"
                className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm"
                required
              />
              <div className="flex gap-3">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={createForm.price}
                  onChange={(e) => setCreateForm((p) => ({ ...p, price: e.target.value }))}
                  placeholder="Price *"
                  className="w-32 rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  min="0"
                  value={createForm.durationMinutes}
                  onChange={(e) => setCreateForm((p) => ({ ...p, durationMinutes: e.target.value }))}
                  placeholder="Duration (min) *"
                  className="w-32 rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  value={createForm.sortOrder}
                  onChange={(e) => setCreateForm((p) => ({ ...p, sortOrder: e.target.value }))}
                  placeholder="Order"
                  className="w-20 rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm"
                />
              </div>
              <textarea
                value={createForm.description}
                onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Description"
                rows={2}
                className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm"
              />
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={createForm.active}
                  onChange={(e) => setCreateForm((p) => ({ ...p, active: e.target.checked }))}
                  className="rounded border-borderSoft/60"
                />
                Active
              </label>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-full border border-borderSoft/80 py-2.5 text-sm font-medium text-charcoal">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 rounded-full bg-gold py-2.5 text-sm font-medium text-cream shadow-soft disabled:opacity-60">
                  {saving ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
