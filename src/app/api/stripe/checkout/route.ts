import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { productId, buyerEmail } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "ID do produto obrigatório." }, { status: 400 });
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("*, profiles!products_user_id_fkey(username)")
      .eq("id", productId)
      .eq("is_active", true)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    }

    const sellerUsername = (product as any).profiles?.username || "";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Free product — skip Stripe, create order directly
    if (product.price === 0) {
      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          product_id: product.id,
          buyer_email: buyerEmail || "free@download",
          amount: 0,
          stripe_session_id: `free_${Date.now()}`,
          status: "completed",
        })
        .select("id")
        .single();

      if (orderError) {
        return NextResponse.json({ error: "Erro ao processar." }, { status: 500 });
      }

      return NextResponse.json({
        url: `${siteUrl}/checkout/success?order_id=${order.id}&free=true`,
      });
    }

    // Paid product — create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: product.name,
              description: product.description || undefined,
              images: product.cover_url ? [product.cover_url] : undefined,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel?product=${productId}&seller=${sellerUsername}`,
      metadata: {
        product_id: product.id,
        seller_id: product.user_id,
        product_name: product.name,
      },
      customer_email: buyerEmail || undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Checkout] Error:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
