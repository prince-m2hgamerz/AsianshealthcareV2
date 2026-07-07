"use client";

import { useEffect, useState } from "react";
import { Save, Server } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { SITE_IMAGE_DEFAULTS, SITE_IMAGE_KEYS, SITE_IMAGE_SLOTS, type SiteImageKey } from "@/lib/site-images";
import { DEFAULT_SETTINGS, ENV_OVERRIDEABLE_KEYS } from "@/lib/site-settings-types";

interface SettingField {
  label: string;
  key: string;
}

interface SettingSection {
  title: string;
  fields: SettingField[];
}

const SETTING_SECTIONS: SettingSection[] = [
  {
    title: "General",
    fields: [
      { label: "Site Name", key: "site_name" },
      { label: "Foundation Year", key: "foundation_year" },
      { label: "Opening Hours", key: "opening_hours" },
      { label: "Hero Title", key: "hero_title" },
      { label: "Hero Subtitle", key: "hero_subtitle" },
      { label: "About Short", key: "about_short" },
      { label: "Copyright Text", key: "copyright_text" },
      { label: "Footer Tagline", key: "footer_tagline" },
    ],
  },
  {
    title: "Contact & Address",
    fields: [
      { label: "WhatsApp Number", key: "whatsapp_number" },
      { label: "Contact Phone", key: "contact_phone" },
      { label: "Contact Email", key: "contact_email" },
      { label: "Admin Email", key: "admin_email" },
      { label: "Address Street", key: "address_street" },
      { label: "Address City", key: "address_city" },
      { label: "Address State", key: "address_state" },
      { label: "Address Country", key: "address_country" },
      { label: "Address Pin Code", key: "address_pin_code" },
      { label: "Maps Embed URL", key: "maps_embed_url" },
      { label: "WhatsApp Default Message", key: "whatsapp_message_default" },
      { label: "WhatsApp Consultation Message", key: "whatsapp_message_consultation" },
      { label: "WhatsApp Callback Message", key: "whatsapp_message_callback" },
    ],
  },
  {
    title: "Social & Branding",
    fields: [
      { label: "Facebook URL", key: "facebook_url" },
      { label: "Instagram URL", key: "instagram_url" },
      { label: "Twitter URL", key: "twitter_url" },
      { label: "YouTube URL", key: "youtube_url" },
      { label: "LinkedIn URL", key: "linkedin_url" },
      { label: "Logo URL", key: "logo_url" },
      { label: "Favicon URL", key: "favicon_url" },
      { label: "OG Image URL", key: "og_image_url" },
    ],
  },
  {
    title: "SEO & Analytics",
    fields: [
      { label: "Meta Description", key: "meta_description" },
      { label: "Meta Keywords", key: "meta_keywords" },
      { label: "Meta Title Template", key: "meta_title_template" },
      { label: "GA4 Measurement ID", key: "ga4_measurement_id" },
      { label: "GTM Container ID", key: "gtm_container_id" },
    ],
  },
];

function getEnvVarName(key: string): string {
  return `SITE_SETTING_${key.toUpperCase()}`;
}

function makeSettingEntry(key: string, value: string) {
  return { key, value };
}

export default function AdminSettingsPage() {
  const initialTextSettings = (() => {
    const { images: _, ...rest } = DEFAULT_SETTINGS;
    return rest as Record<string, string>;
  })();
  const [settings, setSettings] = useState<Record<string, string>>(initialTextSettings);
  const [images, setImages] = useState<Record<SiteImageKey, string>>(SITE_IMAGE_DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [envOverrides, setEnvOverrides] = useState<string[]>([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetch("/api/admin/site-settings").then((res) => res.json()).then((data) => {
      if (data && data.data && data.data.length > 0) {
        const merged = { ...initialTextSettings };
        for (const item of data.data) {
          if (typeof item.key === "string" && typeof item.value === "string" && item.key in initialTextSettings) {
            merged[item.key] = item.value;
          }
        }
        setSettings(merged);

        setImages((current) => {
          const next = { ...current };
          data.data.forEach((item: Record<string, unknown>) => {
            if (typeof item.key === "string" && item.key in SITE_IMAGE_DEFAULTS && typeof item.value === "string") {
              next[item.key as SiteImageKey] = item.value;
            }
          });
          return next;
        });
      }
      if (data.envOverrides) {
        setEnvOverrides(data.envOverrides);
      }
    });

    fetch("/api/admin/profile").then((res) => res.json()).then((data) => {
      if (data && data.role) {
        setUserRole(data.role);
      }
    });
  }, []);

  const updateSetting = (key: string, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const updateImage = (key: SiteImageKey, value: string) => {
    setImages((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    const payload = [
      ...Object.entries(settings).map(([key, value]) => makeSettingEntry(key, value)),
      ...Object.entries(images).map(([key, value]) => makeSettingEntry(key, value)),
    ];

    const res = await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const { error: err } = await res.json();
      setError(err ?? "Failed to save settings");
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const envOverriddenSet = new Set(envOverrides);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-heading-xl text-text">Site Settings</h1>
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
        <div className="bg-aloe-10/20 border border-aloe-10 text-text rounded-md px-4 py-3 text-body-md mb-6">
          Settings saved successfully!
        </div>
      )}

      {userRole === "super_admin" && envOverrides.length > 0 && (
        <div className="bg-surface rounded-lg border border-amber-200 p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Server size={18} className="text-amber-600" />
            <h2 className="font-display text-heading-md text-text">System Config — Environment Overrides</h2>
          </div>
          <p className="text-body-md text-text-muted mb-4">
            These settings are controlled by environment variables. The values below are read-only and override any database values.
          </p>
          <div className="space-y-2">
            {envOverrides.map((key) => (
              <div key={key} className="flex items-center justify-between rounded-md bg-amber-50/50 px-4 py-2.5">
                <span className="text-body-md font-medium text-text capitalize">{key.replace(/_/g, " ")}</span>
                <code className="rounded bg-amber-100 px-2.5 py-0.5 text-caption font-mono text-amber-800">
                  {getEnvVarName(key)}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}

      {SETTING_SECTIONS.map((section) => (
        <div key={section.title} className="mb-10">
          <h2 className="font-display text-heading-lg text-text mb-4">{section.title}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {section.fields.map((field) => {
              const isEnvOverridden = envOverriddenSet.has(field.key);
              return (
                <div key={field.key} className={`bg-surface rounded-lg border p-5 ${isEnvOverridden ? "border-amber-200" : "border-border"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-caption text-text-light uppercase tracking-wider">
                      {field.label}
                    </label>
                    {isEnvOverridden && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-caption font-medium text-amber-700">
                        <Server size={12} /> Env
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={settings[field.key] ?? ""}
                    onChange={(e) => updateSetting(field.key, e.target.value)}
                    disabled={isEnvOverridden}
                    className="w-full border border-border rounded-md px-4 py-2.5 text-body-md text-text focus:outline-none focus:border-border-focus transition-colors disabled:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-10">
        <div className="mb-5">
          <p className="text-caption text-text-muted">Supabase Storage</p>
          <h2 className="font-display text-heading-lg text-text">Editable Site Images</h2>
          <p className="mt-1 max-w-3xl text-body-md text-text-muted">
            Upload, replace, or remove the main page and section images. Files are stored in the
            <span className="font-medium text-text"> site-images </span>
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
