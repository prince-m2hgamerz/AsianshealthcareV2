import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { checkAdmin } from "@/lib/admin-auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await checkAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json();
  const { role } = body as { role: string };

  if (!role || !["super_admin", "editor", "viewer"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: target, error: targetError } = await supabase
    .from("admin_users")
    .select("id, email, role")
    .eq("id", id)
    .single();

  if (targetError || !target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("admin_users")
    .update({ role })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, user: { ...target, role } });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await checkAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  const supabase = createServiceRoleClient();

  const { data: target, error: targetError } = await supabase
    .from("admin_users")
    .select("id, email, role, auth_id")
    .eq("id", id)
    .single();

  if (targetError || !target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { count } = await supabase
    .from("admin_users")
    .select("id", { count: "exact", head: true })
    .eq("role", "super_admin");

  if (target.role === "super_admin" && count && count <= 1) {
    return NextResponse.json(
      { error: "Cannot remove the last super admin" },
      { status: 400 }
    );
  }

  const { error: dbError } = await supabase
    .from("admin_users")
    .delete()
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  if (target.auth_id) {
    await supabase.auth.admin.deleteUser(target.auth_id);
  }

  return NextResponse.json({ success: true });
}
