import { NextRequest, NextResponse } from "next/server";
import { addFeedback } from "@/lib/analytics-store";
import { isSupabaseConfigured, supabaseQuery } from "@/lib/supabase";
import type { FeedbackRecord } from "@/lib/analytics-types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productSlug, productName, batchCode, rating, comment, source } = body;

    if (!productSlug || !productName || rating == null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const numericRating = Number(rating);

    const record: FeedbackRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productSlug,
      productName,
      rating: numericRating,
      comment: comment || "",
      timestamp: Date.now(),
      date: new Date().toISOString().slice(0, 10),
    };

    // 1. Sync feedback to Supabase
    if (isSupabaseConfigured) {
      try {
        await supabaseQuery("feedback", {
          method: "POST",
          body: {
            product_slug: productSlug,
            product_name: productName,
            batch_code: batchCode || null,
            rating: numericRating,
            comment: comment || null,
          },
        });
      } catch (e) {
        console.error("Supabase feedback sync error:", e);
      }
    }

    // 2. Local / Redis analytics record
    await addFeedback(record);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
