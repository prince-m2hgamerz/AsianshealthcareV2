import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SETTING_KEYS, DEFAULT_SETTINGS } from "@/lib/site-settings-types";

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

  const settings = { ...DEFAULT_SETTINGS };
  if (data) {
    for (const row of data) {
      if (row.key in settings) {
        (settings as Record<string, unknown>)[row.key] = row.value;
      }
    }
  }

  return NextResponse.json(settings);
}
