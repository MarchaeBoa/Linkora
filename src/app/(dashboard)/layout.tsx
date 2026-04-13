import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription, type Profile } from "@/types";
import { DashboardShell } from "./dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!hasActiveSubscription(profile as Profile | null)) {
    redirect("/pricing");
  }

  return (
    <DashboardShell profile={profile as Profile} email={user.email ?? ""}>
      {children}
    </DashboardShell>
  );
}
