import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Try inserting into newsletter_subscribers table
    const { error } = await supabase.from("newsletter_subscribers").upsert(
      { email, subscribed_at: new Date().toISOString() },
      { onConflict: "email" }
    );

    // If newsletter_subscribers table doesn't exist, save to leads table instead
    if (error) {
      console.error("Newsletter subscribe error:", error.message);

      // Fallback: save as a lead with form_type "Newsletter"
      const { error: leadError } = await supabase.from("leads").insert([{
        name: email.split("@")[0],
        email,
        phone: "",
        country: "International",
        form_type: "Newsletter",
        message: "Newsletter subscription",
        status: "new",
      }]);

      if (leadError) {
        console.error("Newsletter fallback to leads failed:", leadError.message);
        return Response.json({ error: "Failed to subscribe" }, { status: 500 });
      }
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
