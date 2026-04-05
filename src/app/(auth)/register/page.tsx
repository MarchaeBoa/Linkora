"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { UserPlus, Loader2, Mail, Lock, User } from "lucide-react";

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

import { register } from "@/actions/auth";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await register(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/80 shadow-2xl shadow-violet-500/5 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-white">
          Crie sua conta
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Comece a usar a Linkora gratuitamente
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
            <Label htmlFor="display_name" className="text-zinc-300">
              Nome completo
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="display_name"
                name="display_name"
                type="text"
                placeholder="Seu nome completo"
                required
                autoComplete="name"
                className="border-zinc-700 bg-zinc-800/50 pl-10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
              />
            </div>
          </div>

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
            <Label htmlFor="password" className="text-zinc-300">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                autoComplete="new-password"
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
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            {isPending ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Ao criar sua conta, você concorda com nossos{" "}
          <a href="#" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
            Política de Privacidade
          </a>
          .
        </p>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-medium text-violet-400 underline-offset-4 hover:text-violet-300 hover:underline"
          >
            Fazer login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
