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

interface Doctor {
  id: string;
  name: string;
  slug: string;
  photo_url: string;
  specialties: string[];
  experience_years: number;
  is_featured: boolean;
  created_at: string;
}

const emptyForm = {
  name: "",
  slug: "",
  photo_url: "",
  specialties: "",
  experience_years: 0,
  is_featured: false,
};

async function fetchManage(method: string, body?: Record<string, unknown>) {
  const url = method === "GET"
    ? `/api/admin/manage?table=${body?.table}&order=${body?.order || "name"}`
    : "/api/admin/manage";
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: method === "GET" ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors() {
    setLoading(true);
    try {
      const data = await fetchManage("GET", { table: "doctors", order: "name" });
      setDoctors(data);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(d: Doctor) {
    setForm({
      name: d.name,
      slug: d.slug,
      photo_url: d.photo_url || "",
      specialties: (d.specialties || []).join(", "),
      experience_years: d.experience_years,
      is_featured: d.is_featured,
    });
    setEditingId(d.id);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      specialties: form.specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      experience_years: Number(form.experience_years),
    };

    try {
      if (editingId) {
        await fetchManage("POST", {
          action: "update",
          table: "doctors",
          id: editingId,
          data: payload,
        });
      } else {
        await fetchManage("POST", {
          action: "create",
          table: "doctors",
          data: payload,
        });
      }
      toast.success(editingId ? "Doctor updated" : "Doctor created");
      setModalOpen(false);
      await loadDoctors();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetchManage("POST", {
        action: "delete",
        table: "doctors",
        id,
      });
      toast.success("Doctor deleted");
      await loadDoctors();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const filtered = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <Button onClick={openCreate}>Add Doctor</Button>
      </div>

      <Input
        placeholder="Search doctors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No doctors found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    {d.photo_url ? (
                      <img
                        src={d.photo_url}
                        alt={d.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{(d.specialties || []).join(", ")}</TableCell>
                  <TableCell>{d.experience_years} years</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                        d.is_featured
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {d.is_featured ? "Yes" : "No"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(d)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(d.id)}
                      >
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
            <DialogTitle>{editingId ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Doctor Name</Label>
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
            <div>
              <ImageUploadField
                label="Photo URL"
                folder="doctors"
                value={form.photo_url}
                onChange={(url) => setForm({ ...form, photo_url: url })}
              />
            </div>
            <div className="space-y-2">
              <Label>Specialties (comma separated)</Label>
              <Input
                value={form.specialties}
                onChange={(e) => setForm({ ...form, specialties: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Experience (years)</Label>
              <Input
                type="number"
                value={form.experience_years}
                onChange={(e) =>
                  setForm({ ...form, experience_years: Number(e.target.value) })
                }
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
              {editingId ? "Update" : "Create"} Doctor
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
