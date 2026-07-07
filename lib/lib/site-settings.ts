import { createClient } from "@supabase/supabase-js";
import { mergeSiteImages, SITE_IMAGE_KEYS } from "@/lib/site-images";
import { SiteSettings, DEFAULT_SETTINGS, SETTING_KEYS as BASE_KEYS, ENV_OVERRIDEABLE_KEYS } from "@/lib/site-settings-types";

export type { SiteSettings };
export { DEFAULT_SETTINGS, ENV_OVERRIDEABLE_KEYS };

export const SETTING_KEYS = [...BASE_KEYS, ...SITE_IMAGE_KEYS] as const;

export function getEnvOverriddenKeys(): string[] {
  return ENV_OVERRIDEABLE_KEYS.filter((key) => process.env[`SITE_SETTING_${key.toUpperCase()}`]);
}

export function getEnvOverrides(): Record<string, string> {
  const overrides: Record<string, string> = {};
  for (const key of ENV_OVERRIDEABLE_KEYS) {
    const envValue = process.env[`SITE_SETTING_${key.toUpperCase()}`];
    if (envValue) {
      overrides[key] = envValue;
    }
  }
  return overrides;
}

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
    if (key in settings && key !== "images") {
      (settings as Record<string, unknown>)[key] = value;
    }
  }

  const imageData = data.filter((e) => SITE_IMAGE_KEYS.includes(e.key));
  settings.images = mergeSiteImages(imageData.length > 0 ? imageData : undefined);

  const envOverrides = getEnvOverrides();
  for (const [key, value] of Object.entries(envOverrides)) {
    if (key in settings && key !== "images") {
      (settings as Record<string, unknown>)[key] = value;
    }
  }

  return settings;
}

export async function getSiteImages() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_settings").select("key, value").in("key", SITE_IMAGE_KEYS);
  return mergeSiteImages(data || undefined);
}
