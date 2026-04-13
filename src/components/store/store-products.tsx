import Link from "next/link";
import type { Product } from "@/types";
import { ShoppingCart, Package } from "lucide-react";

interface StoreProductsProps {
  products: Product[];
  themeColor: string;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function StoreProducts({ products, themeColor }: StoreProductsProps) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <Package className="h-4 w-4 text-zinc-600" />
        <h2 className="text-[13px] font-semibold uppercase tracking-widest text-zinc-500">
          Produtos
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-white/[0.1]"
          >
            {/* Cover Image */}
            {product.cover_url ? (
              <div className="aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                <img
                  src={product.cover_url}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="flex aspect-[16/10] w-full items-center justify-center bg-white/[0.02]">
                <Package className="h-10 w-10 text-zinc-800" />
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              <h3 className="text-[15px] font-semibold text-white">
                {product.name}
              </h3>

              {product.description && (
                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500 line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold tracking-tight text-white">
                    {formatPrice(product.price)}
                  </span>
                </div>

                <Link
                  href={`/checkout/${product.id}`}
                  prefetch={false}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97]"
                  style={{ backgroundColor: themeColor }}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Comprar
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
