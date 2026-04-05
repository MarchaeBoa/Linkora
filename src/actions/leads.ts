"use server";

import { createClient } from "@/lib/supabase/server";

export async function captureLead(formData: FormData) {
  const supabase = await createClient();

  const user_id = formData.get("user_id") as string;
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;

  if (!user_id || !email) {
    return { error: "User ID and email are required" };
  }

  // Check for duplicate email per user
  const { data: existing } = await supabase
    .from("leads")
    .select("id")
    .eq("user_id", user_id)
    .eq("email", email)
    .single();

  if (existing) {
    return { error: "Email already subscribed" };
  }

  const { error } = await supabase.from("leads").insert({
    user_id,
    email,
    name: name || null,
  });

  if (error) {
    return { error: "Failed to save lead" };
  }

  return { success: true };
}

export async function getLeads(userId: string) {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("leads")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: "Failed to fetch leads", leads: [], count: 0 };
  }

  return { leads: data ?? [], count: count ?? 0 };
}
