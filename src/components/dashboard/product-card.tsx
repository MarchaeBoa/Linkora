"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { Product, ProductType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { toggleProduct, deleteProduct } from "@/actions/products";
import { toast } from "sonner";
import {
  Package,
  BookOpen,
  FileText,
  GraduationCap,
  File,
  ExternalLink,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TYPE_CONFIG: Record<ProductType, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  ebook: { icon: BookOpen, label: "E-book" },
  pdf: { icon: FileText, label: "PDF" },
  curso: { icon: GraduationCap, label: "Curso" },
  arquivo: { icon: File, label: "Arquivo" },
  link_externo: { icon: ExternalLink, label: "Link" },
};

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function ProductCard({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(product.is_active);

  const typeConfig = TYPE_CONFIG[product.product_type] || TYPE_CONFIG.arquivo;
  const TypeIcon = typeConfig.icon;

  function handleToggle() {
    const newState = !isActive;
    setIsActive(newState);
    startTransition(async () => {
      const result = await toggleProduct(product.id, newState);
      if (result?.error) {
        setIsActive(!newState);
        toast.error(result.error);
      }
    });
  }

  function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.")) return;
    startTransition(async () => {
      const result = await deleteProduct(product.id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Produto excluído.");
      }
    });
  }

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-white/[0.1]">
      {/* Cover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/[0.02]">
        {product.cover_url ? (
          <img
            src={product.cover_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-10 w-10 text-zinc-800" />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <Badge
            className={`text-[10px] font-semibold ${
              isActive
                ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                : "border-zinc-500/30 bg-zinc-800/80 text-zinc-400"
            }`}
          >
            {isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        {/* Type badge */}
        <div className="absolute right-3 top-3">
          <div className="flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-sm">
            <TypeIcon className="h-3 w-3 text-zinc-400" />
            <span className="text-[10px] font-medium text-zinc-300">{typeConfig.label}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold text-white">
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-1 line-clamp-1 text-[13px] text-zinc-500">
                {product.description}
              </p>
            )}
          </div>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-white">
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreVertical className="h-4 w-4" />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 border-white/[0.06] bg-[#0c0c0f]">
              <DropdownMenuItem>
                <Link
                  href={`/dashboard/products/${product.id}`}
                  className="flex w-full items-center gap-2 text-[13px] text-zinc-300"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggle}>
                <div className="flex items-center gap-2 text-[13px] text-zinc-300">
                  {isActive ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      Desativar
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      Ativar
                    </>
                  )}
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem onClick={handleDelete}>
                <div className="flex items-center gap-2 text-[13px] text-red-400">
                  <Trash2 className="h-3.5 w-3.5" />
                  Excluir
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            {product.price === 0 ? "Grátis" : formatPrice(product.price)}
          </span>
          <Link
            href={`/dashboard/products/${product.id}`}
            className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-violet-400 transition-colors hover:bg-violet-500/10"
          >
            Editar
          </Link>
        </div>
      </div>
    </div>
  );
}
