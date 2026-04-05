import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function ProfileNotFound() {
  return (
    <div className="flex min-h-screen">
      {/* Left — Image */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80&auto=format"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-transparent to-transparent" />
      </div>

      {/* Right — Content */}
      <div className="flex w-full flex-col items-center justify-center bg-[#09090b] px-6 lg:w-1/2">
        <div className="mx-auto max-w-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.06]">
            <Sparkles className="h-7 w-7 text-zinc-600" />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-white">
            Perfil não encontrado
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-zinc-500">
            Este perfil não existe ou foi removido. Verifique o endereço e tente novamente.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao início
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.06]"
            >
              Criar minha página grátis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
