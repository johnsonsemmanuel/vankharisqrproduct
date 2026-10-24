import { NextRequest, NextResponse } from "next/server";
import { verifyAndUseSerial } from "@/lib/serial-store";
import crypto from "crypto";

function getIpHash(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  const salt = process.env.IP_SALT || "kharis-salt";
  return crypto.createHash("sha256").update(ip + salt).digest("hex").slice(0, 16);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serial = searchParams.get("serial") || searchParams.get("s");

    if (!serial) {
      return NextResponse.json({ ok: false, error: "Serial required" }, { status: 400 });
    }

    const ipHash = getIpHash(request);
    const result = await verifyAndUseSerial(serial, ipHash);

    if (!result.valid) {
      if (result.reason === "already_used") {
        return NextResponse.json({
          ok: true,
          valid: false,
          reason: "already_used",
          message: "This code has already been verified. It may be counterfeit or duplicated.",
        });
      }
      return NextResponse.json({
        ok: true,
        valid: false,
        reason: "invalid",
        message: "Invalid security code.",
      });
    }

    return NextResponse.json({
      ok: true,
      valid: true,
      serial: {
        serialCode: result.serial?.serialCode,
        batchCode: result.serial?.batchCode,
        productSlug: result.serial?.productSlug,
        productName: result.serial?.productName,
      },
      message: "Authentic product verified.",
    });
  } catch (error) {
    console.error("GET /api/serials/verify error:", error);
    return NextResponse.json({ ok: false, error: "Failed to verify serial" }, { status: 500 });
  }
}
