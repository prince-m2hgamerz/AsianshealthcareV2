import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { checkAdmin } from "@/lib/admin-auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function generatePassword(): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "!@#$%^&*";
  const all = upper + lower + digits + special;
  let pw = "";
  pw += upper[randomBytes(1)[0] % upper.length];
  pw += lower[randomBytes(1)[0] % lower.length];
  pw += digits[randomBytes(1)[0] % digits.length];
  pw += special[randomBytes(1)[0] % special.length];
  for (let i = 0; i < 8; i++) {
    pw += all[randomBytes(1)[0] % all.length];
  }
  return pw.split("").sort(() => randomBytes(1)[0] - 128).join("");
}

function escapeHtml(val: string): string {
  return val.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  try {
  const unauthorized = await checkAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const { email, role } = body as { email: string; role: string };

  if (!email || !role) {
    return NextResponse.json({ error: "Email and role are required" }, { status: 400 });
  }

  if (!["super_admin", "editor", "viewer"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: existing } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "User already invited" }, { status: 409 });
  }

  const password = generatePassword();

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: email.toLowerCase(),
    password,
    email_confirm: true,
    user_metadata: { role },
  });

  if (authError) {
    console.error("[INVITE] Auth create user error:", authError);
    if (authError.message?.toLowerCase().includes("already")) {
      return NextResponse.json({ error: "This email is already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  const { error: dbError } = await supabase
    .from("admin_users")
    .insert({ email: email.toLowerCase(), role, auth_id: authUser.user.id });

  if (dbError) {
    console.error("[INVITE] DB insert error:", dbError);
    await supabase.auth.admin.deleteUser(authUser.user.id);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://medsolutionhealthcare.com"}/admin/login`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Med Solution Healthcare <noreply@medsolutionhealthcare.com>",
      to: email.toLowerCase(),
      subject: "You've been invited to Med Solution Healthcare Admin",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#000;padding:24px;text-align:center">
            <h1 style="color:#86efac;margin:0;font-size:20px">Med Solution Healthcare</h1>
          </div>
          <div style="padding:24px;background:#fbfbf5">
            <h2 style="margin:0 0 16px;font-size:18px;color:#111">Admin Access Granted</h2>
            <p style="font-size:14px;color:#333;line-height:1.6">
              You have been invited to the <strong>Med Solution Healthcare</strong> admin panel with the role of <strong>${escapeHtml(role.replace("_", " "))}</strong>.
            </p>
            <div style="background:#fff;border-radius:8px;padding:20px;margin:20px 0;border:1px solid #e0e0e0">
              <p style="margin:0 0 12px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px">Your Login Credentials</p>
              <p style="margin:0 0 8px;font-size:14px;color:#111"><strong>Email:</strong> ${escapeHtml(email.toLowerCase())}</p>
              <p style="margin:0 0 16px;font-size:14px;color:#111"><strong>Password:</strong> ${escapeHtml(password)}</p>
              <a href="${escapeHtml(loginUrl)}" style="display:inline-block;background:#22c55e;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600">Login to Admin Panel</a>
            </div>
            <p style="font-size:13px;color:#888;line-height:1.5">
              For security, please change your password after your first login.
            </p>
            <div style="border-top:1px solid #e0e0e0;padding-top:16px;margin-top:16px">
              <p style="font-size:12px;color:#999;line-height:1.5">
                Med Solution Healthcare | Delhi, India<br>
                This is an automated email. Please do not reply.
              </p>
            </div>
          </div>
        </div>
      `,
    });
  } catch {
    // Email failure is non-fatal — user can still log in with the credentials shown in the response
  }

  return NextResponse.json({
    success: true,
    user: { email: email.toLowerCase(), role, password },
  });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[INVITE] Unexpected error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
