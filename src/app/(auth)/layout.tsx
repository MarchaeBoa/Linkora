import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark flex min-h-screen">
      {/* Left side — Image + branding */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 lg:block">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&auto=format"
          alt=""
          className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-20"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/80 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Linkora</span>
          </Link>

          <div className="max-w-md">
            <blockquote className="border-l-2 border-white/30 pl-6">
              <p className="text-xl font-medium leading-relaxed text-white/90">
                &ldquo;Em 10 minutos configurei minha página e já fiz minha primeira venda. A Linkora mudou meu negócio.&rdquo;
              </p>
              <footer className="mt-4 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&auto=format"
                  alt="Ana Clara"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20"
                />
                <div>
                  <p className="text-sm font-semibold text-white">Ana Clara</p>
                  <p className="text-xs text-white/60">Designer Digital · 2.3K seguidores</p>
                </div>
              </footer>
            </blockquote>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div>
                <p className="text-2xl font-extrabold text-white">10K+</p>
                <p className="text-xs text-white/50">Criadores</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">R$2M+</p>
                <p className="text-xs text-white/50">Processados</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">4.9/5</p>
                <p className="text-xs text-white/50">Avaliação</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side — Form */}
      <div className="relative flex w-full flex-col items-center justify-center bg-zinc-950 px-6 py-12 lg:w-1/2">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "url('/images/bg-bokeh.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Mobile logo */}
        <div className="relative z-10 mb-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Linkora</span>
          </Link>
        </div>

        <div className="relative z-10 w-full max-w-md">{children}</div>

        <p className="relative z-10 mt-8 text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} Linkora. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
