import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const sessionToken = process.env.ADMIN_SESSION_TOKEN;
    if (!sessionToken) {
      console.error("Missing ADMIN_SESSION_TOKEN env var");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Verify credentials against Supabase Auth
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Check the user exists in admin_users
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const { data: adminUser } = await adminSupabase
      .from("admin_users")
      .select("id, role, email")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (!adminUser) {
      return NextResponse.json({ error: "Not an admin user" }, { status: 403 });
    }

    const response = NextResponse.json({
      success: true,
      token: sessionToken,
      email: adminUser.email,
      role: adminUser.role,
    });

    response.cookies.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    response.cookies.set("admin_email", adminUser.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
