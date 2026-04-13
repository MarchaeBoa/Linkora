"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Mail, ArrowRight, AlertCircle } from "lucide-react";

interface CheckoutFormProps {
  productId: string;
  isFree: boolean;
  themeColor: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutForm({ productId, isFree, themeColor }: CheckoutFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      setError("Informe um email válido para receber o produto.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, buyerEmail: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || "Não foi possível iniciar o checkout. Tente novamente.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="buyer-email"
          className="mb-2 block text-[12px] font-semibold uppercase tracking-widest text-zinc-500"
        >
          Seu email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          <input
            id="buyer-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            disabled={loading}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@email.com"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 pl-10 pr-3.5 text-[14px] text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-white/[0.2] focus:bg-white/[0.05] disabled:opacity-50"
          />
        </div>
        <p className="mt-2 text-[11px] text-zinc-600">
          {isFree
            ? "Usaremos seu email para enviar o link de download."
            : "Usaremos seu email para enviar o recibo e o link de download."}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-[12px] text-red-400">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        style={{ backgroundColor: themeColor }}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            {isFree ? "Receber gratuitamente" : "Ir para o pagamento"}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
