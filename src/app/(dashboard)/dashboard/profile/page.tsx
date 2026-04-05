"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, checkUsername } from "@/actions/profile";
import type { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  UserCircle,
  ExternalLink,
  Check,
  X,
  Loader2,
  Globe,
  Palette,
  AtSign,
  Camera,
} from "lucide-react";

const THEME_COLORS = [
  { value: "#8B5CF6", name: "Violeta" },
  { value: "#EC4899", name: "Rosa" },
  { value: "#F59E0B", name: "Âmbar" },
  { value: "#10B981", name: "Esmeralda" },
  { value: "#3B82F6", name: "Azul" },
  { value: "#EF4444", name: "Vermelho" },
  { value: "#06B6D4", name: "Ciano" },
  { value: "#F97316", name: "Laranja" },
  { value: "#84CC16", name: "Lima" },
  { value: "#A855F7", name: "Púrpura" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [originalUsername, setOriginalUsername] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("#8B5CF6");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data as Profile);
        setOriginalUsername(data.username || "");
        setSelectedColor(data.theme_color || "#8B5CF6");
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleUsernameCheck(username: string) {
    if (!username || username === originalUsername) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    const available = await checkUsername(username);
    setUsernameStatus(available ? "available" : "taken");
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Perfil atualizado com sucesso!");
      }
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Editar perfil</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Personalize sua página pública e informações pessoais.
          </p>
        </div>
        {profile?.username && (
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[13px] font-medium text-zinc-300 transition-all hover:bg-white/[0.05]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Visualizar página
          </a>
        )}
      </div>

      <form action={handleSubmit} className="space-y-6">
        {/* Avatar + Basic Info */}
        <Card className="overflow-hidden border-white/[0.06] bg-white/[0.02]">
          <div className="h-24 bg-gradient-to-r from-violet-600/20 to-purple-600/20" />
          <CardContent className="-mt-12 space-y-6 pt-0">
            {/* Avatar */}
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="h-20 w-20 overflow-hidden rounded-2xl border-4 border-[#09090b] bg-zinc-900">
                  {avatarPreview || profile?.avatar_url ? (
                    <img
                      src={avatarPreview || profile?.avatar_url || ""}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserCircle className="h-10 w-10 text-zinc-600" />
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-violet-600 text-white shadow-lg transition-colors hover:bg-violet-700">
                  <Camera className="h-3.5 w-3.5" />
                  <input
                    name="avatar"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="pb-1">
                <p className="text-sm font-medium text-white">
                  Foto de perfil
                </p>
                <p className="text-xs text-zinc-500">
                  JPG, PNG ou GIF. Máximo 2MB.
                </p>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-zinc-300">
                <AtSign className="mr-1.5 inline h-3.5 w-3.5" />
                Username
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  defaultValue={profile?.username ?? ""}
                  placeholder="seunome"
                  className="border-white/[0.06] bg-white/[0.03] pr-10 text-white placeholder:text-zinc-600"
                  onChange={(e) => {
                    const val = e.target.value;
                    const timer = setTimeout(
                      () => handleUsernameCheck(val),
                      500,
                    );
                    return () => clearTimeout(timer);
                  }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameStatus === "checking" && (
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                  )}
                  {usernameStatus === "available" && (
                    <Check className="h-4 w-4 text-emerald-400" />
                  )}
                  {usernameStatus === "taken" && (
                    <X className="h-4 w-4 text-red-400" />
                  )}
                </div>
              </div>
              <p className="flex items-center gap-1 text-xs text-zinc-600">
                <Globe className="h-3 w-3" />
                linkora.com/{profile?.username || "seunome"}
              </p>
              {usernameStatus === "taken" && (
                <p className="text-xs text-red-400">
                  Este username já está em uso.
                </p>
              )}
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="display_name" className="text-zinc-300">
                Nome de exibição
              </Label>
              <Input
                id="display_name"
                name="display_name"
                defaultValue={profile?.display_name ?? ""}
                placeholder="Seu nome completo"
                className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-zinc-600"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-zinc-300">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile?.bio ?? ""}
                placeholder="Conte para sua audiência quem você é..."
                rows={3}
                className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-zinc-600 resize-none"
              />
              <p className="text-xs text-zinc-600">
                Aparece abaixo do seu nome na página pública.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Theme Color */}
        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[15px] text-white">
              <Palette className="h-4 w-4 text-violet-400" />
              Cor do tema
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Define a cor de destaque da sua página pública.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {THEME_COLORS.map((color) => (
                <label key={color.value} className="group cursor-pointer">
                  <input
                    type="radio"
                    name="theme_color"
                    value={color.value}
                    checked={selectedColor === color.value}
                    onChange={() => setSelectedColor(color.value)}
                    className="peer sr-only"
                  />
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl ring-2 ring-transparent ring-offset-2 ring-offset-[#09090b] transition-all peer-checked:ring-white peer-checked:scale-110"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {selectedColor === color.value && (
                      <Check className="h-4 w-4 text-white drop-shadow" />
                    )}
                  </div>
                </label>
              ))}
            </div>

            {/* Color preview */}
            <div
              className="mt-4 rounded-xl p-4 transition-colors"
              style={{ backgroundColor: `${selectedColor}15`, borderColor: `${selectedColor}30`, border: "1px solid" }}
            >
              <p className="text-xs text-zinc-400">
                Preview: seus botões e destaques ficarão com a cor{" "}
                <span className="font-semibold" style={{ color: selectedColor }}>
                  {THEME_COLORS.find((c) => c.value === selectedColor)?.name}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[15px] text-white">
              <Globe className="h-4 w-4 text-violet-400" />
              Redes sociais
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Links exibidos na sua página pública.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/usuario" },
              { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@canal" },
              { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@usuario" },
              { key: "twitter", label: "X (Twitter)", placeholder: "https://x.com/usuario" },
            ].map((platform) => (
              <div key={platform.key} className="space-y-1.5">
                <Label htmlFor={platform.key} className="text-[13px] text-zinc-400">
                  {platform.label}
                </Label>
                <Input
                  id={platform.key}
                  name={`social_${platform.key}`}
                  defaultValue={profile?.social_links?.[platform.key] ?? ""}
                  placeholder={platform.placeholder}
                  className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-zinc-700"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-[13px] text-zinc-500">
            As alterações serão visíveis na sua página pública imediatamente.
          </p>
          <Button
            type="submit"
            disabled={isPending || usernameStatus === "taken"}
            className="bg-violet-600 px-6 font-semibold text-white hover:bg-violet-700"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar alterações"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
