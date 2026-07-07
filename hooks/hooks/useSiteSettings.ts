"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/site-settings-types";
import { DEFAULT_SETTINGS } from "@/lib/site-settings-types";

let pending: Promise<SiteSettings> | null = null;

const fetchSettings: () => Promise<SiteSettings> = () =>
  fetch("/api/site-settings")
    .then((res) => (res.ok ? res.json() : DEFAULT_SETTINGS))
    .then((data) => ({ ...DEFAULT_SETTINGS, ...data }))
    .catch(() => DEFAULT_SETTINGS);

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (!pending) pending = fetchSettings();
    pending.then(setSettings);
  }, []);

  return settings;
}
