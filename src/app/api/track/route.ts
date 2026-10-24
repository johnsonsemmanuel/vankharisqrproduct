import { NextRequest, NextResponse } from "next/server";
import { addRecord } from "@/lib/analytics-store";
import { recordBatchScan } from "@/lib/batch-store";
import { isSupabaseConfigured, supabaseQuery } from "@/lib/supabase";
import type { ScanRecord } from "@/lib/analytics-types";
import crypto from "crypto";

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

function getIpHash(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  const salt = process.env.IP_SALT || "kharis-salt";
  return crypto.createHash("sha256").update(ip + salt).digest("hex").slice(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productSlug, productName, batchCode, batch } = body;

    if (!productSlug || !productName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || "Unknown";
    const deviceType = detectDevice(userAgent);
    const browser = detectBrowser(userAgent);
    const os = detectOS(userAgent);
    const ipHash = getIpHash(request);

    const record: ScanRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productSlug,
      productName,
      timestamp: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      deviceType,
      browser,
      os,
      referrer: request.headers.get("referer") || "",
    };

    // 1. Sync scan event to Supabase
    const targetBatch = (batchCode || batch || "").trim().toUpperCase() || null;
    if (isSupabaseConfigured) {
      try {
        await supabaseQuery("scan_events", {
          method: "POST",
          body: {
            product_slug: productSlug,
            product_name: productName,
            batch_code: targetBatch,
            device_type: deviceType,
            browser,
            os,
            ip_hash: ipHash,
          },
        });
      } catch (e) {
        console.error("Supabase scan event sync error:", e);
      }
    }

    // 2. Local / Redis analytics record
    await addRecord(record);

    // 3. Batch scan increment (deduplicate by IP within 24h)
    if (targetBatch) {
      let shouldIncrement = true;
      if (isSupabaseConfigured) {
        try {
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
          const { data } = await supabaseQuery<any[]>(
            `scan_events?batch_code=eq.${encodeURIComponent(targetBatch)}&ip_hash=eq.${ipHash}&scanned_at=gte.${encodeURIComponent(yesterday)}&select=id&limit=1`
          );
          if (Array.isArray(data) && data.length > 0) {
            shouldIncrement = false;
          }
        } catch (e) {
          console.error("Dedup check error:", e);
        }
      }
      if (shouldIncrement) {
        await recordBatchScan(targetBatch);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Track API error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
