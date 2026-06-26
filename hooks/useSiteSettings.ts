"use client";

import { useEffect, useState } from "react";

export interface SiteSettings {
  site_name: string;
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
  hero_title: string;
  hero_subtitle: string;
  about_short: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
}

const DEFAULTS: SiteSettings = {
  site_name: "Med Solution Healthcare",
  whatsapp_number: "918285068544",
  contact_phone: "+918285068544",
  contact_email: "info@medsolutionhealthcare.com",
  hero_title: "Your Health Journey Starts in India",
  hero_subtitle: "Connect with India's top-rated hospitals and specialist doctors.",
  about_short: "Med Solution Healthcare is India's premier medical tourism facilitator.",
  facebook_url: "https://facebook.com/medsolutionhealthcare",
  instagram_url: "https://instagram.com/medsolutionhealthcare",
  twitter_url: "https://twitter.com/medsolutionhealthcare",
  youtube_url: "https://youtube.com/@medsolutionhealthcare",
};

let cached: SiteSettings | null = null;
let pending: Promise<SiteSettings> | null = null;

async function fetchSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch("/api/site-settings");
    if (!res.ok) return DEFAULTS;
    const data = await res.json();
    return { ...DEFAULTS, ...data };
  } catch {
    return DEFAULTS;
  }
}

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(cached || DEFAULTS);

  useEffect(() => {
    if (cached) return;
    if (!pending) {
      pending = fetchSettings().then((s) => {
        cached = s;
        return s;
      });
    }
    pending.then(setSettings);
  }, []);

  return settings;
}
