import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, unknown> = {};

  // Check ALL required environment variables
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "ADMIN_EMAIL",
  ];
  const optionalVars = [
    "RESEND_FROM_EMAIL",
    "NEXT_PUBLIC_WHATSAPP_NUMBER",
    "NEXT_PUBLIC_SITE_URL",
  ];

  results.required_vars = {};
  for (const key of requiredVars) {
    (results.required_vars as Record<string, unknown>)[key] = process.env[key] ? "✅ SET" : "❌ MISSING";
  }

  results.optional_vars = {};
  for (const key of optionalVars) {
    (results.optional_vars as Record<string, unknown>)[key] = process.env[key] ? "✅ SET" : "⚠️ not set (using fallback)";
  }

  // Check Resend API key format
  results.resend_key_format = process.env.RESEND_API_KEY?.startsWith("re_") ? "✅ valid" : "❌ invalid (should start with re_)";
  results.resend_from = process.env.RESEND_FROM_EMAIL || "Med Solution Healthcare <noreply@medsolutionhealthcare.com>";

  // Try sending a test email
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL || "Med Solution Healthcare <noreply@medsolutionhealthcare.com>";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@medsolutionhealthcare.com";

    const { data, error } = await resend.emails.send({
      from,
      to: adminEmail,
      subject: "Test Email from Med Solution Healthcare",
      html: `<p>If you receive this, email sending is working correctly on ${process.env.NEXT_PUBLIC_SITE_URL || "unknown"}</p>`,
    });

    results.send_result = data;
    results.send_error = error ? `${error.name}: ${error.message}` : null;
    results.success = !error;
  } catch (err) {
    results.send_caught = String(err);
    results.success = false;
  }

  return Response.json(results);
}
