import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Product, Profile } from "@/types";
import {
  ArrowLeft,
  Package,
  ShieldCheck,
  Sparkles,
  Lock,
} from "lucide-react";
import { CheckoutForm } from "./checkout-form";

interface PageProps {
  params: Promise<{ productId: string }>;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { productId } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name")
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (!product) {
    return { title: "Checkout | Linkora" };
  }

  return {
    title: `Finalizar compra · ${product.name} | Linkora`,
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutProductPage({ params }: PageProps) {
  const { productId } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const typedProduct = product as Product;

  const { data: seller } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, theme_color")
    .eq("id", typedProduct.user_id)
    .single();

  const typedSeller = seller as Pick<
    Profile,
    "id" | "username" | "display_name" | "avatar_url" | "theme_color"
  > | null;

  const themeColor = typedSeller?.theme_color || "#8B5CF6";
  const isFree = typedProduct.price === 0;

  return (
    <div className="dark relative min-h-screen bg-[#09090b] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <img
          src="/images/bg-bokeh.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.08]"
        />
        <div
          className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full opacity-[0.07] blur-[120px]"
          style={{ backgroundColor: themeColor }}
        />
      </div>

      {/* Top bar */}
      <div className="relative">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 pt-8">
          {typedSeller ? (
            <Link
              href={`/${typedSeller.username}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2 text-[13px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.05]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar para a loja
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2 text-[13px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.05]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar
            </Link>
          )}

          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
            <Lock className="h-3 w-3" />
            Checkout seguro
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Finalizar compra
          </h1>
          <p className="mt-2 text-[14px] text-zinc-500">
            Revise os detalhes do produto e informe seu email para continuar.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Product card */}
          <section className="overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02]">
            {typedProduct.cover_url ? (
              <div className="aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                <img
                  src={typedProduct.cover_url}
                  alt={typedProduct.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[16/10] w-full items-center justify-center bg-white/[0.02]">
                <Package className="h-12 w-12 text-zinc-800" />
              </div>
            )}

            <div className="p-6">
              {typedSeller && (
                <div className="mb-4 flex items-center gap-2.5">
                  {typedSeller.avatar_url ? (
                    <img
                      src={typedSeller.avatar_url}
                      alt={typedSeller.display_name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-400">
                      {typedSeller.display_name?.charAt(0).toUpperCase() ?? "L"}
                    </div>
                  )}
                  <div className="text-[12px] text-zinc-500">
                    Vendido por{" "}
                    <span className="font-medium text-zinc-300">
                      {typedSeller.display_name}
                    </span>
                  </div>
                </div>
              )}

              <h2 className="text-xl font-semibold text-white">
                {typedProduct.name}
              </h2>

              {typedProduct.description && (
                <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">
                  {typedProduct.description}
                </p>
              )}

              <div className="mt-6 border-t border-white/[0.06] pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] text-zinc-500">Total</span>
                  <span className="text-3xl font-bold tracking-tight text-white">
                    {isFree ? "Grátis" : formatPrice(typedProduct.price)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Form card */}
          <section className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-7">
            <CheckoutForm
              productId={typedProduct.id}
              isFree={isFree}
              themeColor={themeColor}
            />

            <div className="mt-6 space-y-2.5 border-t border-white/[0.06] pt-5 text-[12px] text-zinc-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Pagamento processado com segurança pelo Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-zinc-500" />
                <span>Seus dados são criptografados de ponta a ponta</span>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 flex items-center justify-center gap-1.5 text-[11px] text-zinc-700">
          <Sparkles className="h-3 w-3 text-violet-500" />
          Linkora
        </div>
      </div>
    </div>
  );
}
