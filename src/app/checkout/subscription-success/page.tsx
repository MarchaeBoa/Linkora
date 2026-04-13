import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription, type Profile } from "@/types";

interface SubscriptionSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SubscriptionSuccessPage({
  searchParams,
}: SubscriptionSuccessPageProps) {
  await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isActive = hasActiveSubscription(profile as Profile | null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-violet-50 via-white to-zinc-50 px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-zinc-100 bg-white p-10 text-center shadow-2xl shadow-violet-200/30">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
          {isActive ? (
            <CheckCircle className="h-8 w-8 text-white" />
          ) : (
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          )}
        </div>

        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-zinc-900">
          {isActive ? "Pagamento confirmado!" : "Processando seu pagamento"}
        </h1>
        <p className="mt-3 text-[14px] text-zinc-500">
          {isActive
            ? "Sua assinatura está ativa. Seja bem-vindo(a) à Linkora."
            : "Recebemos seu pagamento e estamos ativando sua assinatura. Isso leva apenas alguns segundos."}
        </p>

        {isActive ? (
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-[14px] font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl"
          >
            Ir para o painel
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href="/checkout/subscription-success"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-zinc-200 px-6 py-3.5 text-[14px] font-bold text-zinc-700 transition-all hover:border-violet-300 hover:bg-violet-50"
          >
            Atualizar página
          </Link>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-zinc-400">
          <Sparkles className="h-3 w-3" />
          <span>Linkora</span>
        </div>
      </div>
    </div>
  );
}
