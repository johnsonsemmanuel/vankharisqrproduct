import { NextResponse } from "next/server";
import { getStorageInfo } from "@/lib/analytics-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const info = await getStorageInfo();
  return NextResponse.json({
    storage: info,
    env: {
      hasUpstashUrl: !!process.env.UPSTASH_REDIS_REST_URL,
      hasUpstashToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      hasKvUrl: !!process.env.KV_REST_API_URL,
      hasKvToken: !!process.env.KV_REST_API_TOKEN,
      isVercel: !!process.env.VERCEL,
    },
  });
}
