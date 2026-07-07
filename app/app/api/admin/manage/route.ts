import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdmin } from "@/lib/admin-auth";

const ALLOWED_TABLES = [
  "admin_users",
  "doctors",
  "specialties",
  "blogs",
  "hotels",
  "hospitals",
  "testimonials",
  "insurance_companies",
];

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const unauthorized = await checkAdmin();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table");
  const order = searchParams.get("order") || "id";
  const orderDirection = searchParams.get("orderDirection") || "asc";

  if (!table || !ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const db = getSupabase() as any;
  const { data, error } = await db
    .from(table)
    .select("*")
    .order(order, { ascending: orderDirection === "asc" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const unauthorized = await checkAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const { action, table, data, id, field } = body;

  if (!table || !ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const supabase = getSupabase();
  const db = supabase as any;

  switch (action) {
    case "create": {
      const { error } = await db.from(table).insert(data);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }
    case "update": {
      if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
      const fieldName = field || "id";
      const { error } = await db.from(table).update(data).eq(fieldName, id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }
    case "delete": {
      if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
      const fieldName = field || "id";
      const { error } = await db.from(table).delete().eq(fieldName, id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}
