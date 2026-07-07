import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const getHospitalBySlug = cache(async (slug: string) => {
  const supabase = await createServerSupabaseClient();
  return supabase.from("hospitals").select("*").eq("slug", slug).single();
});

export const getTreatmentBySlug = cache(async (slug: string) => {
  const supabase = await createServerSupabaseClient();
  return supabase.from("treatments").select("*").eq("slug", slug).single();
});
