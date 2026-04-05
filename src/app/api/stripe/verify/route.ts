import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id, status")
    .eq("stripe_session_id", sessionId)
    .eq("status", "completed")
    .single();

  if (!order) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

  return NextResponse.json({ orderId: order.id, status: order.status });
}
