import { Sparkles } from "lucide-react";

interface StoreFooterProps {
  themeColor: string;
}

export function StoreFooter({ themeColor }: StoreFooterProps) {
  return (
    <footer className="mt-16 flex flex-col items-center gap-4 pt-8">
      <div className="h-px w-16 bg-white/[0.06]" />
      <a
        href="/"
        className="group flex items-center gap-1.5 rounded-full border border-white/[0.04] bg-white/[0.02] px-4 py-2 text-[11px] font-medium text-zinc-600 transition-all hover:border-white/[0.08] hover:text-zinc-400"
      >
        <Sparkles className="h-3 w-3" style={{ color: themeColor }} />
        Feito com Linkora
      </a>
    </footer>
  );
}
