import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";

export async function GET() {
  const unauthorized = await checkAdmin();
  if (unauthorized) return unauthorized;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Try fetching from newsletter_subscribers table
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return NextResponse.json(data);
    }

    // Fallback: check leads table for Newsletter form_type entries
    const { data: leads, error: leadsError } = await supabase
      .from("leads")
      .select("email, created_at")
      .eq("form_type", "Newsletter")
      .order("created_at", { ascending: false });

    if (leadsError) {
      console.error("Subscribers fetch error:", leadsError.message);
      return NextResponse.json([]);
    }

    // Map leads to subscriber format
    const subscribers = (leads || []).map((l: { email: string; created_at: string }) => ({
      email: l.email,
      subscribed_at: l.created_at,
    }));

    return NextResponse.json(subscribers);
  } catch (err) {
    console.error("Admin subscribers error:", err);
    return NextResponse.json([]);
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await checkAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Try deleting from newsletter_subscribers
    await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("email", email);

    // Also delete from leads if it was stored there
    await supabase
      .from("leads")
      .delete()
      .eq("email", email)
      .eq("form_type", "Newsletter");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
