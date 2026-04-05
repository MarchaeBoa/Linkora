import type { Link } from "@/types";
import { ExternalLink } from "lucide-react";

interface StoreLinksProps {
  links: Link[];
  themeColor: string;
}

export function StoreLinks({ links, themeColor }: StoreLinksProps) {
  return (
    <div className="space-y-3">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-4 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.05] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] active:scale-[0.99]"
        >
          {/* Hover glow effect */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
            style={{
              background: `linear-gradient(90deg, ${themeColor}08 0%, transparent 50%)`,
            }}
          />

          <div className="relative flex items-center gap-3">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: themeColor }}
            />
            <span className="text-[15px] font-medium text-white">
              {link.title}
            </span>
          </div>

          <ExternalLink className="relative h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-400" />
        </a>
      ))}
    </div>
  );
}
