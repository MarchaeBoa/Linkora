"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProductType } from "@/types";

const VALID_TYPES: ProductType[] = ["ebook", "pdf", "curso", "arquivo", "link_externo"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { supabase, user };
}

async function uploadFile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bucket: string,
  userId: string,
  file: File,
  folder: string
) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${folder}/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) return null;

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
}

export async function createProduct(formData: FormData) {
  const auth = await getAuthUser();
  if (!auth) return { error: "Faça login para continuar." };
  const { supabase, user } = auth;

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const priceStr = formData.get("price") as string;
  const productType = formData.get("product_type") as string;
  const coverFile = formData.get("cover") as File | null;
  const digitalFile = formData.get("file") as File | null;

  if (!name) return { error: "O nome do produto é obrigatório." };
  if (name.length > 100) return { error: "O nome deve ter no máximo 100 caracteres." };

  const price = parseFloat(priceStr);
  if (isNaN(price) || price < 0) return { error: "Informe um preço válido." };
  const priceInCents = Math.round(price * 100);

  if (!productType || !VALID_TYPES.includes(productType as ProductType)) {
    return { error: "Selecione um tipo de produto válido." };
  }

  if (productType !== "link_externo") {
    if (!digitalFile || digitalFile.size === 0) {
      return { error: "O arquivo digital é obrigatório." };
    }
    if (digitalFile.size > MAX_FILE_SIZE) {
      return { error: "O arquivo deve ter no máximo 50MB." };
    }
  }

  if (coverFile && coverFile.size > MAX_IMAGE_SIZE) {
    return { error: "A imagem de capa deve ter no máximo 5MB." };
  }

  let file_url: string | null = null;
  if (digitalFile && digitalFile.size > 0) {
    file_url = await uploadFile(supabase, "files", user.id, digitalFile, "products");
    if (!file_url) return { error: "Erro ao fazer upload do arquivo." };
  }

  let cover_url: string | null = null;
  if (coverFile && coverFile.size > 0) {
    cover_url = await uploadFile(supabase, "covers", user.id, coverFile, "products");
  }

  const { error } = await supabase.from("products").insert({
    user_id: user.id,
    name,
    description,
    price: priceInCents,
    product_type: productType,
    cover_url,
    file_url: file_url || "",
    is_active: true,
  });

  if (error) return { error: "Erro ao criar produto. Tente novamente." };

  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function updateProduct(formData: FormData) {
  const auth = await getAuthUser();
  if (!auth) return { error: "Faça login para continuar." };
  const { supabase, user } = auth;

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const priceStr = formData.get("price") as string;
  const productType = formData.get("product_type") as string;

  if (!id) return { error: "ID do produto é obrigatório." };
  if (!name) return { error: "O nome do produto é obrigatório." };
  if (name.length > 100) return { error: "O nome deve ter no máximo 100 caracteres." };

  const price = parseFloat(priceStr);
  if (isNaN(price) || price < 0) return { error: "Informe um preço válido." };
  const priceInCents = Math.round(price * 100);

  if (!productType || !VALID_TYPES.includes(productType as ProductType)) {
    return { error: "Selecione um tipo de produto válido." };
  }

  const updateData: Record<string, unknown> = {
    name,
    description,
    price: priceInCents,
    product_type: productType,
  };

  const coverFile = formData.get("cover") as File | null;
  if (coverFile && coverFile.size > 0) {
    if (coverFile.size > MAX_IMAGE_SIZE) return { error: "A capa deve ter no máximo 5MB." };
    const url = await uploadFile(supabase, "covers", user.id, coverFile, "products");
    if (url) updateData.cover_url = url;
  }

  const digitalFile = formData.get("file") as File | null;
  if (digitalFile && digitalFile.size > 0) {
    if (digitalFile.size > MAX_FILE_SIZE) return { error: "O arquivo deve ter no máximo 50MB." };
    const url = await uploadFile(supabase, "files", user.id, digitalFile, "products");
    if (url) updateData.file_url = url;
  }

  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Erro ao atualizar produto." };

  revalidatePath("/dashboard/products");
  revalidatePath(`/dashboard/products/${id}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  const auth = await getAuthUser();
  if (!auth) return { error: "Faça login para continuar." };
  const { supabase, user } = auth;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Erro ao excluir produto." };

  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function toggleProduct(id: string, isActive: boolean) {
  const auth = await getAuthUser();
  if (!auth) return { error: "Faça login para continuar." };
  const { supabase, user } = auth;

  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Erro ao alterar status." };

  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function getProduct(id: string) {
  const auth = await getAuthUser();
  if (!auth) return null;
  const { supabase, user } = auth;

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  return data;
}
