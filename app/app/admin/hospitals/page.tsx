"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImageUploadField from "@/components/admin/ImageUploadField";
import toast from "react-hot-toast";

interface Hospital {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  city: string;
  state: string;
  beds_count: number;
  accreditations: string[];
  is_featured: boolean;
  created_at: string;
}

const emptyForm = {
  name: "",
  slug: "",
  logo_url: "",
  city: "",
  state: "",
  beds_count: 0,
  accreditations: "",
  is_featured: false,
};

async function api(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadHospitals();
  }, []);

  async function loadHospitals() {
    setLoading(true);
    try {
      const data = await api("/api/admin/manage?table=hospitals&order=name");
      setHospitals(data);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(h: Hospital) {
    setForm({
      name: h.name,
      slug: h.slug,
      logo_url: h.logo_url || "",
      city: h.city || "",
      state: h.state || "",
      beds_count: h.beds_count,
      accreditations: (h.accreditations || []).join(", "),
      is_featured: h.is_featured,
    });
    setEditingId(h.id);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      accreditations: form.accreditations
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      beds_count: Number(form.beds_count),
    };

    try {
      if (editingId) {
        await api("/api/admin/manage", {
          method: "POST",
          body: JSON.stringify({ action: "update", table: "hospitals", id: editingId, data: payload }),
        });
      } else {
        await api("/api/admin/manage", {
          method: "POST",
          body: JSON.stringify({ action: "create", table: "hospitals", data: payload }),
        });
      }
      toast.success(editingId ? "Hospital updated" : "Hospital created");
      setModalOpen(false);
      await loadHospitals();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api("/api/admin/manage", {
        method: "POST",
        body: JSON.stringify({ action: "delete", table: "hospitals", id }),
      });
      toast.success("Hospital deleted");
      await loadHospitals();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const filtered = hospitals.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hospitals</h1>
        <Button onClick={openCreate}>Add Hospital</Button>
      </div>

      <Input
        placeholder="Search hospitals..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Beds</TableHead>
              <TableHead>Accreditations</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No hospitals found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>
                    {h.logo_url ? (
                      <img src={h.logo_url} alt={h.name} className="w-10 h-10 object-contain rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{h.name}</TableCell>
                  <TableCell>{[h.city, h.state].filter(Boolean).join(", ")}</TableCell>
                  <TableCell>{h.beds_count}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {(h.accreditations || []).join(", ")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                        h.is_featured
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {h.is_featured ? "Yes" : "No"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(h)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(h.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Hospital" : "Add Hospital"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Hospital Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Beds Count</Label>
              <Input
                type="number"
                value={form.beds_count}
                onChange={(e) => setForm({ ...form, beds_count: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Accreditations (comma separated)</Label>
              <Input
                value={form.accreditations}
                onChange={(e) => setForm({ ...form, accreditations: e.target.value })}
              />
            </div>
            <div>
              <ImageUploadField
                label="Logo URL"
                folder="hospitals"
                value={form.logo_url}
                onChange={(url) => setForm({ ...form, logo_url: url })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_featured}
                onCheckedChange={(v) => setForm({ ...form, is_featured: v })}
              />
              <Label>Featured</Label>
            </div>
            <Button type="submit" className="w-full">
              {editingId ? "Update" : "Create"} Hospital
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
