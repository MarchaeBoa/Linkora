import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RouteContext {
  params: Promise<{ orderId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { orderId } = await context.params;

  if (!orderId) {
    return NextResponse.json({ error: "ID do pedido obrigatório." }, { status: 400 });
  }

  // Verify order exists and is completed
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id, status, product_id")
    .eq("id", orderId)
    .eq("status", "completed")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Pedido não encontrado ou pagamento pendente." },
      { status: 404 }
    );
  }

  // Get product file URL
  const { data: product, error: productError } = await supabaseAdmin
    .from("products")
    .select("file_url, name")
    .eq("id", order.product_id)
    .single();

  if (productError || !product || !product.file_url) {
    return NextResponse.json(
      { error: "Arquivo do produto não encontrado." },
      { status: 404 }
    );
  }

  // If file is in Supabase Storage (private bucket), generate signed URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  if (product.file_url.includes(supabaseUrl)) {
    // Extract path from full URL
    const storagePrefix = `${supabaseUrl}/storage/v1/object/public/files/`;
    const filePath = product.file_url.replace(storagePrefix, "");

    const { data: signedData, error: signedError } = await supabaseAdmin
      .storage
      .from("files")
      .createSignedUrl(filePath, 300); // 5 min expiry

    if (signedError || !signedData?.signedUrl) {
      // Fallback to public URL if signed URL fails
      return NextResponse.json({
        downloadUrl: product.file_url,
        productName: product.name,
      });
    }

    return NextResponse.json({
      downloadUrl: signedData.signedUrl,
      productName: product.name,
    });
  }

  // External file URL
  return NextResponse.json({
    downloadUrl: product.file_url,
    productName: product.name,
  });
}
