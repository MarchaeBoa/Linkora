import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EditProductClient } from "./edit-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/products"
          className="rounded-xl p-2 text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Editar produto</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Atualize as informações do seu produto.
          </p>
        </div>
      </div>

      <EditProductClient product={product as Product} />
    </div>
  );
}
