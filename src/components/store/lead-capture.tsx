"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Mail, Check, Loader2, Sparkles } from "lucide-react";

interface LeadCaptureProps {
  userId: string;
  themeColor: string;
}

export function LeadCapture({ userId, themeColor }: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify({ email, name, userId }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setName("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-6 py-8 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
          <Check className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <p className="font-semibold text-emerald-400">Inscrito com sucesso!</p>
          <p className="mt-1 text-xs text-zinc-500">
            Você receberá novidades em breve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]"
    >
      <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-6 py-4">
        <Sparkles className="h-4 w-4" style={{ color: themeColor }} />
        <h3 className="text-[14px] font-semibold text-white">
          Fique por dentro das novidades
        </h3>
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-zinc-600"
          />
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-zinc-600"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-50"
            style={{ backgroundColor: themeColor }}
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Mail className="h-3.5 w-3.5" />
                Inscrever
              </>
            )}
          </button>
        </div>

        {status === "error" && (
          <p className="mt-3 text-xs text-red-400">
            Erro ao inscrever. Tente novamente.
          </p>
        )}

        <p className="mt-3 text-[11px] text-zinc-600">
          Sem spam. Cancele quando quiser.
        </p>
      </div>
    </form>
  );
}
