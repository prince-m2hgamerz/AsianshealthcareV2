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
import ImageUploadField from "@/components/admin/ImageUploadField";
import toast from "react-hot-toast";

interface Specialty {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  created_at: string;
}

const emptyForm = { name: "", slug: "", description: "", icon_url: "" };

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadSpecialties();
  }, []);

  async function loadSpecialties() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/manage?table=specialties&order=name");
      if (!res.ok) throw new Error((await res.json()).error);
      setSpecialties(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId
            ? { action: "update", table: "specialties", id: editingId, data: form }
            : { action: "create", table: "specialties", data: form }
        ),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(editingId ? "Specialty updated" : "Specialty created");
      setModalOpen(false);
      await loadSpecialties();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", table: "specialties", id }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Specialty deleted");
      await loadSpecialties();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const filtered = specialties.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Specialties</h1>
        <Button onClick={() => { setForm(emptyForm); setEditingId(null); setModalOpen(true); }}>
          Add Specialty
        </Button>
      </div>

      <Input
        placeholder="Search specialties..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No specialties found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    {s.icon_url ? (
                      <img src={s.icon_url} alt={s.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <div className="w-8 h-8 bg-muted rounded" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{s.description}</TableCell>
                  <TableCell className="text-muted-foreground">{s.slug}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setForm({
                            name: s.name,
                            slug: s.slug,
                            description: s.description,
                            icon_url: s.icon_url || "",
                          });
                          setEditingId(s.id);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(s.id)}>
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
            <DialogTitle>{editingId ? "Edit Specialty" : "Add Specialty"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
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
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon URL</Label>
              <ImageUploadField
                label="Icon URL"
                folder="specialties"
                value={form.icon_url}
                onChange={(url) => setForm({ ...form, icon_url: url })}
              />
            </div>
            <Button type="submit" className="w-full">
              {editingId ? "Update" : "Create"} Specialty
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
