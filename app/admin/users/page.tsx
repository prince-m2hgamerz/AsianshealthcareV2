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

interface AdminUser {
  email: string;
  role: string;
}

async function fetchManage(action: string, body?: Record<string, unknown>) {
  const isGet = action === "list";
  const url = isGet && body?.table
    ? `/api/admin/manage?table=${encodeURIComponent(body.table as string)}&order=${encodeURIComponent((body as any).order || "id")}`
    : "/api/admin/manage";
  const res = await fetch(url, {
    method: isGet ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    body: isGet ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await fetchManage("list", {
        action: "list",
        table: "admin_users",
        order: "email",
      });
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(email: string, role: string) {
    const res = await fetch("/api/admin/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create",
        table: "admin_users",
        data: { email, role },
      }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await loadUsers();
  }

  async function handleDelete(email: string) {
    const res = await fetch("/api/admin/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete",
        table: "admin_users",
        field: "email",
        id: email,
      }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await loadUsers();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <InviteDialog onInvite={handleInvite} />
      </div>

      <Input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.filter((u) =>
                u.email.toLowerCase().includes(search.toLowerCase())
              ).length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users
                .filter((u) =>
                  u.email.toLowerCase().includes(search.toLowerCase())
                )
                .map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded">
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(user.email)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function InviteDialog({ onInvite }: { onInvite: (email: string, role: string) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");

  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite Admin</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Invite Admin</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onInvite(email, role);
              setEmail("");
              setRole("editor");
              setOpen(false);
            }}
            className="space-y-4"
          >
            <Input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="editor">Editor</option>
              <option value="super_admin">Super Admin</option>
              <option value="viewer">Viewer</option>
            </select>
            <Button type="submit" className="w-full">
              Send Invite
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
