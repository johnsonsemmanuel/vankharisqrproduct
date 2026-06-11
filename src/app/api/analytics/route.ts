import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/analytics-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const analytics = getAnalytics();
  return NextResponse.json(analytics);
}
