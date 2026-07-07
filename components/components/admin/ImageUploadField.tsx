"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: string;
  helper?: string;
}

export default function ImageUploadField({ label, value, onChange, folder, helper }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    setUploading(true);
    setError("");

    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);

    const res = await fetch("/api/admin/upload", { method: "POST", body });

    setUploading(false);

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Upload failed");
      return;
    }

    const data = await res.json();
    onChange(data.url);
  };

  const handleRemove = async () => {
    const res = await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: value }),
    });
    if (res.ok) onChange("");
  };

  return (
    <div className="rounded-lg border border-border bg-surface-white p-4 shadow-card">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <label className="block text-caption font-medium text-text">{label}</label>
          {helper && <p className="mt-1 text-micro text-text-muted">{helper}</p>}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-caption text-text-muted transition-colors hover:bg-surface hover:text-text disabled:opacity-50"
        >
          <Upload size={15} />
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleUpload(event.target.files?.[0])}
      />

      <div className="space-y-3">
        {value ? (
          <div className="relative h-36 overflow-hidden rounded-md border border-border bg-surface">
            <img src={value} alt={label} className="h-full w-full object-cover" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-36 w-full flex-col items-center justify-center rounded-md border border-dashed border-border bg-surface text-caption text-text-muted transition-colors hover:border-text-muted hover:text-text"
          >
            <ImagePlus size={24} className="mb-2" />
            Choose image
          </button>
        )}
        <input
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-md border border-border px-3 py-2 text-caption text-text focus:border-border-focus focus:outline-none"
          placeholder="Paste image URL or use upload above"
        />
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 text-caption text-red-500 transition-colors hover:text-red-600"
          >
            <Trash2 size={14} /> Remove image
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-caption text-red-500">{error}</p>}
    </div>
  );
}


