"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/dashboard/product-form";
import { createProduct } from "@/actions/products";

export default function NewProductPage() {
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
          <h1 className="text-2xl font-bold text-white">Novo produto</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Crie um produto digital para vender na sua página.
          </p>
        </div>
      </div>

      <ProductForm
        action={createProduct}
        submitLabel="Criar produto"
        loadingLabel="Criando..."
      />
    </div>
  );
}
