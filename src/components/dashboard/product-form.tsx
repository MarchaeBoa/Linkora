"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  Image as ImageIcon,
  FileDown,
  BookOpen,
  FileText,
  GraduationCap,
  File,
  ExternalLink,
} from "lucide-react";
import type { Product, ProductType } from "@/types";

const PRODUCT_TYPES: { value: ProductType; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  { value: "ebook", label: "E-book", icon: BookOpen, description: "Livro digital" },
  { value: "pdf", label: "PDF", icon: FileText, description: "Documento PDF" },
  { value: "curso", label: "Curso", icon: GraduationCap, description: "Curso ou aulas" },
  { value: "arquivo", label: "Arquivo", icon: File, description: "Template, preset, etc" },
  { value: "link_externo", label: "Link Externo", icon: ExternalLink, description: "Redireciona para URL" },
];

interface ProductFormProps {
  product?: Product | null;
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  submitLabel: string;
  loadingLabel: string;
}

export function ProductForm({ product, action, submitLabel, loadingLabel }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState<ProductType>(product?.product_type || "arquivo");
  const [coverPreview, setCoverPreview] = useState<string | null>(product?.cover_url || null);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(product ? "Produto atualizado!" : "Produto criado!");
        router.push("/dashboard/products");
      }
    });
  }

  const priceDefault = product ? (product.price / 100).toFixed(2) : "";

  return (
    <form action={handleSubmit} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      {/* Product Info */}
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-[15px] text-white">Informações do produto</CardTitle>
          <CardDescription className="text-zinc-500">
            Dados principais que o comprador verá.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300">
              Nome do produto <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name ?? ""}
              required
              maxLength={100}
              placeholder="Ex: Guia Completo de Marketing Digital"
              className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-zinc-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-300">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description ?? ""}
              placeholder="Descreva o que o comprador vai receber..."
              rows={4}
              className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-zinc-600 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-zinc-300">
              Preço (R$) <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">R$</span>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={priceDefault}
                placeholder="49.90"
                className="border-white/[0.06] bg-white/[0.03] pl-10 text-white placeholder:text-zinc-600"
              />
            </div>
            <p className="text-xs text-zinc-600">Use 0 para produto gratuito.</p>
          </div>
        </CardContent>
      </Card>

      {/* Product Type */}
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-[15px] text-white">Tipo do produto</CardTitle>
          <CardDescription className="text-zinc-500">
            Define o tipo de conteúdo que você está vendendo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {PRODUCT_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.value;
              return (
                <label key={type.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="product_type"
                    value={type.value}
                    checked={isSelected}
                    onChange={() => setSelectedType(type.value)}
                    className="peer sr-only"
                  />
                  <div
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                      isSelected
                        ? "border-violet-500/40 bg-violet-500/[0.08] shadow-sm"
                        : "border-white/[0.06] bg-white/[0.01] hover:border-white/[0.1] hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isSelected ? "text-violet-400" : "text-zinc-500"}`} />
                    <span className={`text-[12px] font-medium ${isSelected ? "text-white" : "text-zinc-400"}`}>
                      {type.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Files */}
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-[15px] text-white">Arquivos</CardTitle>
          <CardDescription className="text-zinc-500">
            Imagem de capa e arquivo para entrega.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cover Image */}
          <div className="space-y-3">
            <Label className="text-zinc-300">Imagem de capa</Label>
            <div className="flex items-start gap-4">
              <div className="flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
                {coverPreview ? (
                  <img src={coverPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-zinc-700" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-3 transition-colors hover:border-white/[0.2] hover:bg-white/[0.04]">
                  <Upload className="h-4 w-4 text-zinc-500" />
                  <span className="text-[13px] text-zinc-400">Escolher imagem</span>
                  <input
                    name="cover"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleCoverChange}
                  />
                </label>
                <p className="text-[11px] text-zinc-600">
                  JPG ou PNG. Recomendado: 1200x630px. Máx 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Digital File */}
          {selectedType !== "link_externo" && (
            <div className="space-y-3">
              <Label className="text-zinc-300">
                Arquivo digital {!product && <span className="text-red-400">*</span>}
              </Label>
              <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-8 text-center transition-colors hover:border-violet-500/30 hover:bg-violet-500/[0.03]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                  <FileDown className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-zinc-300">
                    Clique para selecionar o arquivo
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-600">
                    PDF, ZIP, MP4, ou qualquer arquivo digital. Máx 50MB.
                  </p>
                </div>
                <input
                  name="file"
                  type="file"
                  required={!product}
                  className="sr-only"
                />
              </label>
              {product?.file_url && (
                <p className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                  <File className="h-3 w-3" />
                  Arquivo atual mantido. Envie um novo para substituir.
                </p>
              )}
            </div>
          )}

          {/* External Link */}
          {selectedType === "link_externo" && (
            <div className="space-y-2">
              <Label htmlFor="external_url" className="text-zinc-300">
                URL externa <span className="text-red-400">*</span>
              </Label>
              <Input
                id="external_url"
                name="external_url"
                type="url"
                placeholder="https://exemplo.com/meu-curso"
                className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-zinc-600"
              />
              <p className="text-[11px] text-zinc-600">
                O comprador será redirecionado para este link após o pagamento.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <p className="text-[13px] text-zinc-500">
          {product ? "As alterações serão aplicadas imediatamente." : "O produto será criado como ativo."}
        </p>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-violet-600 px-6 font-semibold text-white hover:bg-violet-700"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loadingLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
