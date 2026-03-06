"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  type GalleryItemApi,
  type ApiError,
  getApiErrorMessage,
} from "@/lib/api";
import { useToast } from "@/components/admin/ToastContext";
import { EmptyState } from "@/components/admin/EmptyState";
import { ErrorState } from "@/components/admin/ErrorState";

const CATEGORIES = ["Classic", "Hybrid", "Volume"] as const;

export default function AdminGalleryPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<GalleryItemApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [saving, setSaving] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    imageUrl: "",
    category: "Classic",
    description: "",
    active: true,
    sortOrder: "0",
  });
  const [editForm, setEditForm] = useState({
    title: "",
    imageUrl: "",
    category: "Classic",
    description: "",
    active: true,
    sortOrder: "0",
  });

  const filtered = useMemo(() => {
    if (!categoryFilter) return items;
    return items.filter((i) => i.category === categoryFilter);
  }, [items, categoryFilter]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getGallery()
      .then((data) => { if (!cancelled) setItems(data); })
      .catch((err: ApiError) => { if (!cancelled) setError(getApiErrorMessage(err)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.title.trim() || !createForm.imageUrl.trim()) {
      showToast("Title and image URL are required.");
      return;
    }
    setSaving(true);
    try {
      const created = await createGalleryItem({
        title: createForm.title.trim(),
        imageUrl: createForm.imageUrl.trim(),
        category: createForm.category,
        description: createForm.description.trim() || undefined,
        active: createForm.active,
        sortOrder: parseInt(createForm.sortOrder, 10) || 0,
      });
      setItems((prev) => [...prev, created].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
      setCreateForm({ title: "", imageUrl: "", category: "Classic", description: "", active: true, sortOrder: "0" });
      setShowCreate(false);
      showToast("Gallery item created.");
    } catch (err) {
      showToast(getApiErrorMessage(err as ApiError));
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: GalleryItemApi) {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      imageUrl: item.imageUrl,
      category: item.category ?? "Classic",
      description: item.description ?? "",
      active: item.active ?? true,
      sortOrder: String(item.sortOrder ?? 0),
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (editingId == null) return;
    if (!editForm.title.trim() || !editForm.imageUrl.trim()) {
      showToast("Title and image URL are required.");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateGalleryItem(editingId, {
        title: editForm.title.trim(),
        imageUrl: editForm.imageUrl.trim(),
        category: editForm.category,
        description: editForm.description.trim() || undefined,
        active: editForm.active,
        sortOrder: parseInt(editForm.sortOrder, 10) || 0,
      });
      setItems((prev) => prev.map((i) => (String(i.id) === String(editingId) ? updated : i)));
      setEditingId(null);
      showToast("Gallery item updated.");
    } catch (err) {
      showToast(getApiErrorMessage(err as ApiError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string | number) {
    if (!confirm("Delete this gallery item?")) return;
    try {
      await deleteGalleryItem(id);
      setItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
      setEditingId((curr) => (String(curr) === String(id) ? null : curr));
      showToast("Gallery item deleted.");
    } catch (err) {
      showToast(getApiErrorMessage(err as ApiError));
    }
  }

  return (
    <div>
      <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">Admin</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">Gallery</h1>
      <p className="mt-2 text-muted">Manage gallery items by category. Use image URL for now (upload can be added later).</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryFilter("")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              !categoryFilter ? "bg-gold text-cream shadow-soft" : "border border-borderSoft/60 bg-white text-muted hover:bg-cream/50"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                categoryFilter === cat ? "bg-gold text-cream shadow-soft" : "border border-borderSoft/60 bg-white text-muted hover:bg-cream/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f]"
        >
          Add item
        </button>
      </div>

      <div className="mt-6">
        {loading && (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-borderSoft/60 bg-white shadow-soft">
            <p className="text-muted">Loading gallery…</p>
          </div>
        )}
        {error && !loading && (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        )}
        {!loading && !error && items.length === 0 && (
          <EmptyState
            message="No gallery items yet. Add one to get started."
            action={{ label: "Add item", onClick: () => setShowCreate(true) }}
          />
        )}
        {!loading && !error && filtered.length === 0 && items.length > 0 && (
          <EmptyState message="No items in this category." />
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={String(item.id)}
                className="rounded-2xl border border-borderSoft/60 bg-white overflow-hidden shadow-soft"
              >
                <div className="aspect-[4/5] bg-cream/50 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-4xl text-gold/50">✦</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-charcoal">{item.title}</p>
                  <p className="text-xs text-muted">{item.category}</p>
                  {!(item.active ?? true) && (
                    <span className="mt-1 inline-block rounded bg-muted/30 px-2 py-0.5 text-xs text-muted">Inactive</span>
                  )}
                </div>
                <div className="flex gap-2 p-3 pt-0">
                  <button type="button" onClick={() => startEdit(item)} className="rounded-lg border border-borderSoft/60 px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-cream/50">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <>
          <div className="fixed inset-0 z-40 bg-charcoal/30" aria-hidden onClick={() => setShowCreate(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto rounded-2xl border border-borderSoft/80 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-charcoal">Add gallery item</h2>
            <form onSubmit={handleCreate} className="mt-4 space-y-3">
              <input value={createForm.title} onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title *" className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm" required />
              <input value={createForm.imageUrl} onChange={(e) => setCreateForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="Image URL * (or path)" className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm" required />
              <select value={createForm.category} onChange={(e) => setCreateForm((p) => ({ ...p, category: e.target.value }))} className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <textarea value={createForm.description} onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2} className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm" />
              <input type="number" value={createForm.sortOrder} onChange={(e) => setCreateForm((p) => ({ ...p, sortOrder: e.target.value }))} placeholder="Sort order" className="w-24 rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm" />
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" checked={createForm.active} onChange={(e) => setCreateForm((p) => ({ ...p, active: e.target.checked }))} className="rounded border-borderSoft/60" />
                Active
              </label>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-full border border-borderSoft/80 py-2.5 text-sm font-medium text-charcoal">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 rounded-full bg-gold py-2.5 text-sm font-medium text-cream shadow-soft disabled:opacity-60">{saving ? "Creating…" : "Create"}</button>
              </div>
            </form>
          </div>
        </>
      )}

      {editingId != null && (
        <>
          <div className="fixed inset-0 z-40 bg-charcoal/30" aria-hidden onClick={() => setEditingId(null)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto rounded-2xl border border-borderSoft/80 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-charcoal">Edit gallery item</h2>
            <form onSubmit={handleUpdate} className="mt-4 space-y-3">
              <input value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title *" className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm" required />
              <input value={editForm.imageUrl} onChange={(e) => setEditForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="Image URL *" className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm" required />
              <select value={editForm.category} onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))} className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <textarea value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2} className="w-full rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm" />
              <input type="number" value={editForm.sortOrder} onChange={(e) => setEditForm((p) => ({ ...p, sortOrder: e.target.value }))} placeholder="Sort order" className="w-24 rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm" />
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" checked={editForm.active} onChange={(e) => setEditForm((p) => ({ ...p, active: e.target.checked }))} className="rounded border-borderSoft/60" />
                Active
              </label>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditingId(null)} className="flex-1 rounded-full border border-borderSoft/80 py-2.5 text-sm font-medium text-charcoal">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 rounded-full bg-gold py-2.5 text-sm font-medium text-cream shadow-soft disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
