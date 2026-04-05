"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Link2,
  Users,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/auth";
import type { Profile } from "@/types";

const navItems = [
  { label: "Visão geral", href: "/dashboard", icon: LayoutDashboard },
  { label: "Produtos", href: "/dashboard/products", icon: Package },
  { label: "Links", href: "/dashboard/links", icon: Link2 },
  { label: "Leads", href: "/dashboard/leads", icon: Users },
  { label: "Perfil", href: "/dashboard/profile", icon: UserCircle },
  { label: "Configurações", href: "/dashboard/settings", icon: Settings },
];

function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all ${
        isActive
          ? "bg-violet-500/15 text-violet-400 shadow-sm"
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
      }`}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-white">Linkora</span>
      </div>

      <div className="mx-4 h-px bg-white/[0.06]" />

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href)
            }
            onClick={onNavigate}
          />
        ))}
      </nav>

      <div className="mx-4 h-px bg-white/[0.06]" />

      <div className="px-3 py-4">
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>
    </div>
  );
}

export function DashboardShell({
  profile,
  email,
  children,
}: {
  profile: Profile | null;
  email: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials =
    profile?.display_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? email[0]?.toUpperCase() ?? "U";

  return (
    <div className="dark relative flex h-screen bg-[#09090b]">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: "url('/images/bg-bokeh.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Desktop Sidebar */}
      <aside className="relative z-10 hidden w-[260px] flex-shrink-0 border-r border-white/[0.06] bg-[#0c0c0f]/95 backdrop-blur-sm lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-[260px] border-r border-white/[0.06] bg-[#0c0c0f]">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-5 rounded-lg p-1 text-zinc-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0c0c0f]/80 px-4 backdrop-blur-xl lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-white/[0.04] hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-semibold text-white">Linkora</span>
            </div>
          </div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/[0.04]">
                <Avatar className="h-7 w-7 border border-white/[0.08]">
                  <AvatarImage src={profile?.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-[10px] font-bold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-[13px] font-medium text-zinc-300 sm:inline">
                  {profile?.display_name ?? email}
                </span>
                <ChevronDown className="h-3 w-3 text-zinc-500" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 border-white/[0.06] bg-[#0c0c0f]"
            >
              <div className="px-3 py-2">
                <p className="text-[13px] font-medium text-white">
                  {profile?.display_name ?? "Usuário"}
                </p>
                <p className="text-[11px] text-zinc-500">{email}</p>
              </div>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem>
                <Link
                  href="/dashboard/profile"
                  className="flex w-full items-center gap-2 text-[13px] text-zinc-300"
                >
                  <UserCircle className="h-4 w-4" />
                  Meu perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/dashboard/settings"
                  className="flex w-full items-center gap-2 text-[13px] text-zinc-300"
                >
                  <Settings className="h-4 w-4" />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem>
                <form action={logout} className="w-full">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 text-[13px] text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair da conta
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#09090b] p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
