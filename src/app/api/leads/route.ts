import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createAdminClient();
    const { email, name, userId } = await request.json();

    if (!email || !userId) {
      return NextResponse.json({ error: "Email and userId required" }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from("leads")
      .select("id")
      .eq("user_id", userId)
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json({ message: "Already subscribed" });
    }

    const { error } = await supabaseAdmin.from("leads").insert({
      user_id: userId,
      email,
      name: name || null,
    });

    if (error) {
      console.error("Lead capture error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ message: "Success" });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
