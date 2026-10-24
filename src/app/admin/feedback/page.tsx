"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare, ThumbsUp, BarChart3,
  RefreshCw,
} from "lucide-react";
import { checkAuth } from "@/lib/admin-auth";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
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
      router.replace("/admin/login?redirect=/admin/feedback");
      return;
    }
    fetchData();
  }, [router, fetchData]);

  return (
    <div className="animate-in fade-in duration-300">
      <AdminPageHeader
        title="Customer Feedback"
        description="Verified consumer ratings and comments across every product batch."
      >
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </AdminPageHeader>

      <div className="space-y-6">
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
                icon={BarChart3}
                label="Avg Rating"
                value={`${data.averageRating} / 5`}
              />
              <SummaryCard
                icon={ThumbsUp}
                label="Top Product"
                value={data.productFeedbackBreakdown[0]?.name ?? "-"}
                sub={data.productFeedbackBreakdown[0] ? `${data.productFeedbackBreakdown[0].avgRating.toFixed(1)} / 5` : undefined}
              />
              <SummaryCard
                icon={BarChart3}
                label="Top Rating"
                value={
                  data.recentFeedback.length > 0
                    ? `${Math.max(...data.recentFeedback.map((f) => f.rating))} / 5`
                    : "-"
                }
              />
            </div>

            {/* Per-Product Breakdown */}
            <section className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="size-4 text-gray-500 dark:text-neutral-300" />
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
                        <span className="text-sm font-bold text-gray-800 dark:text-neutral-100 min-w-[3ch] text-right">
                          {p.avgRating.toFixed(1)} / 5
                        </span>
                        <span className="text-xs text-gray-400 dark:text-neutral-400">({p.count})</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-kharis-green-600 rounded-full transition-all duration-500"
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
                      <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                        {f.rating} / 5
                      </span>
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
