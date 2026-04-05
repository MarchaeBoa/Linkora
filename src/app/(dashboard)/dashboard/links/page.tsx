"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
} from "@/actions/links";
import type { Link as LinkType } from "@/types";
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
import { toast } from "sonner";
import {
  Link2,
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  Loader2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function LinksPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);

  async function loadLinks() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true });

    setLinks((data ?? []) as LinkType[]);
    setLoading(false);
  }

  useEffect(() => {
    loadLinks();
  }, []);

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createLink(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Link added!");
        setShowAdd(false);
        loadLinks();
      }
    });
  }

  function handleToggle(link: LinkType) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", link.id);
      fd.set("title", link.title);
      fd.set("url", link.url);
      fd.set("is_active", String(!link.is_active));
      const result = await updateLink(fd);
      if (result?.error) {
        toast.error(result.error);
      } else {
        loadLinks();
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteLink(id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Link removed.");
        loadLinks();
      }
    });
  }

  function handleMove(index: number, direction: "up" | "down") {
    const newLinks = [...links];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newLinks.length) return;

    [newLinks[index], newLinks[swapIndex]] = [
      newLinks[swapIndex],
      newLinks[index],
    ];

    const reordered = newLinks.map((l, i) => ({ id: l.id, position: i }));
    setLinks(newLinks);

    startTransition(async () => {
      const result = await reorderLinks(reordered);
      if (result?.error) {
        toast.error(result.error);
        loadLinks();
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
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Links</h1>
          <p className="text-sm text-zinc-400">
            Manage the links on your public page.
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-violet-600 text-white hover:bg-violet-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>

      {/* Add Link Form */}
      {showAdd && (
        <Card className="border-violet-500/30 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white">New Link</CardTitle>
            <CardDescription className="text-zinc-400">
              Add a link to your public page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-zinc-300">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="My Website"
                  className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url" className="text-zinc-300">
                  URL
                </Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  required
                  placeholder="https://example.com"
                  className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-violet-600 text-white hover:bg-violet-700"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Add
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAdd(false)}
                  className="text-zinc-400"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Links List */}
      {links.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-zinc-800 p-4">
              <Link2 className="h-8 w-8 text-zinc-500" />
            </div>
            <h3 className="mb-1 text-lg font-medium text-white">
              No links yet
            </h3>
            <p className="text-sm text-zinc-400">
              Add links to show on your public page.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {links.map((link, index) => (
            <div
              key={link.id}
              className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                link.is_active
                  ? "border-zinc-800 bg-zinc-900"
                  : "border-zinc-800/50 bg-zinc-900/50 opacity-60"
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleMove(index, "up")}
                  disabled={index === 0 || isPending}
                  className="text-zinc-500 hover:text-white disabled:opacity-30"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <GripVertical className="h-3 w-3 text-zinc-600" />
                <button
                  onClick={() => handleMove(index, "down")}
                  disabled={index === links.length - 1 || isPending}
                  className="text-zinc-500 hover:text-white disabled:opacity-30"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {link.title}
                </p>
                <p className="truncate text-xs text-zinc-500">{link.url}</p>
              </div>

              <div className="flex items-center gap-1">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => handleToggle(link)}
                  disabled={isPending}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    link.is_active
                      ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                      : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                  }`}
                >
                  {link.is_active ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  disabled={isPending}
                  className="rounded p-1.5 text-zinc-500 hover:bg-red-500/15 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
