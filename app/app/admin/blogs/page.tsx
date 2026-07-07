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
import ImageUploadField from "@/components/admin/ImageUploadField";
import toast from "react-hot-toast";

interface Blog {
  id: string;
  title: string;
  slug: string;
  category: string;
  thumbnail_url: string;
  author: string;
  content: string;
  is_published: boolean;
  created_at: string;
}

const emptyForm = {
  title: "",
  slug: "",
  category: "",
  thumbnail_url: "",
  author: "",
  content: "",
  is_published: false,
};

async function api(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    setLoading(true);
    try {
      const data = await api(
        "/api/admin/manage?table=blogs&order=published_at&orderDirection=desc"
      );
      setBlogs(data);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(b: Blog) {
    setForm({
      title: b.title,
      slug: b.slug,
      category: b.category || "",
      thumbnail_url: b.thumbnail_url || "",
      author: b.author || "",
      content: b.content || "",
      is_published: b.is_published,
    });
    setEditingId(b.id);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await api("/api/admin/manage", {
          method: "POST",
          body: JSON.stringify({
            action: "update",
            table: "blogs",
            id: editingId,
            data: form,
          }),
        });
      } else {
        await api("/api/admin/manage", {
          method: "POST",
          body: JSON.stringify({
            action: "create",
            table: "blogs",
            data: form,
          }),
        });
      }
      toast.success(editingId ? "Blog updated" : "Blog created");
      setModalOpen(false);
      await loadBlogs();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api("/api/admin/manage", {
        method: "POST",
        body: JSON.stringify({ action: "delete", table: "blogs", id }),
      });
      toast.success("Blog deleted");
      await loadBlogs();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Button onClick={openCreate}>Add Blog</Button>
      </div>

      <Input
        placeholder="Search blogs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Published</TableHead>
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
                  No blogs found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    {b.thumbnail_url ? (
                      <img
                        src={b.thumbnail_url}
                        alt={b.title}
                        className="w-16 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-10 bg-muted rounded" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-xs truncate">{b.title}</TableCell>
                  <TableCell>{b.category}</TableCell>
                  <TableCell>{b.author}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                        b.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {b.is_published ? "Yes" : "No"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(b)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(b.id)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Blog" : "Add Blog"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
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
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <ImageUploadField
                label="Thumbnail"
                folder="blogs"
                value={form.thumbnail_url}
                onChange={(url) => setForm({ ...form, thumbnail_url: url })}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={8}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_published}
                onCheckedChange={(v) => setForm({ ...form, is_published: v })}
              />
              <Label>Published</Label>
            </div>
            <Button type="submit" className="w-full">
              {editingId ? "Update" : "Create"} Blog
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
