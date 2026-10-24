import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/product-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ ok: true, products });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ ok: false, error: "Failed to fetch products" }, { status: 500 });
  }
}
