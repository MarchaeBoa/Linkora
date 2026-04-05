import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/types";
import { Package, Plus } from "lucide-react";
import { ProductCard } from "@/components/dashboard/product-card";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const items = (products ?? []) as Product[];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Produtos</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gerencie seus produtos digitais. {items.length > 0 && `${items.length} produto${items.length > 1 ? "s" : ""} cadastrado${items.length > 1 ? "s" : ""}.`}
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-violet-700"
        >
          <Plus className="h-4 w-4" />
          Novo produto
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
            <Package className="h-7 w-7 text-zinc-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Nenhum produto ainda
            </h3>
            <p className="mt-1 max-w-sm text-sm text-zinc-500">
              Crie seu primeiro produto digital para começar a vender na sua página.
            </p>
          </div>
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-violet-700"
          >
            <Plus className="h-4 w-4" />
            Criar produto
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
