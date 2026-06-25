import { Resend } from "resend";

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
      from: "Med Solution Healthcare <noreply@medsolutionhealthcare.com>",
      to: process.env.ADMIN_EMAIL || "admin@medsolutionhealthcare.com",
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
