import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabaseAdmin = createAdminClient();
  const productId = session.metadata?.product_id;
  if (!productId) {
    console.warn("[Webhook] No product_id in metadata");
    return;
  }

  // Check if order already exists (idempotency)
  const { data: existing } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .single();

  if (existing) {
    console.log("[Webhook] Order already exists for session:", session.id);
    return;
  }

  const { error } = await supabaseAdmin.from("orders").insert({
    product_id: productId,
    buyer_email: session.customer_details?.email || session.customer_email || "",
    amount: session.amount_total || 0,
    stripe_session_id: session.id,
    status: "completed",
  });

  if (error) {
    console.error("[Webhook] Failed to insert order:", error);
    throw new Error("Failed to insert order");
  }

  console.log("[Webhook] Order created for product:", productId);
}

async function handlePaymentFailed(session: Stripe.Checkout.Session) {
  const supabaseAdmin = createAdminClient();
  const productId = session.metadata?.product_id;
  if (!productId) return;

  await supabaseAdmin.from("orders").insert({
    product_id: productId,
    buyer_email: session.customer_details?.email || "",
    amount: session.amount_total || 0,
    stripe_session_id: session.id,
    status: "failed",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === "paid") {
          await handleCheckoutCompleted(session);
        }
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handlePaymentFailed(session);
        break;
      }
    }
  } catch (error) {
    console.error("[Webhook] Handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
