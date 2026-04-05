"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { LogIn, Loader2, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { login } from "@/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/80 shadow-2xl shadow-violet-500/5 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-white">
          Bem-vindo de volta
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Entre na sua conta para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="border-zinc-700 bg-zinc-800/50 pl-10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-zinc-300">
                Senha
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-violet-400 hover:text-violet-300"
              >
                Esqueci minha senha
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Sua senha"
                required
                autoComplete="current-password"
                minLength={6}
                className="border-zinc-700 bg-zinc-800/50 pl-10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-violet-600 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="font-medium text-violet-400 underline-offset-4 hover:text-violet-300 hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
