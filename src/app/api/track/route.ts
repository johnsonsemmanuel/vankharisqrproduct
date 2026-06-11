import { NextRequest, NextResponse } from "next/server";
import { addRecord } from "@/lib/analytics-store";
import type { ScanRecord } from "@/lib/analytics-types";

function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua))
    return "Mobile";
  if (/ipad|tablet|playbook|silk/i.test(ua)) return "Tablet";
  return "Desktop";
}

function detectBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("edg")) return "Edge";
  if (ua.includes("chrome")) return "Chrome";
  if (ua.includes("safari")) return "Safari";
  return "Other";
}

function detectOS(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("mac os") || ua.includes("macintosh")) return "macOS";
  if (ua.includes("android")) return "Android";
  if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad"))
    return "iOS";
  if (ua.includes("linux")) return "Linux";
  return "Other";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productSlug, productName } = body;

    if (!productSlug || !productName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || "Unknown";

    const record: ScanRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productSlug,
      productName,
      timestamp: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      deviceType: detectDevice(userAgent),
      browser: detectBrowser(userAgent),
      os: detectOS(userAgent),
      referrer: request.headers.get("referer") || "",
    };

    addRecord(record);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Track API error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
