import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle, CreditCard, Shield, Sparkles, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/actions/auth";
import { hasActiveSubscription, type Profile } from "@/types";
import { PLAN_LIST } from "@/lib/plans";
import { SubscribeButton } from "./subscribe-button";

interface PricingPageProps {
  searchParams: Promise<{ canceled?: string }>;
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data as Profile | null;

    // Already subscribed? Send them into the app.
    if (hasActiveSubscription(profile)) {
      redirect("/dashboard");
    }
  }

  const isAuthenticated = Boolean(user);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 text-zinc-900 antialiased">
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Linkora</span>
          </Link>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-xl px-4 py-2 text-[13px] font-medium text-zinc-600 transition-colors hover:text-zinc-900"
                >
                  Sair
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-[13px] font-medium text-zinc-600 transition-colors hover:text-zinc-900"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-[13px] font-semibold text-violet-700">
              <CreditCard className="h-3.5 w-3.5" />
              Escolha seu plano
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              {isAuthenticated ? (
                <>
                  Você está quase lá,
                  <br />
                  <span className="text-zinc-400">assine para começar</span>
                </>
              ) : (
                <>
                  Planos que crescem
                  <br />
                  <span className="text-zinc-400">junto com você</span>
                </>
              )}
            </h1>
            <p className="mt-4 text-lg text-zinc-500">
              {isAuthenticated
                ? "Escolha um plano abaixo para liberar seu painel e começar a vender."
                : "Sem surpresas, sem taxas escondidas. Escolha o plano ideal para você."}
            </p>
            {params?.canceled ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-[13px] font-semibold text-amber-700">
                Checkout cancelado. Escolha um plano quando estiver pronto.
              </div>
            ) : null}
          </div>

          <div className="mt-16 grid items-start gap-6 lg:grid-cols-2">
            {PLAN_LIST.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl transition-all ${
                  plan.highlighted
                    ? "border-2 border-violet-400 bg-gradient-to-b from-violet-600 via-indigo-600 to-violet-700 p-[1px] shadow-2xl shadow-violet-500/30 lg:scale-[1.02] z-10"
                    : "border border-zinc-200 bg-white p-8 hover:shadow-xl hover:shadow-zinc-200/50"
                }`}
              >
                {plan.highlighted ? (
                  <div className="flex flex-1 flex-col rounded-[22px] bg-white p-8">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-[12px] font-bold text-white shadow-xl shadow-violet-500/30">
                        <Star className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                        {plan.badge}
                      </span>
                    </div>

                    <div className="mt-2">
                      <h3 className="text-xl font-extrabold text-zinc-900">{plan.name}</h3>
                      <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
                    </div>
                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-6xl font-extrabold tracking-tight text-zinc-900">
                        {plan.priceLabel}
                      </span>
                      <span className="text-sm text-zinc-400">{plan.period}</span>
                    </div>
                    <p className="mt-1 text-[12px] text-zinc-400">cobrado mensalmente</p>

                    <SubscribeButton
                      plan={plan.id}
                      label={`Assinar ${plan.name}`}
                      requireAuth={!isAuthenticated}
                      className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-[15px] font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none"
                    />
                    <p className="mt-3 text-center text-[11px] text-zinc-400">
                      Cancele quando quiser · Sem permanência
                    </p>

                    <div className="my-6 h-px bg-zinc-100" />

                    <ul className="flex-1 space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-[14px] text-zinc-700">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                          <span className="font-medium">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900">{plan.name}</h3>
                      <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
                    </div>
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold tracking-tight text-zinc-900">
                        {plan.priceLabel}
                      </span>
                      <span className="text-sm text-zinc-400">{plan.period}</span>
                    </div>

                    <ul className="mt-8 flex-1 space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-[14px] text-zinc-600">
                          <CheckCircle className="h-4 w-4 shrink-0 text-zinc-300" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <SubscribeButton
                      plan={plan.id}
                      label={`Assinar ${plan.name}`}
                      requireAuth={!isAuthenticated}
                      className="mt-8 flex items-center justify-center gap-2 rounded-2xl border-2 border-zinc-200 px-6 py-3.5 text-[14px] font-bold text-zinc-700 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-60 disabled:pointer-events-none"
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[13px] text-zinc-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Pagamento seguro via Stripe</span>
            </div>
            <div className="h-4 w-px bg-zinc-200" />
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-violet-500" />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
