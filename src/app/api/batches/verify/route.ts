import { NextRequest, NextResponse } from "next/server";
import { getBatchByCode } from "@/lib/batch-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code") || searchParams.get("batch");

    if (!code) {
      return NextResponse.json(
        { ok: false, error: "Batch code query parameter is required" },
        { status: 400 }
      );
    }

    const batch = await getBatchByCode(code);

    if (!batch) {
      return NextResponse.json({
        ok: false,
        found: false,
        message: "Unregistered batch number",
      });
    }

    return NextResponse.json({
      ok: true,
      found: true,
      batch: {
        batchCode: batch.batchCode,
        productName: batch.productName,
        productSlug: batch.productSlug,
        printQuantity: batch.printQuantity,
        productionDate: batch.productionDate,
        expiryDate: batch.expiryDate,
        packagingMaterial: batch.packagingMaterial,
        qrColorName: batch.qrColorName,
        facility: batch.facility,
        scanCount: batch.scanCount,
        status: batch.status,
      },
    });
  } catch (error) {
    console.error("GET /api/batches/verify error:", error);
    return NextResponse.json({ ok: false, error: "Failed to verify batch" }, { status: 500 });
  }
}
