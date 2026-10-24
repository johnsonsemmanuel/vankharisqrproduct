import { NextRequest, NextResponse } from "next/server";
import { updateProductGtin } from "@/lib/product-store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { gtin } = body;

    if (!gtin) {
      return NextResponse.json({ ok: false, error: "GTIN required" }, { status: 400 });
    }

    const success = await updateProductGtin(slug, gtin);
    if (!success) {
      return NextResponse.json({ ok: false, error: "Failed to update GTIN" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PATCH /api/products/[slug] error:", error);
    return NextResponse.json({ ok: false, error: "Failed to update product" }, { status: 500 });
  }
}
