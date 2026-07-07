import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function checkAdmin(request?: Request): Promise<NextResponse | null> {
  let session: string | undefined;

  if (request) {
    session = (request as any).cookies?.get?.("admin_session")?.value;
  } else {
    const cookieStore = await cookies();
    session = cookieStore.get("admin_session")?.value;
  }

  const validToken = process.env.ADMIN_SESSION_TOKEN;
  if (!validToken || session !== validToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export async function getAdminUser() {
  const cookieStore = await cookies();
  const email = cookieStore.get("admin_email")?.value;
  if (!email) return null;

  const serviceClient = createServiceRoleClient();
  const { data } = await serviceClient
    .from("admin_users")
    .select("id, email, role, name")
    .eq("email", email)
    .single();

  return data;
}

export async function requireAdminRole(...roles: string[]): Promise<NextResponse | null> {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!roles.includes(admin.role)) {
    return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
  }
  return null;
}
