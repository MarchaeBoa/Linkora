"use client";

import { ProductForm } from "@/components/dashboard/product-form";
import { updateProduct } from "@/actions/products";
import type { Product } from "@/types";

export function EditProductClient({ product }: { product: Product }) {
  return (
    <ProductForm
      product={product}
      action={updateProduct}
      submitLabel="Salvar alterações"
      loadingLabel="Salvando..."
    />
  );
}
