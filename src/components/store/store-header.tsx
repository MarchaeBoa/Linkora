import type { Profile } from "@/types";
import { Globe, AtSign, ExternalLink } from "lucide-react";

const SOCIAL_CONFIG: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; label: string }
> = {
  instagram: { icon: Globe, label: "Instagram" },
  youtube: { icon: Globe, label: "YouTube" },
  tiktok: { icon: ExternalLink, label: "TikTok" },
  twitter: { icon: AtSign, label: "X" },
};

export function StoreHeader({ profile }: { profile: Profile }) {
  const color = profile.theme_color || "#8B5CF6";

  const initials = profile.display_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const socials = profile.social_links
    ? Object.entries(profile.social_links).filter(([, url]) => url)
    : [];

  return (
    <div className="flex flex-col items-center text-center">
      {/* Avatar */}
      <div
        className="rounded-full p-[3px]"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}80)`,
        }}
      >
        <div className="h-24 w-24 overflow-hidden rounded-full bg-[#09090b] p-[3px] sm:h-28 sm:w-28">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white/[0.04]">
              <span className="text-2xl font-bold text-zinc-400 sm:text-3xl">
                {initials || "?"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {profile.display_name}
      </h1>

      {/* Username */}
      {profile.username && (
        <p className="mt-1 text-sm text-zinc-600">@{profile.username}</p>
      )}

      {/* Bio */}
      {profile.bio && (
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-400">
          {profile.bio}
        </p>
      )}

      {/* Social Icons */}
      {socials.length > 0 && (
        <div className="mt-5 flex items-center gap-1">
          {socials.map(([platform, url]) => {
            const config = SOCIAL_CONFIG[platform];
            if (!config) return null;
            const Icon = config.icon;
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={config.label}
                className="group rounded-xl p-2.5 transition-all hover:bg-white/[0.06]"
              >
                <Icon
                  className="h-[18px] w-[18px] text-zinc-500 transition-colors group-hover:text-white"
                />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
