"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw, Sparkles, Loader2 } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#09090b]"><Loader2 className="h-6 w-6 animate-spin text-zinc-500" /></div>}>
      <CancelContent />
    </Suspense>
  );
}

function CancelContent() {
  const searchParams = useSearchParams();
  const seller = searchParams.get("seller");
  const productId = searchParams.get("product");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] px-5">
      <div className="pointer-events-none fixed inset-0">
        <img
          src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=60&auto=format"
          alt=""
          className="h-full w-full object-cover opacity-[0.03]"
        />
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-zinc-600/[0.04] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 text-center backdrop-blur-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/80">
            <XCircle className="h-8 w-8 text-zinc-500" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-white">
            Pagamento cancelado
          </h1>

          <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">
            Você cancelou o pagamento. Nenhuma cobrança foi feita.
            Você pode tentar novamente quando quiser.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {seller && (
              <Link
                href={`/${seller}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-violet-700"
              >
                <RefreshCw className="h-4 w-4" />
                Voltar para a loja
              </Link>
            )}

            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3.5 text-[15px] font-medium text-zinc-300 transition-all hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" />
              Ir para o início
            </Link>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-zinc-700">
          <Sparkles className="h-3 w-3 text-violet-500" />
          Linkora
        </div>
      </div>
    </div>
  );
}
