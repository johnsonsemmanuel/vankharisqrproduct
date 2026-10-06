import { NextRequest, NextResponse } from "next/server";
import { getAllBatches, createBatch } from "@/lib/batch-store";

export async function GET() {
  try {
    const batches = await getAllBatches();
    return NextResponse.json({ ok: true, batches });
  } catch (error) {
    console.error("GET /api/batches error:", error);
    return NextResponse.json({ ok: false, error: "Failed to fetch batches" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      batchCode,
      productSlug,
      productName,
      printQuantity,
      qrColor,
      qrColorName,
      packagingMaterial,
      productionDate,
      expiryDate,
      facility,
      notes,
    } = body;

    if (!batchCode || !productSlug || !productName) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: batchCode, productSlug, productName" },
        { status: 400 }
      );
    }

    const parsedQty = parseInt(printQuantity, 10);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      return NextResponse.json(
        { ok: false, error: "printQuantity must be a positive integer" },
        { status: 400 }
      );
    }

    const newBatch = await createBatch({
      batchCode: String(batchCode).trim(),
      productSlug: String(productSlug).trim(),
      productName: String(productName).trim(),
      printQuantity: parsedQty,
      qrColor: qrColor || "#000000",
      qrColorName: qrColorName || "Black",
      packagingMaterial: packagingMaterial || "White Poly Sack",
      productionDate: productionDate || new Date().toISOString().slice(0, 10),
      expiryDate: expiryDate || "",
      facility: facility || "Kharis Packaging Line",
      notes: notes || "",
    });

    return NextResponse.json({ ok: true, batch: newBatch });
  } catch (error) {
    console.error("POST /api/batches error:", error);
    return NextResponse.json({ ok: false, error: "Failed to create batch" }, { status: 500 });
  }
}
