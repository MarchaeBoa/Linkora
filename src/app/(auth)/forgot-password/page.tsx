"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";

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

import { forgotPassword } from "@/actions/auth";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await forgotPassword(formData);
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
          Recuperar senha
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Informe seu email e enviaremos um link para redefinir sua senha
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
              className="mt-2 flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        ) : (
          <>
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

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-violet-600 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                {isPending ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-400">
              Lembrou sua senha?{" "}
              <Link
                href="/login"
                className="font-medium text-violet-400 underline-offset-4 hover:text-violet-300 hover:underline"
              >
                Fazer login
              </Link>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
