import { NextRequest, NextResponse } from "next/server";
import { createSerialsForBatch, getSerialsByBatch } from "@/lib/serial-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { batchCode, productSlug, productName, quantity } = body;

    if (!batchCode || !productSlug || !productName || !quantity) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const qty = Math.min(Math.max(Number(quantity), 1), 10000);
    const serials = await createSerialsForBatch(batchCode, productSlug, productName, qty);
    return NextResponse.json({ ok: true, serials });
  } catch (error) {
    console.error("POST /api/serials error:", error);
    return NextResponse.json({ ok: false, error: "Failed to create serials" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const batchCode = searchParams.get("batchCode");

    if (!batchCode) {
      return NextResponse.json({ ok: false, error: "batchCode required" }, { status: 400 });
    }

    const serials = await getSerialsByBatch(batchCode);
    return NextResponse.json({ ok: true, serials });
  } catch (error) {
    console.error("GET /api/serials error:", error);
    return NextResponse.json({ ok: false, error: "Failed to fetch serials" }, { status: 500 });
  }
}
