import { NextResponse } from "next/server";
import { Resend } from "resend";
import { checkAdmin } from "@/lib/admin-auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const unauthorized = await checkAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { to, subject, text_body, html_body, parent_id } = await request.json();

    if (!to || !subject || !text_body) {
      return NextResponse.json({ error: "Missing required fields: to, subject, text_body" }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@medsolutionhealthcare.com";

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "medsolutionhealthcare <noreply@medsolutionhealthcare.com>",
      to,
      subject,
      text: text_body,
      html: html_body || text_body.replace(/\n/g, "<br>"),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const workerUrl = process.env.EMAIL_WORKER_URL;
    const workerToken = process.env.EMAIL_WORKER_TOKEN;

    if (workerUrl && workerToken) {
      try {
        await fetch(`${workerUrl}/api/emails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-token": workerToken,
          },
          body: JSON.stringify({
            from_name: "Admin",
            from_address: adminEmail,
            to_address: to,
            subject,
            text_body,
            html_body: html_body || null,
            parent_id: parent_id || null,
          }),
        });
      } catch {
        // worker persistence failure is non-fatal
      }
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
