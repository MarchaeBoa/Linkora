import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Profile, Product, Link as LinkType } from "@/types";
import { StoreHeader } from "@/components/store/store-header";
import { StoreLinks } from "@/components/store/store-links";
import { StoreProducts } from "@/components/store/store-products";
import { LeadCapture } from "@/components/store/lead-capture";
import { StoreFooter } from "@/components/store/store-footer";
import { Sparkles } from "lucide-react";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, bio, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) {
    return {
      title: "Perfil não encontrado | Linkora",
      description: "Este perfil não existe ou foi removido.",
    };
  }

  return {
    title: `${profile.display_name} | Linkora`,
    description: profile.bio || `Confira a página de ${profile.display_name} na Linkora`,
    openGraph: {
      title: `${profile.display_name} | Linkora`,
      description: profile.bio || `Confira a página de ${profile.display_name}`,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${profile.display_name} | Linkora`,
      description: profile.bio || `Confira a página de ${profile.display_name}`,
    },
  };
}

export default async function StorePage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const typedProfile = profile as Profile;
  const color = typedProfile.theme_color || "#8B5CF6";

  const [{ data: products }, { data: links }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("user_id", typedProfile.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("links")
      .select("*")
      .eq("user_id", typedProfile.id)
      .eq("is_active", true)
      .order("position", { ascending: true }),
  ]);

  const typedLinks = (links ?? []) as LinkType[];
  const typedProducts = (products ?? []) as Product[];
  const hasContent = typedLinks.length > 0 || typedProducts.length > 0;

  return (
    <div className="dark relative min-h-screen bg-[#09090b] text-white">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <img
          src="/images/bg-bokeh.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.08]"
        />
        <div
          className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full opacity-[0.07] blur-[120px]"
          style={{ backgroundColor: color }}
        />
        <div
          className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full opacity-[0.04] blur-[100px]"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-xl px-5 pb-20 pt-12 sm:pt-16">
        <StoreHeader profile={typedProfile} />

        <div className="mt-10 space-y-10">
          {/* Links */}
          {typedLinks.length > 0 && (
            <StoreLinks links={typedLinks} themeColor={color} />
          )}

          {/* Lead Capture */}
          <LeadCapture userId={typedProfile.id} themeColor={color} />

          {/* Products */}
          {typedProducts.length > 0 && (
            <StoreProducts products={typedProducts} themeColor={color} />
          )}

          {/* Empty state */}
          {!hasContent && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
              <Sparkles className="h-8 w-8 text-zinc-700" />
              <p className="text-sm text-zinc-500">
                Esta página ainda está sendo construída.
              </p>
              <p className="text-xs text-zinc-600">Volte em breve!</p>
            </div>
          )}
        </div>

        <StoreFooter themeColor={color} />
      </div>
    </div>
  );
}
