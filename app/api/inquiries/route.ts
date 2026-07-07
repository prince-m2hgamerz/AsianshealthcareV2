import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendLeadNotification, sendCustomerConfirmation } from "@/lib/email";
import { sendPushNotification } from "@/lib/pwa/notification";
import { getActiveSubscriptions } from "@/lib/pwa/subscription-manager";
import { sendFcmAlert } from "@/lib/fcm/alert";

export async function POST(request: Request) {
  try {
    const body: Record<string, unknown> = await request.json();

    // Use service role key to bypass RLS for lead inserts
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Build message combining treatment info and user message
    const messageParts: string[] = [];
    if (body.treatment) messageParts.push(`Treatment: ${body.treatment}`);
    if (body.medical_condition) messageParts.push(`Condition: ${body.medical_condition}`);
    if (body.message) messageParts.push(String(body.message));
    const combinedMessage = messageParts.join("\n") || null;

    // Insert into leads table with only valid fields
    const { data, error } = await supabase
      .from("leads")
      .insert([{
        name: String(body.name || "Unknown"),
        email: body.email ? String(body.email) : null,
        phone: String(body.phone || ""),
        country: String(body.country || "International"),
        form_type: String(body.form_type || "Inquiry Form"),
        message: combinedMessage,
        status: "new",
      }])
      .select()
      .single();

    if (error) {
      console.error("Supabase inquiries insert error:", error);
      return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 400 });
    }

    const lead = data as Record<string, unknown>;

    // Send email notifications and push notifications (non-blocking)
    Promise.allSettled([
      sendLeadNotification(lead),
      sendCustomerConfirmation(lead),
      sendFcmAlert(lead),
      getActiveSubscriptions().then((subscriptions) =>
        sendPushNotification(subscriptions, {
          title: "New Patient Inquiry: " + (lead.name || "Unknown"),
          body: `Treatment: ${(lead as { treatment?: string }).treatment || "N/A"} | Country: ${lead.country || "N/A"}`,
          icon: "/newlogo/logo-mark.png",
          badge: "/newlogo/logo-mark.png",
          data: { url: "/admin/inquiries" },
        })
      ),
    ]).catch(() => {});

    return NextResponse.json({ message: "Inquiry submitted successfully" }, { status: 201 });
  } catch (err) {
    console.error("API /api/inquiries error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
