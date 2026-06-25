"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { SITE_IMAGE_DEFAULTS, SITE_IMAGE_KEYS, SITE_IMAGE_SLOTS, type SiteImageKey } from "@/lib/site-images";

interface Setting {
  label: string;
  key: string;
  value: string;
}

const defaultSettings: Setting[] = [
  { label: "Site Name", key: "site_name", value: "Asians Healthcare" },
  { label: "WhatsApp Number", key: "whatsapp_number", value: "+918285068544" },
  { label: "Contact Phone", key: "contact_phone", value: "+918285068544" },
  { label: "Contact Email", key: "contact_email", value: "info@asianshealthcare.com" },
  { label: "Admin Email", key: "admin_email", value: "admin@asianshealthcare.com" },
  { label: "Hero Title", key: "hero_title", value: "Your Health Journey Starts in India" },
  { label: "Hero Subtitle", key: "hero_subtitle", value: "Connect with India's top-rated hospitals and specialist doctors." },
  { label: "About Short", key: "about_short", value: "Asians Healthcare is India's premier medical tourism facilitator." },
  { label: "Facebook URL", key: "facebook_url", value: "https://facebook.com/asianshealthcare" },
  { label: "Instagram URL", key: "instagram_url", value: "https://instagram.com/asianshealthcare" },
  { label: "Twitter URL", key: "twitter_url", value: "https://twitter.com/asianshealthcare" },
  { label: "YouTube URL", key: "youtube_url", value: "https://youtube.com/@asianshealthcare" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [images, setImages] = useState<Record<SiteImageKey, string>>(SITE_IMAGE_DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("site_settings").select("*").in("key", [...defaultSettings.map((s) => s.key), ...SITE_IMAGE_KEYS]).then(({ data }) => {
      if (data && data.length > 0) {
        const merged = defaultSettings.map((s) => {
          const found = data.find((d: Record<string, unknown>) => d.key === s.key);
          return found ? { ...s, value: found.value as string } : s;
        });
        setSettings(merged);

        setImages((current) => {
          const next = { ...current };
          data.forEach((item: Record<string, unknown>) => {
            if (typeof item.key === "string" && item.key in SITE_IMAGE_DEFAULTS && typeof item.value === "string") {
              next[item.key as SiteImageKey] = item.value;
            }
          });
          return next;
        });
      }
    });
  }, []);

  const updateSetting = (key: string, value: string) => {
    setSettings((current) => current.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const updateImage = (key: SiteImageKey, value: string) => {
    setImages((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    const supabase = createClient();
    setSaving(true);
    setError("");

    const { error: saveError } = await supabase
      .from("site_settings")
      .upsert(
        [
          ...settings.map((setting) => ({ key: setting.key, value: setting.value })),
          ...Object.entries(images).map(([key, value]) => ({ key, value })),
        ],
        { onConflict: "key" }
      );

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-heading-xl text-ink">Site Settings</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50">
          <Save size={16} /> <span className="hidden sm:inline">{saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 text-body-md mb-6">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-aloe-10/20 border border-aloe-10 text-ink rounded-md px-4 py-3 text-body-md mb-6">
          Settings saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settings.map((setting) => (
          <div key={setting.key} className="bg-canvas-light rounded-lg border border-hairline-light p-5">
            <label className="block text-caption text-shade-40 uppercase tracking-wider mb-2">
              {setting.label}
            </label>
            <input
              type="text"
              value={setting.value}
              onChange={(e) => updateSetting(setting.key, e.target.value)}
              className="w-full border border-hairline-light rounded-md px-4 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink transition-colors"
            />
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-5">
          <p className="text-caption text-shade-50">Supabase Storage</p>
          <h2 className="font-display text-heading-lg text-ink">Editable Site Images</h2>
          <p className="mt-1 max-w-3xl text-body-md text-shade-50">
            Upload, replace, or remove the main page and section images. Files are stored in the
            <span className="font-medium text-ink"> site-images </span>
            Supabase bucket and saved as site settings.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {SITE_IMAGE_SLOTS.map((slot) => (
            <ImageUploadField
              key={slot.key}
              label={`${slot.page}: ${slot.label}`}
              value={images[slot.key]}
              onChange={(value) => updateImage(slot.key, value)}
              folder={slot.folder}
              helper={slot.helper}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
