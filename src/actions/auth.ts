"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message === "Invalid login credentials") {
      return { error: "Email ou senha incorretos." };
    }
    if (error.message === "Email not confirmed") {
      return { error: "Confirme seu email antes de entrar. Verifique sua caixa de entrada." };
    }
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function register(formData: FormData) {
  const displayName = formData.get("display_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!displayName || !email || !password) {
    return { error: "Todos os campos são obrigatórios." };
  }

  if (password.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Este email já está cadastrado. Tente fazer login." };
    }
    return { error: error.message };
  }

  if (data.user && !data.user.identities?.length) {
    return { error: "Este email já está cadastrado. Tente fazer login." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Informe seu email." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: "Erro ao enviar email. Tente novamente." };
  }

  return { success: "Email enviado! Verifique sua caixa de entrada para redefinir sua senha." };
}

export async function resetPassword(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (!password || !confirmPassword) {
    return { error: "Preencha todos os campos." };
  }

  if (password.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres." };
  }

  if (password !== confirmPassword) {
    return { error: "As senhas não coincidem." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Erro ao atualizar senha. O link pode ter expirado. Solicite um novo." };
  }

  return { success: "Senha atualizada com sucesso!" };
}
