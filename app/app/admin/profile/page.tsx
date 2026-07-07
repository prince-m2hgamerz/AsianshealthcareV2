"use client";

import { useEffect, useState } from "react";
import { Save, User } from "lucide-react";

export default function AdminProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setName(data.name ?? "");
        setEmail(data.email);
        setRole(data.role);
      })
      .catch(() => setError("Failed to load profile"));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save profile");
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-heading-xl text-text">My Profile</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
        >
          <Save size={16} /> {saving ? "Saving..." : saved ? "Saved!" : "Save"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 text-body-md mb-6">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-aloe-10/20 border border-aloe-10 text-text rounded-md px-4 py-3 text-body-md mb-6">
          Profile saved successfully!
        </div>
      )}

      <div className="max-w-lg space-y-6">
        <div className="bg-surface rounded-lg border border-border p-5">
          <label className="block text-caption text-text-light uppercase tracking-wider mb-2">
            Email
          </label>
          <p className="text-body-md text-text py-2.5">{email}</p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-5">
          <label className="block text-caption text-text-light uppercase tracking-wider mb-2">
            Role
          </label>
          <p className="text-body-md text-text py-2.5 capitalize">{role.replace("_", " ")}</p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-5">
          <label className="block text-caption text-text-light uppercase tracking-wider mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your display name"
            className="w-full border border-border rounded-md px-4 py-2.5 text-body-md text-text focus:outline-none focus:border-border-focus transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
