import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { checkAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

async function sendBatch(resend: Resend, from: string, batch: string[], subject: string, html: string) {
  return Promise.allSettled(
    batch.map((email) =>
      resend.emails.send({ from, to: email, subject, html }).then((r) => ({ email, result: r })),
    ),
  );
}

export async function POST(request: Request) {
  const unauthorized = await checkAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { subject, body } = await request.json();
    if (!subject || !body) {
      return Response.json({ error: "Subject and body are required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get subscribers from newsletter_subscribers table
    let emails: string[] = [];

    const { data: subscribers } = await supabase
      .from("newsletter_subscribers")
      .select("email");

    if (subscribers && subscribers.length > 0) {
      emails = subscribers.map((s: { email: string }) => s.email);
    }

    // Also get Newsletter subscribers from leads table (fallback)
    const { data: leadSubscribers } = await supabase
      .from("leads")
      .select("email")
      .eq("form_type", "Newsletter")
      .not("email", "is", null);

    if (leadSubscribers && leadSubscribers.length > 0) {
      const leadEmails = leadSubscribers
        .map((s: { email: string | null }) => s.email)
        .filter((e): e is string => !!e);
      emails = [...new Set([...emails, ...leadEmails])];
    }

    if (emails.length === 0) {
      return Response.json({ error: "No subscribers found" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL || "Med Solution Healthcare <noreply@medsolutionhealthcare.com>";

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:0;background:#f5f5f5">
  <div style="background:#000;padding:24px;text-align:center">
    <h1 style="color:#86efac;margin:0;font-size:20px">Med Solution Healthcare</h1>
  </div>
  <div style="background:#ffffff;padding:32px 24px;border:1px solid #e0e0e0;border-top:none">
    <h2 style="margin:0 0 16px;font-size:22px;color:#111">${subject}</h2>
    <div style="font-size:15px;color:#333;line-height:1.7">
      ${body}
    </div>
  </div>
  <div style="padding:16px 24px;text-align:center">
    <p style="font-size:12px;color:#999;line-height:1.5;margin:0">
      Med Solution Healthcare | Delhi, India<br/>
      You received this because you subscribed to our newsletter.
    </p>
  </div>
</body>
</html>`;

    const BATCH_SIZE = 20;
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      const results = await sendBatch(resend, from, batch, subject, html);
      for (const r of results) {
        if (r.status === "fulfilled") {
          if (r.value.result.error) {
            failed++;
            errors.push(`${r.value.email}: ${r.value.result.error.message}`);
          } else {
            sent++;
          }
        } else {
          failed++;
          errors.push(`Batch item: ${r.reason instanceof Error ? r.reason.message : String(r.reason)}`);
        }
      }
    }

    const message = sent > 0
      ? `Successfully sent to ${sent} subscriber${sent !== 1 ? "s" : ""}${failed > 0 ? `. ${failed} failed.` : ""}`
      : `Failed to send. ${errors[0] || "Unknown error"}`;

    return Response.json({
      message,
      sent,
      failed,
      errors: errors.length > 0 ? errors : undefined,
    }, { status: sent > 0 ? 200 : 500 });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
