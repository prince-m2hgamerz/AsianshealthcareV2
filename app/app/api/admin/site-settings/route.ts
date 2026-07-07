import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdmin, requireAdminRole } from "@/lib/admin-auth";
import { getEnvOverriddenKeys } from "@/lib/site-settings";

export async function GET() {
  const unauthorized = await checkAdmin();
  if (unauthorized) return unauthorized;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.from("site_settings").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [], envOverrides: getEnvOverriddenKeys() });
}

export async function PUT(request: Request) {
  const unauthorized = await checkAdmin();
  if (unauthorized) return unauthorized;

  const forbidden = await requireAdminRole("super_admin");
  if (forbidden) return forbidden;

  const body: { key: string; value: string }[] = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from("site_settings").upsert(body, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
