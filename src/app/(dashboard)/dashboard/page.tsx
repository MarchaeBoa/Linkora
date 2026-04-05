import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const [
    { count: productsCount },
    { count: leadsCount },
    { count: linksCount },
    { data: orders },
    { data: recentLeads },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("orders")
      .select("amount, status, created_at, buyer_email")
      .eq("status", "completed"),
    supabase
      .from("leads")
      .select("name, email, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalRevenue =
    orders?.reduce((sum, order) => sum + (order.amount || 0), 0) ?? 0;
  const totalOrders = orders?.length ?? 0;

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);

  const stats = [
    {
      title: "Produtos",
      value: productsCount ?? 0,
      icon: Package,
      gradient: "from-violet-500 to-purple-600",
      href: "/dashboard/products",
    },
    {
      title: "Leads",
      value: leadsCount ?? 0,
      icon: Users,
      gradient: "from-blue-500 to-cyan-600",
      href: "/dashboard/leads",
    },
    {
      title: "Vendas",
      value: totalOrders,
      icon: ShoppingCart,
      gradient: "from-emerald-500 to-teal-600",
      href: "#",
    },
    {
      title: "Receita",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      gradient: "from-amber-500 to-orange-600",
      href: "#",
    },
  ];

  const hasUsername = !!profile?.username;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Olá{profile?.display_name ? `, ${profile.display_name}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Aqui está o resumo da sua conta Linkora.
          </p>
        </div>
        {hasUsername && (
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[13px] font-medium text-zinc-300 transition-all hover:bg-white/[0.05]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Ver minha página
          </a>
        )}
      </div>

      {/* Setup Banner */}
      {!hasUsername && (
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/20">
          <img
            src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&q=60&auto=format"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 to-indigo-600/80" />
          <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Complete seu perfil</h3>
              <p className="mt-1 text-sm text-white/70">
                Escolha seu username para ativar sua página pública e começar a vender.
              </p>
            </div>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[13px] font-bold text-violet-700 shadow-lg transition-all hover:bg-zinc-100"
            >
              Configurar perfil
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="group border-white/[0.06] bg-white/[0.02] transition-all hover:border-white/[0.1] hover:bg-white/[0.04]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-[13px] font-medium text-zinc-500">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`rounded-xl bg-gradient-to-br p-2.5 ${stat.gradient}`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold tracking-tight text-white">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-[15px] font-semibold text-white">
              Ações rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              {
                label: "Criar novo produto",
                href: "/dashboard/products/new",
                icon: Package,
              },
              {
                label: "Adicionar link",
                href: "/dashboard/links",
                icon: Link,
              },
              {
                label: "Editar perfil",
                href: "/dashboard/profile",
                icon: Users,
              },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] px-4 py-3 transition-all hover:border-white/[0.08] hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-3">
                  <Plus className="h-4 w-4 text-violet-400" />
                  <span className="text-[13px] font-medium text-zinc-300">
                    {action.label}
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[15px] font-semibold text-white">
              Últimos leads
            </CardTitle>
            <Link
              href="/dashboard/leads"
              className="text-[12px] font-medium text-violet-400 hover:text-violet-300"
            >
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            {recentLeads && recentLeads.length > 0 ? (
              <div className="space-y-3">
                {recentLeads.map((lead, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg py-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-400">
                        {(lead.name || lead.email)[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-zinc-300">
                          {lead.name || "Sem nome"}
                        </p>
                        <p className="text-[11px] text-zinc-600">
                          {lead.email}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-600">
                      {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Users className="h-8 w-8 text-zinc-700" />
                <p className="text-sm text-zinc-500">Nenhum lead ainda</p>
                <p className="text-xs text-zinc-600">
                  Compartilhe sua página para capturar leads.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Bar */}
      <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <span className="text-[13px] text-zinc-400">
            <span className="font-semibold text-white">{linksCount ?? 0}</span> links ativos
          </span>
        </div>
        <div className="h-4 w-px bg-white/[0.06]" />
        <div className="text-[13px] text-zinc-400">
          <span className="font-semibold text-white">{productsCount ?? 0}</span> produtos cadastrados
        </div>
        <div className="h-4 w-px bg-white/[0.06]" />
        <div className="text-[13px] text-zinc-400">
          <span className="font-semibold text-white">{leadsCount ?? 0}</span> leads capturados
        </div>
      </div>
    </div>
  );
}
