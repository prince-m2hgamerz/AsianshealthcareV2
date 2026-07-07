import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendLeadNotification, sendCustomerConfirmation } from "@/lib/email";
import { sendPushNotification } from "@/lib/pwa/notification";
import { getActiveSubscriptions } from "@/lib/pwa/subscription-manager";
import { sendTelegramAlert } from "@/lib/telegram";
import { sendFcmAlert } from "@/lib/fcm/alert";

const ALLOWED_FIELDS = ["name", "email", "phone", "message", "treatment", "country", "medical_condition"] as const;

function validateInquiryBody(body: Record<string, unknown>) {
  const validated: Record<string, string> = { status: "new", form_type: "Inquiry" };
  for (const key of ALLOWED_FIELDS) {
    const val = body[key];
    if (val !== undefined && val !== null) validated[key] = String(val).trim();
  }
  if (!validated.email) return { error: "Email is required" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validated.email)) return { error: "Invalid email format" };
  if (!validated.name) return { error: "Name is required" };
  if (validated.name.length > 200) return { error: "Name too long" };
  if (validated.message && validated.message.length > 5000) return { error: "Message too long" };
  return { data: validated };
}

export async function POST(request: Request) {
  try {
    const body: Record<string, unknown> = await request.json();
    const validated = validateInquiryBody(body);
    if (validated.error) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("leads")
      .insert([validated.data as never])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 400 });
    }

    const lead = data as Record<string, unknown>;

    await Promise.allSettled([
      sendLeadNotification(lead),
      sendCustomerConfirmation(lead),
      sendTelegramAlert(lead),
      sendFcmAlert(lead),
      getActiveSubscriptions().then((subscriptions) =>
        sendPushNotification(subscriptions, {
          title: "New Inquiry: " + (lead.name || "Unknown"),
          body: `Treatment: ${(lead as { treatment?: string }).treatment || "N/A"}`,
          icon: "/newlogo/logo-mark.png",
          badge: "/newlogo/logo-mark.png",
          data: { url: "/admin/inquiries" },
        })
      ),
    ]);

    return NextResponse.json({ message: "Inquiry submitted successfully", id: lead.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
