"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Plus, Image as ImageIcon, Pencil, Trash2, X } from "lucide-react";

interface Treatment {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  cost_usd_min: number;
  cost_usd_max: number;
  image_url: string | null;
  is_featured: boolean;
}

const categories = [
  "Orthopedics", "Cardiology", "Neurology", "Cosmetic", "Dental",
  "Fertility", "Oncology", "Gastroenterology", "Transplant", "Urology",
  "Ophthalmology", "ENT", "Bariatric", "Spine", "General",
];

export default function AdminTreatmentsPage() {
  const [data, setData] = useState<Treatment[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "", slug: "", category: "", description: "",
    cost_usd_min: 0, cost_usd_max: 0, image_url: "", is_featured: false,
  });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/treatments");
      if (res.ok) {
        const items = await res.json();
        setData(items);
      }
    } catch {
      console.error("Failed to fetch treatments");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", slug: "", category: "", description: "", cost_usd_min: 0, cost_usd_max: 0, image_url: "", is_featured: false });
    setModalOpen(true);
  };

  const openEdit = (item: Treatment) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      slug: item.slug || "",
      category: item.category || "",
      description: item.description || "",
      cost_usd_min: item.cost_usd_min || 0,
      cost_usd_max: item.cost_usd_max || 0,
      image_url: item.image_url || "",
      is_featured: item.is_featured || false,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item: Treatment) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await fetch("/api/admin/treatments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      setData(data.filter((d) => d.id !== item.id));
    } catch {
      alert("Failed to delete treatment");
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { alert("Treatment name is required"); return; }
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      category: form.category,
      description: form.description || null,
      cost_usd_min: form.cost_usd_min,
      cost_usd_max: form.cost_usd_max,
      image_url: form.image_url || null,
      is_featured: form.is_featured,
    };

    try {
      if (editing) {
        await fetch("/api/admin/treatments", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...payload }),
        });
      } else {
        await fetch("/api/admin/treatments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await fetchData();
      setModalOpen(false);
    } catch {
      alert("Failed to save treatment");
    }
    setSaving(false);
  };

  const filtered = data.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Treatments</h1>
          <p className="text-sm text-gray-500 mt-1">{data.length} treatments total</p>
        </div>
        <button onClick={openAdd} className="bg-[#065c2c] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#054a24] transition-colors flex items-center gap-2">
          <Plus size={16} /> Add Treatment
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search treatments by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#065c2c]"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 border border-gray-200 rounded-lg">
          <p className="text-lg font-medium text-gray-500">No treatments found</p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-medium">Image</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Category</th>
                  <th className="p-4 font-medium">Cost (USD)</th>
                  <th className="p-4 font-medium hidden md:table-cell">Featured</th>
                  <th className="p-4 font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon size={16} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                      <p className="text-xs text-gray-400 mt-0.5 sm:hidden">{item.category}</p>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {item.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      ${(item.cost_usd_min || 0).toLocaleString()} - ${(item.cost_usd_max || 0).toLocaleString()}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {item.is_featured ? <CheckCircle2 size={18} className="text-green-600" /> : <Circle size={18} className="text-gray-300" />}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(item)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? "Edit Treatment" : "Add Treatment"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Image Preview & URL */}
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1.5">Treatment Image</label>
                {form.image_url && (
                  <div className="mb-3 relative inline-block">
                    <img src={form.image_url} alt="Preview" className="w-full max-w-xs h-40 object-cover rounded-lg border border-gray-200" />
                    <button
                      onClick={() => setForm({ ...form, image_url: "" })}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <input
                  type="url"
                  placeholder="Paste image URL (https://...)"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#065c2c]"
                />
                <p className="text-xs text-gray-400 mt-1">Use a direct image URL (jpg, png, webp)</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1.5">Treatment Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Knee Replacement"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#065c2c]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1.5">Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="auto-generated from name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#065c2c]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#065c2c]"
                  >
                    <option value="">Select category...</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Min Cost (USD)</label>
                    <input
                      type="number"
                      value={form.cost_usd_min}
                      onChange={(e) => setForm({ ...form, cost_usd_min: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#065c2c]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Max Cost (USD)</label>
                    <input
                      type="number"
                      value={form.cost_usd_max}
                      onChange={(e) => setForm({ ...form, cost_usd_max: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#065c2c]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1.5">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the treatment, what it includes, recovery time, etc."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#065c2c] resize-y"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="rounded border-gray-300 text-[#065c2c] focus:ring-[#065c2c]"
                />
                <label htmlFor="featured" className="text-sm text-gray-700">Show as featured treatment on homepage</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#065c2c] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#054a24] transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Update Treatment" : "Add Treatment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
