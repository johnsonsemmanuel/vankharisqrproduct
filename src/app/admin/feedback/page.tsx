"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star, MessageSquare, ThumbsUp, LayoutDashboard, LogOut,
  RefreshCw, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkAuth, logout as adminLogout } from "@/lib/admin-auth";
import type { AnalyticsSnapshot } from "@/lib/analytics-types";

export default function AdminFeedbackPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) setData(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/admin");
      return;
    }
    fetchData();
  }, [router, fetchData]);

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-5 h-14 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <img
              src="/images/kharisfoods-removebg-preview.png"
              alt="Kharis Foods"
              className="h-6 w-auto"
            />
            <h1 className="font-bold text-gray-800 dark:text-neutral-100 text-sm">Feedback</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-neutral-300 hover:text-gray-800 dark:hover:text-neutral-100 transition-colors"
            >
              <LayoutDashboard className="size-3.5" />
              Dashboard
            </Link>
            <button
              onClick={() => { adminLogout(); router.push("/admin"); }}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-neutral-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="size-3.5" />
              Logout
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchData}
              variant="ghost"
              size="icon"
              className="size-7"
              title="Refresh"
            >
              <RefreshCw
                className={`size-4 text-gray-400 dark:text-neutral-400 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
        {loading && !data ? (
          <div className="text-center py-20 text-gray-400 dark:text-neutral-400 text-sm">
            Loading feedback…
          </div>
        ) : !data || data.totalFeedback === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="size-12 text-gray-300 dark:text-neutral-500 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-neutral-300 text-sm font-medium">No feedback yet</p>
            <p className="text-gray-400 dark:text-neutral-400 text-xs mt-1">
              Ratings and comments from customers will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SummaryCard
                icon={MessageSquare}
                label="Total Entries"
                value={data.totalFeedback.toLocaleString()}
              />
              <SummaryCard
                icon={Star}
                label="Avg Rating"
                value={`${data.averageRating} / 5`}
              />
              <SummaryCard
                icon={ThumbsUp}
                label="Top Product"
                value={data.productFeedbackBreakdown[0]?.name ?? "—"}
                sub={`${data.productFeedbackBreakdown[0]?.avgRating.toFixed(1) ?? ""} ★`}
              />
              <SummaryCard
                icon={Star}
                label="Top Rating"
                value={
                  data.recentFeedback.length > 0
                    ? `${Math.max(...data.recentFeedback.map((f) => f.rating))} / 5`
                    : "—"
                }
              />
            </div>

            {/* Per-Product Breakdown */}
            <section className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star className="size-4 text-gray-500 dark:text-neutral-300" />
                <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">Ratings by Product</h2>
              </div>
              <div className="space-y-4">
                {data.productFeedbackBreakdown.map((p) => (
                  <div key={p.slug}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">
                        {p.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`size-3 ${
                                star <= Math.round(p.avgRating)
                                  ? "fill-kharis-gold-500 text-kharis-gold-500"
                                  : "text-gray-300 dark:text-neutral-700"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-gray-800 dark:text-neutral-100 min-w-[3ch] text-right">
                          {p.avgRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-neutral-400">({p.count})</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-kharis-gold-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${(p.avgRating / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Feedback */}
            <section className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="size-4 text-gray-500 dark:text-neutral-300" />
                <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">
                  Recent Feedback
                </h2>
              </div>
              <div className="space-y-3">
                {data.recentFeedback.map((f) => (
                  <div
                    key={f.id}
                    className="border border-gray-100 dark:border-neutral-800 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800 dark:text-neutral-100">
                          {f.productName}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-medium">
                          {new Date(f.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`size-3 ${
                              star <= f.rating
                                ? "fill-kharis-gold-500 text-kharis-gold-500"
                                : "text-gray-300 dark:text-neutral-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {f.comment && (
                      <p className="text-sm text-gray-600 dark:text-neutral-300 leading-relaxed">
                        &ldquo;{f.comment}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="size-3.5 text-gray-400 dark:text-neutral-400" />
        <span className="text-xs text-gray-500 dark:text-neutral-300 font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold text-gray-800 dark:text-neutral-100 truncate">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 dark:text-neutral-400 mt-0.5">{sub}</p>}
    </div>
  );
}
