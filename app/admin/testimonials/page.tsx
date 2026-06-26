"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import ImageUploadField from "@/components/admin/ImageUploadField";
import toast from "react-hot-toast";

interface Testimonial {
  id: string;
  patient_name: string;
  country: string;
  treatment: string;
  text_content: string;
  rating: number;
  is_approved: boolean;
  image_url: string;
  video_url: string;
  created_at?: string;
}

const emptyForm = {
  patient_name: "",
  country: "",
  treatment: "",
  text_content: "",
  rating: 5,
  is_approved: false,
  image_url: "",
  video_url: "",
};

async function api(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    setLoading(true);
    try {
      const data = await api(
        "/api/admin/manage?table=testimonials&order=created_at&orderDirection=desc"
      );
      setTestimonials(data);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(t: Testimonial) {
    setForm({
      patient_name: t.patient_name,
      country: t.country,
      treatment: t.treatment,
      text_content: t.text_content,
      rating: t.rating || 5,
      is_approved: t.is_approved,
      image_url: t.image_url || "",
      video_url: t.video_url || "",
    });
    setEditingId(t.id);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      rating: Number(form.rating),
      image_url: form.image_url || null,
      video_url: form.video_url || null,
    };

    try {
      if (editingId) {
        await api("/api/admin/manage", {
          method: "POST",
          body: JSON.stringify({
            action: "update",
            table: "testimonials",
            id: editingId,
            data: payload,
          }),
        });
      } else {
        await api("/api/admin/manage", {
          method: "POST",
          body: JSON.stringify({
            action: "create",
            table: "testimonials",
            data: payload,
          }),
        });
      }
      toast.success(editingId ? "Testimonial updated" : "Testimonial created");
      setModalOpen(false);
      await loadTestimonials();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function toggleApproval(t: Testimonial) {
    try {
      await api("/api/admin/manage", {
        method: "POST",
        body: JSON.stringify({
          action: "update",
          table: "testimonials",
          id: t.id,
          data: { is_approved: !t.is_approved },
        }),
      });
      toast.success(`Testimonial ${t.is_approved ? "unapproved" : "approved"}`);
      await loadTestimonials();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await api("/api/admin/manage", {
        method: "POST",
        body: JSON.stringify({ action: "delete", table: "testimonials", id }),
      });
      toast.success("Testimonial deleted");
      await loadTestimonials();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const filtered = testimonials.filter((t) =>
    t.patient_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Button onClick={openCreate}>Add Testimonial</Button>
      </div>

      <Input
        placeholder="Search by patient name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Treatment</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead className="w-40">Actions</TableHead>
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
                  No testimonials found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    {t.image_url ? (
                      <img
                        src={t.image_url}
                        alt={t.patient_name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{t.patient_name}</TableCell>
                  <TableCell>{t.country}</TableCell>
                  <TableCell className="max-w-40 truncate">{t.treatment}</TableCell>
                  <TableCell>
                    <span className="text-yellow-500 text-sm">
                      {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.is_approved ? "default" : "secondary"}>
                      {t.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(t)}>
                        Edit
                      </Button>
                      <Button
                        variant={t.is_approved ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleApproval(t)}
                      >
                        {t.is_approved ? "Unapprove" : "Approve"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(t.id)}
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
            <DialogTitle>
              {editingId ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <Input
                  value={form.patient_name}
                  onChange={(e) =>
                    setForm({ ...form, patient_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Treatment</Label>
              <Input
                value={form.treatment}
                onChange={(e) =>
                  setForm({ ...form, treatment: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Text Content</Label>
              <Textarea
                value={form.text_content}
                onChange={(e) =>
                  setForm({ ...form, text_content: e.target.value })
                }
                required
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rating (1-5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) =>
                    setForm({ ...form, rating: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="flex items-end gap-2 pb-2">
                <Switch
                  checked={form.is_approved}
                  onCheckedChange={(v) =>
                    setForm({ ...form, is_approved: v })
                  }
                />
                <Label>Approved</Label>
              </div>
            </div>
            <div>
              <ImageUploadField
                label="Patient Image"
                folder="testimonials"
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
              />
            </div>
            <div className="space-y-2">
              <Label>Video URL (optional)</Label>
              <Input
                value={form.video_url}
                onChange={(e) =>
                  setForm({ ...form, video_url: e.target.value })
                }
                placeholder="https://youtube.com/..."
              />
            </div>
            <Button type="submit" className="w-full">
              {editingId ? "Update" : "Create"} Testimonial
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
