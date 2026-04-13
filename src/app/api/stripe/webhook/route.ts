import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSubscriptionPlan } from "@/lib/plans";
import type Stripe from "stripe";

type SupabaseSubscriptionStatus =
  | "inactive"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid";

function mapStripeStatus(status: Stripe.Subscription.Status): SupabaseSubscriptionStatus {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "unpaid":
      return "unpaid";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    case "incomplete":
    case "paused":
    default:
      return "inactive";
  }
}

async function syncSubscriptionToProfile(subscription: Stripe.Subscription) {
  const supabaseAdmin = createAdminClient();
  const userId = subscription.metadata?.supabase_user_id;
  const planFromMetadata = subscription.metadata?.plan;

  if (!userId) {
    console.warn("[Webhook] subscription missing supabase_user_id metadata", subscription.id);
    return;
  }

  const status = mapStripeStatus(subscription.status);
  const plan = isSubscriptionPlan(planFromMetadata) ? planFromMetadata : null;
  const periodEndSeconds = (subscription as unknown as { current_period_end?: number }).current_period_end;
  const periodEnd = periodEndSeconds
    ? new Date(periodEndSeconds * 1000).toISOString()
    : null;

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      subscription_status: status,
      subscription_plan: plan,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      subscription_current_period_end: periodEnd,
    })
    .eq("id", userId);

  if (error) {
    console.error("[Webhook] Failed to sync subscription:", error);
    throw new Error("Failed to sync subscription");
  }

  console.log("[Webhook] Synced subscription", subscription.id, "→", status, plan);
}

async function handleSubscriptionCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!session.subscription) return;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await syncSubscriptionToProfile(subscription);
}

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
        if (session.mode === "subscription") {
          await handleSubscriptionCheckoutCompleted(session);
        } else if (session.payment_status === "paid") {
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
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscriptionToProfile(subscription);
        break;
      }
    }
  } catch (error) {
    console.error("[Webhook] Handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
