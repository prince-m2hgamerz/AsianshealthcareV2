import { Resend } from "resend";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.RESEND_FROM_EMAIL || "Med Solution Healthcare <noreply@medsolutionhealthcare.com>";
const fallbackAdminEmail = process.env.ADMIN_EMAIL || "admin@medsolutionhealthcare.com";

async function getAdminEmail(): Promise<string> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("site_settings").select("value").eq("key", "admin_email").single();
    if (data?.value) return data.value;
  } catch {}
  return fallbackAdminEmail;
}

async function getWhatsAppNumber(): Promise<string> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("site_settings").select("value").eq("key", "whatsapp_number").single();
    if (data?.value) return data.value.replace(/[^0-9]/g, "");
  } catch {}
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, "") || "918285068544";
}

export async function sendLeadNotification(lead: Record<string, unknown>) {
  const formType = lead.form_type as string;
  const name = lead.name as string;
  const country = lead.country as string;
  const adminEmail = await getAdminEmail();

  const fields = Object.entries(lead)
    .filter(([k]) => !["id", "status", "created_at", "updated_at"].includes(k))
    .map(([k, v]) => `<tr><td style="padding:8px 12px;border:1px solid #ddd;font-size:14px;text-transform:capitalize;color:#333">${k.replace(/_/g, " ")}</td><td style="padding:8px 12px;border:1px solid #ddd;font-size:14px;color:#111">${v || "-"}</td></tr>`)
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#000;padding:24px;text-align:center">
        <h1 style="color:#86efac;margin:0;font-size:20px">Med Solution Healthcare</h1>
      </div>
      <div style="padding:24px;background:#fbfbf5">
        <h2 style="margin:0 0 16px;font-size:18px;color:#111">New ${formType} Lead</h2>
        <table style="width:100%;border-collapse:collapse">
          ${fields}
        </table>
        <p style="margin-top:24px;font-size:13px;color:#666">This notification was sent automatically from Med Solution Healthcare.</p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from,
      to: adminEmail,
      subject: `New Lead: ${formType} from ${name} (${country})`,
      html,
    });
  } catch (err) {
    console.error("Failed to send email notification:", err);
  }
}

export async function sendCustomerConfirmation(lead: Record<string, unknown>) {
  const name = lead.name as string;
  const email = lead.email as string;
  const formType = lead.form_type as string;

  if (!email) return;

  const waNumber = await getWhatsAppNumber();

  const formLabels: Record<string, string> = {
    Contact: "Contact Form",
    "Doctor Opinion": "Doctor Opinion Request",
    Insurance: "Insurance Eligibility Check",
    Callback: "Callback Request",
  };

  const label = formLabels[formType] || "Inquiry";

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#000;padding:24px;text-align:center">
        <h1 style="color:#86efac;margin:0;font-size:20px">Med Solution Healthcare</h1>
      </div>
      <div style="padding:24px;background:#fbfbf5">
        <h2 style="margin:0 0 16px;font-size:18px;color:#111">Thank You, ${name}!</h2>
        <p style="font-size:14px;color:#333;line-height:1.6">
          We have received your ${label.toLowerCase()} and our team will review it shortly.
        </p>
        <p style="font-size:14px;color:#333;line-height:1.6">
          A member of our patient support team will contact you within <strong>24 hours</strong> to assist with your medical travel needs.
        </p>
        <div style="background:#fff;border-radius:8px;padding:16px;margin:20px 0;border:1px solid #e0e0e0">
          <p style="margin:0 0 8px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px">Need Immediate Assistance?</p>
          <p style="margin:0;font-size:15px;color:#111">
            WhatsApp: <a href="https://wa.me/${waNumber}" style="color:#22c55e;text-decoration:none;font-weight:600">+${waNumber}</a>
          </p>
        </div>
        <div style="border-top:1px solid #e0e0e0;padding-top:16px;margin-top:16px">
          <p style="font-size:12px;color:#999;line-height:1.5">
            Med Solution Healthcare | Delhi, India<br>
            This is an automated confirmation. Please do not reply to this email.
          </p>
        </div>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from,
      to: email,
      subject: `We received your ${label} - Med Solution Healthcare`,
      html,
    });
  } catch (err) {
    console.error("Failed to send customer confirmation:", err);
  }
}
