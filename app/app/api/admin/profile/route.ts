import { NextResponse } from "next/server";
import { checkAdmin, getAdminUser } from "@/lib/admin-auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function GET() {
  const unauthorized = await checkAdmin();
  if (unauthorized) return unauthorized;

  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  return NextResponse.json(admin);
}

export async function PUT(request: Request) {
  const unauthorized = await checkAdmin();
  if (unauthorized) return unauthorized;

  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const { name }: { name: string } = await request.json();

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("admin_users")
    .update({ name })
    .eq("id", admin.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
