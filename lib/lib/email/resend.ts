import { Resend } from "resend";
import { DEFAULT_SETTINGS } from "@/lib/site-settings-types";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendLeadNotificationProps {
  formType: string;
  name: string;
  email?: string;
  phone: string;
  country: string;
  message?: string;
}

export async function sendLeadNotification(data: SendLeadNotificationProps) {
  const { formType, name, email, phone, country, message } = data;

  try {
    await resend.emails.send({
      from: `"${DEFAULT_SETTINGS.site_name}" <noreply@${new URL(DEFAULT_SETTINGS.site_url).hostname}>`,
      to: process.env.ADMIN_EMAIL || DEFAULT_SETTINGS.admin_email,
      subject: `New Lead: ${formType} - ${name}`,
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Form Type:</strong> ${formType}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email || "N/A"}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Country:</strong> ${country}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
      `,
    });
  } catch (error) {
    console.error("Failed to send email notification:", error);
  }
}
