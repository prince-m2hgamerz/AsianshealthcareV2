import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SETTING_KEYS = [
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
];

const DEFAULTS: Record<string, string> = {
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
};

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", SETTING_KEYS);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const settings = { ...DEFAULTS };
  if (data) {
    for (const row of data) {
      if (row.key in settings) {
        settings[row.key] = row.value;
      }
    }
  }

  return NextResponse.json(settings);
}
