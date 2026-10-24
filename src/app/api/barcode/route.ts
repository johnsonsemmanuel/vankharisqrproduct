import { NextRequest, NextResponse } from "next/server";
import { getProductByGtin } from "@/lib/product-store";
import { isSupabaseConfigured, supabaseQuery } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gtin = searchParams.get("gtin") || searchParams.get("code");

    if (!gtin) {
      return NextResponse.json({ ok: false, error: "GTIN required" }, { status: 400 });
    }

    const product = await getProductByGtin(gtin);

    if (!product) {
      return NextResponse.json({ ok: true, found: false }, { status: 404 });
    }

    if (isSupabaseConfigured) {
      try {
        await supabaseQuery("scan_events", {
          method: "POST",
          body: {
            product_slug: product.slug,
            product_name: product.name,
            batch_code: null,
            device_type: "POS/Barcode",
            browser: "Barcode-Scanner",
            os: "Unknown",
          },
        });
      } catch (e) {
        console.error("Supabase barcode scan error:", e);
      }
    }

    return NextResponse.json({
      ok: true,
      found: true,
      product: {
        slug: product.slug,
        name: product.name,
        gtin: product.gtin,
        category: product.category,
      },
      redirectUrl: `/product/${product.slug}`,
    });
  } catch (error) {
    console.error("GET /api/barcode error:", error);
    return NextResponse.json({ ok: false, error: "Failed to process barcode" }, { status: 500 });
  }
}
