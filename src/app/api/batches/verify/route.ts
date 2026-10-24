import { NextRequest, NextResponse } from "next/server";
import { getBatchByCode } from "@/lib/batch-store";
import { verifyBatchUrl } from "@/lib/batch-url";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code") || searchParams.get("batch");
    const slug = searchParams.get("slug") || "";
    const ts = searchParams.get("ts");
    const sig = searchParams.get("sig");

    if (!code) {
      return NextResponse.json(
        { ok: false, error: "Batch code query parameter is required" },
        { status: 400 }
      );
    }

    // Verify digital signature if present
    const sigVerification = verifyBatchUrl(slug, code, ts, sig);

    const batch = await getBatchByCode(code);

    if (!batch) {
      return NextResponse.json({
        ok: true,
        found: false,
        signature: sigVerification,
        message: "Unregistered batch code format",
      });
    }

    return NextResponse.json({
      ok: true,
      found: true,
      signature: sigVerification,
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
