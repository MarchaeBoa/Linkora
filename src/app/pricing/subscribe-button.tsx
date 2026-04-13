"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import type { SubscriptionPlan } from "@/types";

interface SubscribeButtonProps {
  plan: SubscriptionPlan;
  label: string;
  className?: string;
  requireAuth?: boolean;
}

export function SubscribeButton({
  plan,
  label,
  className,
  requireAuth,
}: SubscribeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function handleClick() {
    if (requireAuth) {
      startTransition(() => router.push("/register"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        toast.error(data.error || "Não foi possível iniciar o checkout.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("[SubscribeButton] Error:", error);
      toast.error("Erro ao iniciar checkout. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Redirecionando...
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}
