import { createClient } from "@supabase/supabase-js";
import { mergeSiteImages, SITE_IMAGE_KEYS } from "@/lib/site-images";

export interface SiteSettings {
  site_name: string;
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
  admin_email: string;
  hero_title: string;
  hero_subtitle: string;
  about_short: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
  images: Record<string, string>;
}

export const SETTING_KEYS = [
  "site_name",
  "whatsapp_number",
  "contact_phone",
  "contact_email",
  "admin_email",
  "hero_title",
  "hero_subtitle",
  "about_short",
  "facebook_url",
  "instagram_url",
  "twitter_url",
  "youtube_url",
  ...SITE_IMAGE_KEYS,
] as const;

export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: "Med Solution Healthcare",
  whatsapp_number: "918285068544",
  contact_phone: "+918285068544",
  contact_email: "info@medsolutionhealthcare.com",
  admin_email: "admin@medsolutionhealthcare.com",
  hero_title: "Your Health Journey Starts in India",
  hero_subtitle: "Connect with India's top-rated hospitals and specialist doctors.",
  about_short: "Med Solution Healthcare is India's premier medical tourism facilitator.",
  facebook_url: "https://facebook.com/medsolutionhealthcare",
  instagram_url: "https://instagram.com/medsolutionhealthcare",
  twitter_url: "https://twitter.com/medsolutionhealthcare",
  youtube_url: "https://youtube.com/@medsolutionhealthcare",
  images: {},
};

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_settings").select("key, value").in("key", SETTING_KEYS as unknown as string[]);

  if (!data) return DEFAULT_SETTINGS;

  const settings = { ...DEFAULT_SETTINGS };

  for (const { key, value } of data) {
    if (key === "site_name") settings.site_name = value;
    else if (key === "whatsapp_number") settings.whatsapp_number = value;
    else if (key === "contact_phone") settings.contact_phone = value;
    else if (key === "contact_email") settings.contact_email = value;
    else if (key === "admin_email") settings.admin_email = value;
    else if (key === "hero_title") settings.hero_title = value;
    else if (key === "hero_subtitle") settings.hero_subtitle = value;
    else if (key === "about_short") settings.about_short = value;
    else if (key === "facebook_url") settings.facebook_url = value;
    else if (key === "instagram_url") settings.instagram_url = value;
    else if (key === "twitter_url") settings.twitter_url = value;
    else if (key === "youtube_url") settings.youtube_url = value;
  }

  const imageData = data.filter((e) => SITE_IMAGE_KEYS.includes(e.key));
  settings.images = mergeSiteImages(imageData.length > 0 ? imageData : undefined);

  return settings;
}

export async function getSiteImages() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_settings").select("key, value").in("key", SITE_IMAGE_KEYS);
  return mergeSiteImages(data || undefined);
}
