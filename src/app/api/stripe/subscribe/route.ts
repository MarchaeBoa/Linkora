import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { PLANS, isSubscriptionPlan } from "@/lib/plans";

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json();

    if (!isSubscriptionPlan(plan)) {
      return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const supabaseAdmin = createAdminClient();
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, stripe_customer_id, display_name")
      .eq("id", user.id)
      .single();

    const planConfig = PLANS[plan];
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Create or reuse the Stripe customer
    let customerId = profile?.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: profile?.display_name ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabaseAdmin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: planConfig.currency,
            product_data: {
              name: `Linkora ${planConfig.name}`,
              description: planConfig.description,
            },
            unit_amount: planConfig.priceAmount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/checkout/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing?canceled=1`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan: planConfig.id,
        },
      },
      metadata: {
        supabase_user_id: user.id,
        plan: planConfig.id,
        kind: "subscription",
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Falha ao criar checkout." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Subscribe] Error:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
