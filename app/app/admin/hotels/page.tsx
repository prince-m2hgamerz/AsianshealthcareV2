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

interface Hotel {
  id: string;
  name: string;
  address: string;
  stars: number;
  price_range: string;
  photo_url: string;
  created_at: string;
}

const emptyForm = { name: "", address: "", stars: 3, price_range: "", photo_url: "" };

async function api(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadHotels();
  }, []);

  async function loadHotels() {
    setLoading(true);
    try {
      const data = await api("/api/admin/manage?table=hotels&order=name");
      setHotels(data);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(h: Hotel) {
    setForm({
      name: h.name,
      address: h.address || "",
      stars: h.stars,
      price_range: h.price_range || "",
      photo_url: h.photo_url || "",
    });
    setEditingId(h.id);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await api("/api/admin/manage", {
          method: "POST",
          body: JSON.stringify({ action: "update", table: "hotels", id: editingId, data: form }),
        });
      } else {
        await api("/api/admin/manage", {
          method: "POST",
          body: JSON.stringify({ action: "create", table: "hotels", data: form }),
        });
      }
      toast.success(editingId ? "Hotel updated" : "Hotel created");
      setModalOpen(false);
      await loadHotels();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api("/api/admin/manage", {
        method: "POST",
        body: JSON.stringify({ action: "delete", table: "hotels", id }),
      });
      toast.success("Hotel deleted");
      await loadHotels();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const filtered = hotels.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hotels</h1>
        <Button onClick={openCreate}>Add Hotel</Button>
      </div>

      <Input
        placeholder="Search hotels..."
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
              <TableHead>Address</TableHead>
              <TableHead>Stars</TableHead>
              <TableHead>Price Range</TableHead>
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
                  No hotels found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>
                    {h.photo_url ? (
                      <img src={h.photo_url} alt={h.name} className="w-12 h-8 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-8 bg-muted rounded" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{h.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{h.address}</TableCell>
                  <TableCell>{"★".repeat(h.stars)}</TableCell>
                  <TableCell>{h.price_range}</TableCell>
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
            <DialogTitle>{editingId ? "Edit Hotel" : "Add Hotel"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Hotel Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Stars (1-5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={form.stars}
                onChange={(e) => setForm({ ...form, stars: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Price Range</Label>
              <Input
                placeholder="e.g. $100-200"
                value={form.price_range}
                onChange={(e) => setForm({ ...form, price_range: e.target.value })}
              />
            </div>
            <div>
              <ImageUploadField
                label="Photo URL"
                folder="hotels"
                value={form.photo_url}
                onChange={(url) => setForm({ ...form, photo_url: url })}
              />
            </div>
            <Button type="submit" className="w-full">
              {editingId ? "Update" : "Create"} Hotel
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
