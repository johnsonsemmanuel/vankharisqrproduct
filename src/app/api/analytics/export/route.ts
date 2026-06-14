import { NextResponse } from "next/server";
import { exportAllData } from "@/lib/analytics-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await exportAllData();
  return NextResponse.json(data);
}
