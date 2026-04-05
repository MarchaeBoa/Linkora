"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const username = formData.get("username") as string;
  const display_name = formData.get("display_name") as string;
  const bio = formData.get("bio") as string;
  const theme_color = formData.get("theme_color") as string;
  const avatarFile = formData.get("avatar") as File | null;

  // Check username availability (if changed)
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", user.id)
    .single();

  if (existing) {
    return { error: "Username is already taken" };
  }

  // Upload avatar if provided
  let avatar_url: string | undefined;
  if (avatarFile && avatarFile.size > 0) {
    const ext = avatarFile.name.split(".").pop();
    const filePath = `avatars/${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true });

    if (!uploadError) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);
      avatar_url = publicUrl;
    }
  }

  // Build social links
  const social_links: Record<string, string> = {};
  for (const platform of ["instagram", "youtube", "tiktok", "twitter"]) {
    const value = formData.get(`social_${platform}`) as string;
    if (value) social_links[platform] = value;
  }

  const updateData: Record<string, unknown> = {
    username,
    display_name,
    bio: bio || null,
    theme_color: theme_color || "#8B5CF6",
    social_links,
    updated_at: new Date().toISOString(),
  };

  if (avatar_url) {
    updateData.avatar_url = avatar_url;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    return { error: "Failed to update profile" };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function checkUsername(username: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const query = supabase
    .from("profiles")
    .select("id")
    .eq("username", username);

  if (user) {
    query.neq("id", user.id);
  }

  const { data } = await query.single();
  return !data;
}
