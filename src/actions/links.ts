"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createLink(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;

  if (!title || !url) {
    return { error: "Title and URL are required" };
  }

  // Get the highest position
  const { data: existing } = await supabase
    .from("links")
    .select("position")
    .eq("user_id", user.id)
    .order("position", { ascending: false })
    .limit(1);

  const position = existing && existing.length > 0 ? existing[0].position + 1 : 0;

  const { error } = await supabase.from("links").insert({
    user_id: user.id,
    title,
    url,
    position,
    is_active: true,
  });

  if (error) {
    return { error: "Failed to create link" };
  }

  revalidatePath("/dashboard/links");
  return { success: true };
}

export async function updateLink(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const is_active = formData.get("is_active") === "true";

  if (!id) return { error: "Link ID is required" };

  const updateData: Record<string, unknown> = {};
  if (title) updateData.title = title;
  if (url) updateData.url = url;
  updateData.is_active = is_active;

  const { error } = await supabase
    .from("links")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Failed to update link" };
  }

  revalidatePath("/dashboard/links");
  return { success: true };
}

export async function deleteLink(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Failed to delete link" };
  }

  revalidatePath("/dashboard/links");
  return { success: true };
}

export async function reorderLinks(
  links: { id: string; position: number }[],
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Update each link position
  for (const link of links) {
    const { error } = await supabase
      .from("links")
      .update({ position: link.position })
      .eq("id", link.id)
      .eq("user_id", user.id);

    if (error) {
      return { error: "Failed to reorder links" };
    }
  }

  revalidatePath("/dashboard/links");
  return { success: true };
}
