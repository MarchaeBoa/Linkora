"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Link2,
  ShoppingBag,
  Users,
  Zap,
  Shield,
  BarChart3,
  Sparkles,
  CheckCircle,
  Star,
  Globe,
  Palette,
  CreditCard,
  FileDown,
  Mail,
  ChevronRight,
  Menu,
  X,
  Play,
  ArrowUpRight,
  TrendingUp,
  Layers,
  MousePointer,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ─────────────── IMAGES (Unsplash) ─────────────── */
const IMAGES = {
  hero1: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80&auto=format",
  hero2: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=800&q=80&auto=format",
  hero3: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format",
  creator1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format",
  creator2: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&auto=format",
  creator3: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80&auto=format",
  creator4: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&auto=format",
  creator5: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80&auto=format",
  dashboard: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format",
  mockup: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80&auto=format",
};

/* ─────────────── DATA ─────────────── */
const features = [
  {
    icon: MousePointer,
    title: "Link na bio premium",
    description: "Página personalizada com seu domínio. Muito mais que um Linktree.",
    color: "from-violet-500 to-indigo-600",
  },
  {
    icon: ShoppingBag,
    title: "Loja digital completa",
    description: "Venda ebooks, cursos, templates. Entrega automática após pagamento.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: CreditCard,
    title: "Checkout Stripe",
    description: "Pagamento seguro em 1 clique. PIX, cartão e boleto.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Users,
    title: "Captura de leads",
    description: "Formulário integrado para crescer sua lista de emails.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: BarChart3,
    title: "Analytics em tempo real",
    description: "Vendas, leads, cliques — tudo num dashboard poderoso.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Palette,
    title: "100% customizável",
    description: "Cores, temas, fontes. Sua marca, do seu jeito.",
    color: "from-purple-500 to-fuchsia-600",
  },
];

