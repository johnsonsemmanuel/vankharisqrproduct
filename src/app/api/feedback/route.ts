import { NextRequest, NextResponse } from "next/server";
import { addFeedback } from "@/lib/analytics-store";
import type { FeedbackRecord } from "@/lib/analytics-types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productSlug, productName, rating, comment } = body;

    if (!productSlug || !productName || rating == null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const record: FeedbackRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productSlug,
      productName,
      rating: Number(rating),
      comment: comment || "",
      timestamp: Date.now(),
      date: new Date().toISOString().slice(0, 10),
    };

    await addFeedback(record);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
