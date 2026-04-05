"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Lock, CheckCircle, ShieldCheck } from "lucide-react";

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

import { resetPassword } from "@/actions/auth";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await resetPassword(formData);
      if (result?.error) {
        setError(result.error);
      }
      if (result?.success) {
        setSuccess(result.success);
      }
    });
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/80 shadow-2xl shadow-violet-500/5 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-white">
          Nova senha
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Defina sua nova senha abaixo
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-center text-sm text-green-400">{success}</p>
            <Link
              href="/login"
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Ir para o login
            </Link>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">
                Nova senha
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

            <div className="space-y-2">
              <Label htmlFor="confirm_password" className="text-zinc-300">
                Confirmar senha
              </Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  placeholder="Repita a nova senha"
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
                <Lock className="mr-2 h-4 w-4" />
              )}
              {isPending ? "Atualizando..." : "Atualizar senha"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