const stats = [
  { value: "10K+", label: "Criadores" },
  { value: "R$2M+", label: "Processados" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Avaliação" },
];

const howItWorks = [
  {
    step: "01",
    title: "Crie sua conta",
    description: "Cadastro gratuito em 30 segundos. Sem cartão de crédito.",
  },
  {
    step: "02",
    title: "Monte sua página",
    description: "Adicione links, produtos e personalize com suas cores.",
  },
  {
    step: "03",
    title: "Compartilhe e venda",
    description: "Cole o link na bio e comece a faturar. Simples assim.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "0",
    period: "para sempre",
    description: "Para quem está começando",
    features: ["1 página pública", "Até 5 links", "3 produtos", "Captura de leads", "Checkout Stripe"],
    cta: "Começar grátis",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "29",
    period: "/mês",
    description: "Para criadores profissionais",
    features: ["Links ilimitados", "Produtos ilimitados", "Analytics avançado", "Domínio próprio", "Sem marca Linkora", "Suporte prioritário", "Webhooks"],
    cta: "Começar teste grátis",
    highlighted: true,
    badge: "Mais popular",
  },
  {
    name: "Business",
    price: "79",
    period: "/mês",
    description: "Para equipes e empresas",
    features: ["Tudo do Pro", "Múltiplas páginas", "Membros da equipe", "API completa", "White-label", "SLA 99.9%", "Gerente dedicado"],
    cta: "Falar com vendas",
    highlighted: false,
  },
];

const faqs = [
  { question: "Preciso saber programar?", answer: "Não! A Linkora foi criada para ser simples. Você configura tudo em minutos, sem código." },
  { question: "Como recebo os pagamentos?", answer: "Via Stripe, direto na sua conta bancária. Sem intermediários." },
  { question: "Posso usar meu domínio?", answer: "Sim! No plano Pro você conecta seu domínio personalizado." },
  { question: "Que produtos posso vender?", answer: "Ebooks, cursos, templates, presets, planilhas, PDFs e qualquer arquivo digital." },
  { question: "Tem taxa sobre vendas?", answer: "Zero taxa de plataforma. Só a taxa padrão do Stripe (2.9% + R$0.30)." },
  { question: "Posso cancelar a qualquer momento?", answer: "Sim, sem multa. Faça downgrade para o plano gratuito quando quiser." },
];

const testimonials = [
  { name: "Ana Clara", role: "Designer Digital", text: "Migrei da Stan Store e triplicei minhas vendas no primeiro mês.", rating: 5 },
  { name: "Pedro Santos", role: "YouTuber", text: "Configurei em 10 minutos e já fiz minha primeira venda no mesmo dia.", rating: 5 },
  { name: "Juliana Mendes", role: "Coach", text: "O dashboard é incrível. Finalmente sei exatamente quanto estou faturando.", rating: 5 },
];

/* ─────────────── COMPONENT ─────────────── */
export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased">
      {/* ═══════ NAVBAR ═══════ */}
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Linkora</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {["Recursos", "Como funciona", "Preços", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} className="text-[13px] font-medium text-zinc-500 transition-colors hover:text-zinc-900">
                {item}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="rounded-xl px-4 py-2 text-[13px] font-medium text-zinc-600 transition-colors hover:text-zinc-900">
              Entrar
            </Link>
            <Link href="/register" className="rounded-xl bg-zinc-900 px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:shadow-xl">
              Começar grátis
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-zinc-100 bg-white px-6 py-4 md:hidden">
            {["Recursos", "Como funciona", "Preços", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm text-zinc-600">
                {item}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-zinc-100 pt-4">
              <Link href="/login" className="py-2 text-sm text-zinc-600">Entrar</Link>
              <Link href="/register" className="rounded-xl bg-zinc-900 px-4 py-2.5 text-center text-sm font-semibold text-white">Começar grátis</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden pt-28 pb-0 sm:pt-36">
        {/* Bokeh background wallpaper */}
        <img
          src="/images/bg-hero-bokeh.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Gradient overlay on top of bokeh */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/70 via-indigo-600/60 to-purple-700/70" />

        {/* Floating light shapes */}
        <div className="absolute left-10 top-40 h-72 w-72 rounded-full bg-white/[0.06] blur-3xl" />
        <div className="absolute right-10 bottom-20 h-96 w-96 rounded-full bg-cyan-400/[0.06] blur-3xl" />
        <div className="absolute left-1/2 top-20 h-60 w-60 -translate-x-1/2 rounded-full bg-blue-400/[0.08] blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[13px] font-medium text-white/90 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5" />
                A plataforma #1 para criadores no Brasil
              </div>

              <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[68px]">
                Sua loja de
                <br />
                criador,{" "}
                <span className="relative">
                  <span className="relative z-10">all‑in‑one</span>
                  <span className="absolute -bottom-1 left-0 z-0 h-3 w-full rounded bg-yellow-400/40" />
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70 sm:text-xl lg:mx-0 mx-auto">
                Links, produtos digitais, checkout e analytics. Tudo na sua página personalizada. O jeito mais fácil de monetizar sua audiência.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/register" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-[15px] font-bold text-violet-700 shadow-2xl shadow-black/20 transition-all hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98]">
                  Começar gratuitamente
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a href="#como-funciona" className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/25 px-8 py-4 text-[15px] font-semibold text-white transition-all hover:bg-white/10">
                  <Play className="h-4 w-4" />
                  Ver como funciona
                </a>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                <div className="flex -space-x-3">
                  {[IMAGES.creator1, IMAGES.creator2, IMAGES.creator3, IMAGES.creator4, IMAGES.creator5].map((src, i) => (
                    <img key={i} src={src} alt="" className="h-10 w-10 rounded-full border-[3px] border-violet-600 object-cover" />
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-[13px] text-white/60">
                    <strong className="text-white">2.847</strong> criadores já usam
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Hero Mockup */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative mx-auto w-[320px] sm:w-[360px]">
                {/* Phone frame */}
                <div className="overflow-hidden rounded-[2.5rem] border-[8px] border-white/20 bg-white/10 shadow-2xl shadow-black/30 backdrop-blur-xl">
                  <div className="bg-gradient-to-b from-zinc-50 to-white p-6 pb-8">
                    {/* Profile */}
                    <div className="flex flex-col items-center text-center">
                      <img src={IMAGES.hero3} alt="Creator" className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg" />
                      <h3 className="mt-3 text-lg font-bold text-zinc-900">Alexandra Silva</h3>
                      <p className="text-xs text-zinc-500">Criadora de conteúdo digital</p>

                      <div className="mt-3 flex gap-2">
                        {["YT", "TT", "IG"].map((s) => (
                          <div key={s} className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-[9px] font-bold text-zinc-500">{s}</div>
                        ))}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="mt-5 space-y-2.5">
                      {[
                        { text: "Meu Curso de Marketing", emoji: "🚀", price: "R$ 197" },
                        { text: "E-book Gratuito", emoji: "📘", price: "Grátis" },
                        { text: "Mentoria 1:1", emoji: "💬", price: "R$ 97" },
                        { text: "Me siga no Instagram", emoji: "📸", price: null },
                      ].map((link) => (
                        <div key={link.text} className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{link.emoji}</span>
                            <span className="text-[12px] font-semibold text-zinc-800">{link.text}</span>
                          </div>
                          {link.price && (
                            <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${link.price === "Grátis" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>
                              {link.price}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -left-16 top-28 hidden rounded-2xl border border-white/20 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm lg:block">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500">Vendas hoje</p>
                      <p className="text-sm font-bold text-zinc-900">R$ 1.247</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-12 bottom-32 hidden rounded-2xl border border-white/20 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm lg:block">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                      <Users className="h-4 w-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500">Novos leads</p>
                      <p className="text-sm font-bold text-zinc-900">+34 hoje</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 gap-4 border-t border-white/10 py-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ LOGOS ═══════ */}
      <section className="border-b border-zinc-100 bg-zinc-50 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Infraestrutura de classe mundial
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-14 gap-y-4">
            {["Next.js", "Stripe", "Supabase", "Vercel", "React"].map((name) => (
              <span key={name} className="text-[15px] font-bold tracking-tight text-zinc-300">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ MARQUEE SOCIAL PROOF ═══════ */}
      <section className="overflow-hidden bg-zinc-900 py-5">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex shrink-0 items-center gap-8 pr-8">
              {[
                "⭐ 2.847 criadores ativos",
                "💰 R$2M+ processados",
                "🚀 95% vendem em 7 dias",
                "📈 3x mais vendas",
                "🔒 0% taxa de plataforma",
                "⚡ Setup em 2 minutos",
                "💜 4.9/5 de avaliação",
                "🌎 Criadores em 15 países",
              ].map((text) => (
                <span key={`${rep}-${text}`} className="text-[14px] font-semibold text-white/80">
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ REPLACE 5 APPS ═══════ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left: Visual */}
            <div className="relative">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "Linktree", price: "R$24/mês", emoji: "🌳", color: "bg-emerald-50 border-emerald-200" },
                  { name: "Hotmart", price: "R$0 + 20%", emoji: "🔥", color: "bg-orange-50 border-orange-200" },
                  { name: "Mailchimp", price: "R$55/mês", emoji: "📧", color: "bg-yellow-50 border-yellow-200" },
                  { name: "Calendly", price: "R$40/mês", emoji: "📅", color: "bg-blue-50 border-blue-200" },
                  { name: "Gumroad", price: "R$0 + 10%", emoji: "🛒", color: "bg-pink-50 border-pink-200" },
                  { name: "Analytics", price: "R$49/mês", emoji: "📊", color: "bg-purple-50 border-purple-200" },
                ].map((app) => (
                  <div key={app.name} className={`relative rounded-2xl border ${app.color} p-4 text-center opacity-60`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-px w-full rotate-[-15deg] bg-red-400/40" />
                    </div>
                    <span className="text-2xl">{app.emoji}</span>
                    <p className="mt-2 text-[12px] font-bold text-zinc-600">{app.name}</p>
                    <p className="text-[10px] text-zinc-400">{app.price}</p>
                  </div>
                ))}
              </div>
              {/* Arrow down */}
              <div className="my-6 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
                  <ArrowRight className="h-5 w-5 rotate-90 text-violet-600" />
                </div>
              </div>
              {/* Linkora card */}
              <div className="rounded-3xl border-2 border-violet-300 bg-gradient-to-r from-violet-50 to-indigo-50 p-6 text-center shadow-lg shadow-violet-100">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <p className="mt-3 text-xl font-extrabold text-zinc-900">Linkora</p>
                <p className="mt-1 text-sm text-violet-600 font-bold">A partir de R$0/mês</p>
                <p className="mt-1 text-xs text-zinc-500">Tudo em um só lugar</p>
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-[13px] font-semibold text-violet-700">
                💰 Uma solução mais simples
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Pare de pagar por
                <br />
                <span className="text-violet-600">5+ ferramentas diferentes</span>
              </h2>
              <p className="mt-6 text-[16px] leading-relaxed text-zinc-500">
                Linktree para links, Hotmart para vender, Mailchimp para emails, Calendly para agendamentos... Com a Linkora, você substitui todas essas ferramentas por uma única plataforma. Mais simples, mais barato, mais profissional.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: "Antes", value: "R$168+", sub: "/mês em ferramentas", color: "text-red-500", bg: "bg-red-50 border-red-100" },
                  { label: "Agora", value: "R$0", sub: "/mês com Linkora", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
                ].map((item) => (
                  <div key={item.label} className={`rounded-2xl border ${item.bg} p-5`}>
                    <p className="text-[12px] font-bold uppercase tracking-wider text-zinc-400">{item.label}</p>
                    <p className={`mt-1 text-3xl font-extrabold ${item.color}`}>{item.value}</p>
                    <p className="text-[12px] text-zinc-500">{item.sub}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 text-[15px] font-bold text-white shadow-lg transition-all hover:bg-zinc-800"
              >
                Começar grátis agora
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ INTEGRATIONS ═══════ */}
      <section className="border-y border-zinc-100 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Integra com suas ferramentas{" "}
              <span className="text-violet-600">favoritas</span>
            </h2>
            <p className="mt-3 text-zinc-500">
              Conecte a Linkora com as ferramentas que você já usa.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {[
              { name: "Stripe", emoji: "💳", bg: "bg-violet-50" },
              { name: "Google Analytics", emoji: "📊", bg: "bg-orange-50" },
              { name: "Zapier", emoji: "⚡", bg: "bg-amber-50" },
              { name: "Mailchimp", emoji: "📧", bg: "bg-yellow-50" },
              { name: "Notion", emoji: "📝", bg: "bg-zinc-50" },
              { name: "Discord", emoji: "💬", bg: "bg-indigo-50" },
              { name: "Telegram", emoji: "✈️", bg: "bg-blue-50" },
              { name: "WhatsApp", emoji: "📱", bg: "bg-emerald-50" },
              { name: "Instagram", emoji: "📸", bg: "bg-pink-50" },
              { name: "YouTube", emoji: "▶️", bg: "bg-red-50" },
            ].map((app) => (
              <div key={app.name} className={`flex items-center gap-2.5 rounded-2xl border border-zinc-100 ${app.bg} px-5 py-3 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]`}>
                <span className="text-xl">{app.emoji}</span>
                <span className="text-[14px] font-semibold text-zinc-700">{app.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FREE TRIAL BANNER ═══════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 py-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("/images/bg-hero-bokeh.jpg")`, backgroundSize: "cover" }} />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">Teste grátis por 14 dias</p>
              <p className="text-sm text-white/70">Sem cartão de crédito. Cancele quando quiser.</p>
            </div>
          </div>
          <Link
            href="/register"
            className="group flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-[15px] font-bold text-violet-700 shadow-2xl transition-all hover:scale-[1.02]"
          >
            Começar meu trial grátis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="recursos" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-[13px] font-semibold text-violet-600">
              <Layers className="h-3.5 w-3.5" />
              Recursos
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Tudo que você precisa.
              <br />
              <span className="text-zinc-400">Nada que você não precisa.</span>
            </h2>
          </div>

          <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group rounded-3xl border border-zinc-100 bg-white p-8 transition-all duration-300 hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-100">
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} shadow-lg`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="como-funciona" className="bg-zinc-950 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-semibold text-violet-400">
              <Zap className="h-3.5 w-3.5" />
              Como funciona
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              3 passos para começar
              <br />
              <span className="text-zinc-500">a faturar online</span>
            </h2>
          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {howItWorks.map((step, i) => {
              const gifs = ["/images/gif-step1.gif", "/images/gif-step2.gif", "/images/gif-step3.gif"];
              return (
                <div key={step.step} className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
                  {/* GIF */}
                  <div className="mx-auto mb-6 flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl bg-white/[0.04]">
                    <img src={gifs[i]} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 px-3 py-1 text-xs font-extrabold text-white shadow-lg shadow-violet-500/25">
                    Passo {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-3 text-[15px] text-zinc-500">{step.description}</p>
                  {i < howItWorks.length - 1 && (
                    <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block">
                      <ChevronRight className="h-6 w-6 text-zinc-700" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Dashboard preview */}
          <div className="mt-20 overflow-hidden rounded-3xl border border-white/[0.08] shadow-2xl shadow-violet-500/10">
            <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-5 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                <div className="h-3 w-3 rounded-full bg-green-400/60" />
              </div>
              <div className="mx-auto rounded-lg bg-white/[0.05] px-4 py-1">
                <span className="text-[11px] text-zinc-500">linkora.com/dashboard</span>
              </div>
            </div>
            <img src={IMAGES.dashboard} alt="Dashboard Linkora" className="w-full object-cover" style={{ maxHeight: "500px" }} />
          </div>
        </div>
      </section>

      {/* ═══════ CREATORS SHOWCASE (Stan Store style) ═══════ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-[13px] font-semibold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              Criadores em destaque
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Veja quem já está
              <br />
              <span className="text-violet-600">faturando na Linkora</span>
            </h2>
          </div>

          {/* Creator cards — Stan Store style */}
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                name: "Abigail Peugh",
                handle: "@abigailpeugh",
                followers: "100K+ Followers",
                platform: "TikTok",
                tag: "Business Coach",
                tagEmoji: "🔥",
                photo: "/images/creator-abigail.jpg",
                gradient: "from-rose-700 to-rose-900",
                tagBg: "bg-zinc-900 text-white",
                products: [
                  { title: "7 Day Sales Challenge", price: "R$ 37", emoji: "🚀" },
                  { title: "Digital Product Starter Kit", price: "R$ 197", emoji: "📦" },
                ],
              },
              {
                name: "Millie Adrian",
                handle: "@itsmodernmillie",
                followers: "150K+ Followers",
                platform: "Instagram",
                tag: "Social Media Coach",
                tagEmoji: "📱",
                photo: "/images/creator-millie.jpg",
                gradient: "from-violet-700 to-indigo-900",
                tagBg: "bg-violet-100 text-violet-700",
                products: [
                  { title: "100 Day Instagram Roadmap", price: "R$ 97", emoji: "📸" },
                  { title: "Free YouTube Training", price: "Grátis", emoji: "▶️" },
                ],
              },
              {
                name: "Eddie Abbew",
                handle: "@eddieabbew",
                followers: "554K+ Followers",
                platform: "Instagram",
                tag: "Fitness Coach",
                tagEmoji: "💪",
                photo: "/images/creator-eddie.jpg",
                gradient: "from-amber-600 to-orange-900",
                tagBg: "bg-amber-100 text-amber-700",
                products: [
                  { title: "Ultimate Fat Loss Guide", price: "R$ 127", emoji: "📘" },
                  { title: "Muscle Building Guide", price: "R$ 87", emoji: "💪" },
                ],
              },
            ].map((creator) => (
              <div key={creator.name} className="group overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm transition-all hover:shadow-xl">
                {/* Creator photo + info */}
                <div className={`relative h-64 bg-gradient-to-br ${creator.gradient} overflow-hidden`}>
                  <img
                    src={creator.photo}
                    alt={creator.name}
                    className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-60 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-extrabold text-white">{creator.name}</h3>
                    <p className="text-sm text-white/70">{creator.handle}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-white/60">{creator.platform}</span>
                      <span className="text-xs font-semibold text-white">{creator.followers}</span>
                    </div>
                  </div>
                </div>

                {/* Tag */}
                <div className="px-6 pt-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold ${creator.tagBg}`}>
                    {creator.tagEmoji} {creator.tag}
                  </span>
                </div>

                {/* Products preview */}
                <div className="space-y-2 p-6 pt-4">
                  {creator.products.map((product) => (
                    <div key={product.title} className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{product.emoji}</span>
                        <span className="text-[13px] font-semibold text-zinc-800">{product.title}</span>
                      </div>
                      <span className={`rounded-lg px-2 py-0.5 text-[11px] font-bold ${product.price === "Grátis" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>
                        {product.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "95%", label: "fazem a primeira venda em 7 dias" },
              { value: "3x", label: "mais vendas que plataformas tradicionais" },
              { value: "R$2M+", label: "processados pela plataforma" },
              { value: "0%", label: "taxa de plataforma sobre vendas" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5 text-center">
                <p className="text-2xl font-extrabold text-violet-600 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SHOWCASE SPLIT ═══════ */}
      <section className="border-y border-zinc-100 bg-zinc-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Content */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-[13px] font-semibold text-violet-600">
                <ShoppingBag className="h-3.5 w-3.5" />
                Venda qualquer coisa
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Sua loja digital
                <br />
                completa e profissional
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-zinc-500">
                E-books, cursos, templates, presets, planilhas — venda qualquer produto digital com checkout profissional integrado.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Upload de qualquer tipo de arquivo",
                  "Entrega automática após pagamento",
                  "Checkout seguro com Stripe",
                  "Suporte a produtos gratuitos e pagos",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[14px] text-zinc-600">
                    <CheckCircle className="h-4 w-4 shrink-0 text-violet-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="/images/creator-woman-laptop.jpg"
                  alt="Criadora usando Linkora"
                  className="h-80 w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-lg">
                    📘
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">E-book Marketing</p>
                    <p className="text-xs text-zinc-500">Vendido agora</p>
                  </div>
                  <p className="ml-2 text-lg font-extrabold text-emerald-600">+R$49</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-[13px] font-semibold text-amber-600">
              <Star className="h-3.5 w-3.5 fill-amber-500" />
              Depoimentos
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Quem usa, <span className="text-violet-600">ama</span>
            </h2>
            <p className="mt-4 text-lg text-zinc-500">
              Veja o que criadores reais estão dizendo sobre a Linkora.
            </p>
          </div>

          {/* Featured testimonial */}
          <div className="mt-16 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-8 sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mt-6 text-xl font-medium leading-relaxed text-white sm:text-2xl">
                  &ldquo;A Linkora transformou completamente meu negócio digital. Antes eu usava 5 ferramentas diferentes, agora faço tudo em um lugar só. Minhas vendas triplicaram no primeiro mês.&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&auto=format"
                    alt="Ana Clara"
                    className="h-14 w-14 rounded-full border-2 border-white/30 object-cover"
                  />
                  <div>
                    <p className="text-base font-bold text-white">Ana Clara Rodrigues</p>
                    <p className="text-sm text-white/60">Designer Digital · 12.4K seguidores</p>
                  </div>
                </div>
              </div>
              <div className="hidden rounded-2xl bg-white/10 p-6 backdrop-blur-sm lg:block">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-white">347%</p>
                  <p className="mt-1 text-sm text-white/60">aumento em vendas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of testimonials */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Pedro Santos",
                role: "YouTuber · 89K inscritos",
                photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&auto=format",
                text: "Configurei em 10 minutos e já fiz minha primeira venda no mesmo dia. O checkout é muito profissional.",
                metric: "R$ 4.200/mês",
              },
              {
                name: "Juliana Mendes",
                role: "Coach de Carreira",
                photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80&auto=format",
                text: "O dashboard é incrível. Finalmente sei exatamente quanto estou faturando e de onde vêm meus leads.",
                metric: "1.2K leads",
              },
              {
                name: "Rafael Costa",
                role: "Fotógrafo",
                photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80&auto=format",
                text: "Vendo meus presets e e-books sem complicação. A entrega automática é um diferencial enorme.",
                metric: "230 vendas",
              },
              {
                name: "Camila Oliveira",
                role: "Nutricionista · Criadora",
                photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80&auto=format",
                text: "Melhor investimento que fiz. Meus pacientes compram os e-books direto pelo meu link na bio.",
                metric: "R$ 8.500/mês",
              },
              {
                name: "Lucas Ferreira",
                role: "Dev & Educador",
                photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&q=80&auto=format",
                text: "Migrei da Hotmart e não voltei mais. A Linkora é mais rápida, mais bonita e zero taxa de plataforma.",
                metric: "95 alunos",
              },
              {
                name: "Beatriz Lima",
                role: "Influencer · 45K seguidores",
                photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&q=80&auto=format",
                text: "Minha página ficou linda e profissional. Meus seguidores adoram e a conversão aumentou muito.",
                metric: "3.4K cliques/mês",
              },
            ].map((t) => (
              <div key={t.name} className="group rounded-3xl border border-zinc-100 bg-white p-7 shadow-sm transition-all hover:shadow-lg hover:shadow-zinc-100">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-zinc-600">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.photo}
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-zinc-900">{t.name}</p>
                      <p className="text-[11px] text-zinc-500">{t.role}</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-600">
                    {t.metric}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ZERO FEES BANNER ═══════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3e%3cfilter id='n'%3e%3cfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3e%3c/filter%3e%3crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3e%3c/svg%3e")` }} />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
            <div className="flex-1">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-[13px] font-bold text-white backdrop-blur-sm">
                💰 Notícia importante
              </div>
              <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
                0% de taxa da plataforma.
                <br />
                <span className="text-emerald-200">Sempre.</span>
              </h2>
              <p className="mt-4 max-w-lg text-lg text-white/70">
                Diferente de outras plataformas, a Linkora não cobra comissão sobre suas vendas. Você fica com 100% do lucro. A única taxa é a do processador de pagamento (Stripe).
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              {[
                { platform: "Hotmart", fee: "até 20%", bad: true },
                { platform: "Eduzz", fee: "até 15%", bad: true },
                { platform: "Linkora", fee: "0%", bad: false },
              ].map((item) => (
                <div
                  key={item.platform}
                  className={`rounded-2xl px-6 py-5 text-center ${
                    item.bad
                      ? "bg-white/10 backdrop-blur-sm"
                      : "bg-white shadow-xl"
                  }`}
                >
                  <p className={`text-sm font-bold ${item.bad ? "text-white/80" : "text-zinc-900"}`}>
                    {item.platform}
                  </p>
                  <p className={`mt-1 text-3xl font-extrabold ${
                    item.bad ? "text-red-300 line-through decoration-2" : "text-emerald-600"
                  }`}>
                    {item.fee}
                  </p>
                  {!item.bad && (
                    <p className="mt-1 text-xs font-semibold text-emerald-600">taxa plataforma</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ NOT JUST ANOTHER LINK IN BIO ═══════ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-[13px] font-semibold text-violet-600">
              🚀 Mais que um link na bio
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Não é só mais um
              <br />
              <span className="text-violet-600">link na bio</span>
            </h2>
            <p className="mt-4 text-lg text-zinc-500">
              A Linkora é uma plataforma completa para você vender, capturar leads e crescer — tudo em um só lugar.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                emoji: "⚡",
                title: "Sem código necessário",
                description: "Configure sua loja em minutos. Sem precisar saber programar, sem complicação. É só arrastar e soltar.",
                gradient: "from-amber-500 to-orange-600",
              },
              {
                emoji: "🛒",
                title: "Checkout em 1 clique",
                description: "Seu visitante não precisa criar conta. Pagamento rápido e seguro via Stripe com conversão máxima.",
                gradient: "from-violet-500 to-indigo-600",
              },
              {
                emoji: "🔗",
                title: "Integrações poderosas",
                description: "Conecte com suas ferramentas favoritas: email marketing, analytics, webhooks e muito mais.",
                gradient: "from-blue-500 to-cyan-600",
              },
              {
                emoji: "📱",
                title: "100% responsivo",
                description: "Sua página fica perfeita em qualquer dispositivo. Desktop, tablet ou celular — sempre impecável.",
                gradient: "from-pink-500 to-rose-600",
              },
              {
                emoji: "🎨",
                title: "Personalização total",
                description: "Cores, temas, avatar, bio. Sua marca, sua identidade. Faça sua página refletir quem você é.",
                gradient: "from-emerald-500 to-teal-600",
              },
              {
                emoji: "📊",
                title: "Analytics completo",
                description: "Saiba exatamente quem visita, quem compra e quanto você fatura. Dados em tempo real.",
                gradient: "from-purple-500 to-fuchsia-600",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-3xl border border-zinc-100 bg-white p-8 transition-all duration-300 hover:shadow-xl"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-[0.06] group-hover:opacity-[0.1] transition-opacity" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
                <span className="text-3xl">{item.emoji}</span>
                <h3 className="mt-4 text-lg font-bold text-zinc-900">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-zinc-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ COMPARISON TABLE ═══════ */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-violet-50" />
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-200/30 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-[13px] font-semibold text-violet-700">
              <Shield className="h-3.5 w-3.5" />
              Comparativo
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Por que escolher a{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Linkora?</span>
            </h2>
            <p className="mt-4 text-lg text-zinc-500">
              Veja como nos comparamos com as principais plataformas do mercado.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-3xl border-2 border-violet-200 bg-white shadow-xl shadow-violet-100/50">
            {/* Header */}
            <div className="grid grid-cols-4 border-b-2 border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50">
              <div className="px-8 py-6">
                <p className="text-[15px] font-extrabold text-zinc-900">Recurso</p>
              </div>
              <div className="flex flex-col items-center justify-center px-4 py-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
                  <span className="text-lg">🌳</span>
                </div>
                <p className="mt-2 text-[13px] font-bold text-zinc-400">Linktree</p>
              </div>
              <div className="flex flex-col items-center justify-center px-4 py-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <span className="text-lg">🏪</span>
                </div>
                <p className="mt-2 text-[13px] font-bold text-zinc-400">Stan Store</p>
              </div>
              <div className="flex flex-col items-center justify-center px-4 py-6 bg-gradient-to-b from-violet-100/50 to-transparent">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <p className="mt-2 text-[13px] font-extrabold text-violet-700">Linkora</p>
              </div>
            </div>

            {/* Rows */}
            {[
              { feature: "Link na bio personalizado", linktree: true, stan: true, linkora: true },
              { feature: "Venda de produtos digitais", linktree: false, stan: true, linkora: true },
              { feature: "Checkout integrado (Stripe)", linktree: false, stan: true, linkora: true },
              { feature: "Captura de leads", linktree: false, stan: false, linkora: true },
              { feature: "0% taxa de plataforma", linktree: true, stan: false, linkora: true },
              { feature: "Analytics em tempo real", linktree: false, stan: true, linkora: true },
              { feature: "Personalização total de cores", linktree: false, stan: false, linkora: true },
              { feature: "Plano gratuito generoso", linktree: true, stan: false, linkora: true },
              { feature: "Entrega automática de arquivos", linktree: false, stan: true, linkora: true },
              { feature: "Upload de produtos ilimitado", linktree: false, stan: false, linkora: true },
            ].map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 transition-colors hover:bg-violet-50/50 ${
                  i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"
                } ${i < 9 ? "border-b border-zinc-100" : ""}`}
              >
                <div className="flex items-center px-8 py-5">
                  <p className="text-[14px] font-semibold text-zinc-700">{row.feature}</p>
                </div>
                <div className="flex items-center justify-center px-4 py-5">
                  {row.linktree ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100">
                      <CheckCircle className="h-4 w-4 text-zinc-400" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50">
                      <X className="h-3.5 w-3.5 text-red-300" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center px-4 py-5">
                  {row.stan ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100">
                      <CheckCircle className="h-4 w-4 text-zinc-400" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50">
                      <X className="h-3.5 w-3.5 text-red-300" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center px-4 py-5 bg-violet-50/30">
                  {row.linkora ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/20">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50">
                      <X className="h-3.5 w-3.5 text-red-300" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Bottom CTA row */}
            <div className="grid grid-cols-4 border-t-2 border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50">
              <div className="col-span-3 flex items-center px-8 py-5">
                <p className="text-[15px] font-bold text-zinc-900">
                  A escolha é óbvia. <span className="text-violet-600">Comece grátis agora.</span>
                </p>
              </div>
              <div className="flex items-center justify-center px-4 py-5">
                <Link
                  href="/register"
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl"
                >
                  Começar
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {[
              { emoji: "🔒", text: "Dados seguros" },
              { emoji: "⚡", text: "Setup em 2 min" },
              { emoji: "💳", text: "Sem cartão" },
              { emoji: "🚫", text: "Sem taxa" },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-[13px] font-medium text-zinc-600 shadow-sm">
                <span>{badge.emoji}</span>
                {badge.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section id="precos" className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 via-white to-zinc-50" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-[13px] font-semibold text-violet-700">
              <CreditCard className="h-3.5 w-3.5" />
              Preços transparentes
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Comece grátis,
              <br />
              <span className="text-zinc-400">escale quando quiser</span>
            </h2>
            <p className="mt-4 text-lg text-zinc-500">
              Sem surpresas, sem taxas escondidas. Escolha o plano ideal para você.
            </p>
          </div>

          <div className="mt-16 grid items-center gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl transition-all ${
                  plan.highlighted
                    ? "border-2 border-violet-400 bg-gradient-to-b from-violet-600 via-indigo-600 to-violet-700 p-[1px] shadow-2xl shadow-violet-500/30 scale-[1.05] z-10"
                    : "border border-zinc-200 bg-white p-8 hover:shadow-xl hover:shadow-zinc-200/50"
                }`}
              >
                {plan.highlighted ? (
                  <>
                    {/* Highlighted card inner */}
                    <div className="flex flex-1 flex-col rounded-[22px] bg-white p-8">
                      {/* Badge */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-[12px] font-bold text-white shadow-xl shadow-violet-500/30">
                          <Star className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                          {(plan as any).badge}
                        </span>
                      </div>

                      {/* Ribbon */}
                      <div className="mb-6 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 px-4 py-3 text-center">
                        <p className="text-[12px] font-bold text-violet-600">🔥 Economize R$348/ano vs pagar ferramentas separadas</p>
                      </div>

                      <div>
                        <h3 className="text-xl font-extrabold text-zinc-900">{plan.name}</h3>
                        <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
                      </div>
                      <div className="mt-5 flex items-baseline gap-1">
                        <span className="text-sm text-zinc-400">R$</span>
                        <span className="text-6xl font-extrabold tracking-tight text-zinc-900">{plan.price}</span>
                        <span className="text-sm text-zinc-400">{plan.period}</span>
                      </div>
                      <p className="mt-1 text-[12px] text-zinc-400">cobrado mensalmente</p>

                      <Link
                        href="/register"
                        className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-[15px] font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                      >
                        {plan.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <p className="mt-3 text-center text-[11px] text-zinc-400">14 dias grátis · Cancele quando quiser</p>

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
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900">{plan.name}</h3>
                      <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
                    </div>
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-sm text-zinc-400">R$</span>
                      <span className="text-5xl font-extrabold tracking-tight text-zinc-900">{plan.price}</span>
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

                    <Link
                      href="/register"
                      className="mt-8 flex items-center justify-center rounded-2xl border-2 border-zinc-200 px-6 py-3.5 text-[14px] font-bold text-zinc-700 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                    >
                      {plan.cta}
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[13px] text-zinc-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Pagamento seguro via Stripe</span>
            </div>
            <div className="h-4 w-px bg-zinc-200" />
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-violet-500" />
              <span>0% taxa de plataforma</span>
            </div>
            <div className="h-4 w-px bg-zinc-200" />
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section id="faq" className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Perguntas frequentes
            </h2>
          </div>

          <Accordion className="mt-12">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} className="border-b border-zinc-200 py-1">
                <AccordionTrigger className="text-left text-[15px] font-semibold text-zinc-800 hover:text-zinc-900">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[14px] leading-relaxed text-zinc-500">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 py-24 sm:py-32">
        {/* Confetti GIF overlay */}
        <img
          src="/images/gif-confetti.gif"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen"
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.08] blur-[100px]" />
          <div className="relative">
            {/* Rocket GIF */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
              <img src="/images/gif-rocket.gif" alt="" className="h-14 w-14 object-contain" />
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              Pronto para transformar
              <br />
              sua audiência em receita?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
              Junte-se a milhares de criadores que já monetizam com a Linkora. Comece grátis, sem cartão de crédito.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register" className="group inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-4 text-[16px] font-bold text-violet-700 shadow-2xl transition-all hover:scale-[1.02]">
                Criar minha conta grátis
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="mt-6 text-[13px] text-white/40">
              Setup em 2 minutos · Sem cartão · Sem compromisso
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-zinc-100 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold">Linkora</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                A plataforma all-in-one para criadores venderem produtos digitais e monetizarem sua audiência.
              </p>
            </div>
            {[
              { title: "Produto", links: ["Recursos", "Preços", "Changelog", "Roadmap"] },
              { title: "Empresa", links: ["Sobre", "Blog", "Carreiras", "Contato"] },
              { title: "Legal", links: ["Termos", "Privacidade", "Cookies", "LGPD"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">{col.title}</h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-zinc-200 pt-8 sm:flex-row">
            <div>
              <p className="text-sm font-medium text-zinc-700">&copy; {new Date().getFullYear()} Linkora. Todos os direitos reservados.</p>
              <p className="mt-1.5 text-[13px] text-zinc-600">Azecom Internet LTDA — CNPJ: 15.209.484/0001-50</p>
              <p className="mt-0.5 text-[13px] text-zinc-600">Suporte: <a href="mailto:Support@liinkoraa.com" className="text-violet-600 hover:underline">Support@liinkoraa.com</a></p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-4 text-[13px] text-zinc-600">
                <Link href="/termos" className="hover:text-violet-600 hover:underline">Termos de Uso</Link>
                <Link href="/privacidade" className="hover:text-violet-600 hover:underline">Privacidade</Link>
                <Link href="/cookies" className="hover:text-violet-600 hover:underline">Cookies</Link>
              </div>
              <p className="text-[13px] text-zinc-500">Feito com <span className="text-red-500">♥</span> no Brasil</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
