"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Download,
  Loader2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface OrderData {
  downloadUrl: string;
  productName: string;
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#09090b]"><Loader2 className="h-8 w-8 animate-spin text-violet-400" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const isFree = searchParams.get("free") === "true";

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    orderId ? "ready" : "loading"
  );
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [resolvedOrderId, setResolvedOrderId] = useState<string | null>(orderId);

  useEffect(() => {
    if (orderId) {
      fetchDownload(orderId);
      return;
    }

    if (!sessionId) {
      setStatus("error");
      return;
    }

    // Poll for order creation (webhook may take a moment)
    let attempts = 0;
    const maxAttempts = 10;

    const poll = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/stripe/verify?session_id=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.orderId) {
            setResolvedOrderId(data.orderId);
            clearInterval(poll);
            fetchDownload(data.orderId);
          }
        }
      } catch {}

      if (attempts >= maxAttempts) {
        clearInterval(poll);
        setStatus("ready"); // Show success without download
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [sessionId, orderId]);

  async function fetchDownload(oid: string) {
    try {
      const res = await fetch(`/api/download/${oid}`);
      if (res.ok) {
        const data = await res.json();
        setOrderData(data);
      }
    } catch {}
    setStatus("ready");
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] px-5">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        <p className="mt-4 text-sm text-zinc-500">Confirmando pagamento...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] px-5">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <img
          src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=60&auto=format"
          alt=""
          className="h-full w-full object-cover opacity-[0.03]"
        />
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-600/[0.06] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 text-center backdrop-blur-sm sm:p-10">
          {/* Success icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-white">
            {isFree ? "Download liberado!" : "Compra realizada!"}
          </h1>

          <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">
            {isFree
              ? "Seu produto gratuito está pronto para download."
              : "Seu pagamento foi processado com sucesso. O produto está disponível para download."}
          </p>

          {/* Download button */}
          {orderData?.downloadUrl && (
            <a
              href={orderData.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-emerald-700 active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              Baixar {orderData.productName || "produto"}
            </a>
          )}

          {/* Security note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-zinc-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            {orderData?.downloadUrl
              ? "Link expira em 5 minutos. Recarregue a página para gerar novo link."
              : "Você também receberá o acesso por email."}
          </div>

          {/* Back link */}
          <div className="mt-8 border-t border-white/[0.06] pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-zinc-500 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar ao início
            </Link>
          </div>
        </div>

        {/* Branding */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-zinc-700">
          <Sparkles className="h-3 w-3 text-violet-500" />
          Pagamento seguro via Linkora
        </div>
      </div>
    </div>
  );
}
