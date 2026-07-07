import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdmin } from "@/lib/admin-auth";

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export async function GET() {
  const unauthorized = await checkAdmin();
  if (unauthorized) return unauthorized;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalLeads, todayLeads, latestLeads, allPipelineLeads, doctors, hospitals, treatments] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
    supabase.from("leads").select("id, name, form_type, country, status, created_at").order("created_at", { ascending: false }).limit(6),
    supabase.from("leads").select("status").limit(500),
    supabase.from("doctors").select("*", { count: "exact", head: true }),
    supabase.from("hospitals").select("*", { count: "exact", head: true }),
    supabase.from("treatments").select("*", { count: "exact", head: true }),
  ]);

  const pipeline = { new: 0, contacted: 0, converted: 0, closed: 0 };
  if (allPipelineLeads.data) {
    for (const lead of allPipelineLeads.data) {
      const status = lead.status as keyof typeof pipeline;
      if (status in pipeline) pipeline[status] += 1;
    }
  }

  return NextResponse.json({
    totalLeads: totalLeads.count ?? 0,
    todayCount: todayLeads.count ?? 0,
    recentLeads: (latestLeads.data ?? []).map((l) => ({
      id: l.id,
      name: l.name,
      type: l.form_type,
      country: l.country,
      status: l.status,
      date: l.created_at ? timeAgo(l.created_at as string) : "",
    })),
    pipeline,
    counts: {
      doctors: doctors.count ?? 0,
      hospitals: hospitals.count ?? 0,
      treatments: treatments.count ?? 0,
    },
  });
}
