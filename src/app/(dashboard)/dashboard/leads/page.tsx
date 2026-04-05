import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Lead } from "@/types";
import { Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function LeadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: leads, count } = await supabase
    .from("leads")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const items = (leads ?? []) as Lead[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-sm text-zinc-400">
            People who subscribed to your page.
          </p>
        </div>
        <Badge
          variant="secondary"
          className="bg-violet-500/15 text-violet-400"
        >
          {count ?? 0} total
        </Badge>
      </div>

      {items.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-zinc-800 p-4">
              <Users className="h-8 w-8 text-zinc-500" />
            </div>
            <h3 className="mb-1 text-lg font-medium text-white">
              No leads yet
            </h3>
            <p className="text-sm text-zinc-400">
              Leads will appear here when visitors subscribe on your public page.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white">All Leads</CardTitle>
            <CardDescription className="text-zinc-400">
              A list of all subscribers from your public page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Name</TableHead>
                  <TableHead className="text-zinc-400">Email</TableHead>
                  <TableHead className="text-right text-zinc-400">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className="border-zinc-800 hover:bg-zinc-800/50"
                  >
                    <TableCell className="font-medium text-white">
                      {lead.name ?? "---"}
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {lead.email}
                    </TableCell>
                    <TableCell className="text-right text-zinc-400">
                      {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
