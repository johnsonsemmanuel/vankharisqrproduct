"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3, Smartphone, Monitor, Tablet, Globe, Clock,
  RefreshCw, TrendingUp, Hash, Package,
  MessageSquare, Download, Calendar, Filter
} from "lucide-react";
import { checkAuth } from "@/lib/admin-auth";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import type { AnalyticsSnapshot } from "@/lib/analytics-types";
import { SummaryCard, DeviceIcon } from "@/components/admin/AnalyticsHelpers";

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [quickRange, setQuickRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateRange.from) params.set("from", dateRange.from);
      if (dateRange.to) params.set("to", dateRange.to);
      const res = await fetch(`/api/analytics?${params.toString()}`);
      if (res.ok) setData(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/admin/login?redirect=/admin/analytics");
      return;
    }
    fetchData();
  }, [router, fetchData]);

  const handleExport = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics/export");
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kharis-analytics-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }, []);

  const handleQuickRange = (range: "7d" | "30d" | "90d" | "all") => {
    setQuickRange(range);
    if (range === "all") {
      setDateRange({ from: "", to: "" });
      return;
    }
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);
    setDateRange({
      from: from.toISOString().split("T")[0],
      to: to.toISOString().split("T")[0],
    });
  };

  const filteredData = useMemo(() => {
    if (!data) return null;
    if (!dateRange.from && !dateRange.to) return data;
    return {
      ...data,
      dailyScans: data.dailyScans.filter((d) => {
        if (dateRange.from && d.date < dateRange.from) return false;
        if (dateRange.to && d.date > dateRange.to) return false;
        return true;
      }),
      recentScans: data.recentScans.filter((s) => {
        const scanDate = new Date(s.timestamp).toISOString().split("T")[0];
        if (dateRange.from && scanDate < dateRange.from) return false;
        if (dateRange.to && scanDate > dateRange.to) return false;
        return true;
      }),
      productBreakdown: data.productBreakdown.map((p) => ({
        ...p,
        count: data.recentScans
          .filter((s) => s.productName === p.name)
          .filter((s) => {
            const scanDate = new Date(s.timestamp).toISOString().split("T")[0];
            if (dateRange.from && scanDate < dateRange.from) return false;
            if (dateRange.to && scanDate > dateRange.to) return false;
            return true;
          }).length,
      })).filter((p) => p.count > 0),
      totalScans: data.recentScans.filter((s) => {
        const scanDate = new Date(s.timestamp).toISOString().split("T")[0];
        if (dateRange.from && scanDate < dateRange.from) return false;
        if (dateRange.to && scanDate > dateRange.to) return false;
        return true;
      }).length,
      totalFeedback: data.recentFeedback.filter((f) => {
        const feedbackDate = new Date(f.timestamp).toISOString().split("T")[0];
        if (dateRange.from && feedbackDate < dateRange.from) return false;
        if (dateRange.to && feedbackDate > dateRange.to) return false;
        return true;
      }).length,
    };
  }, [data, dateRange]);

  const maxProductCount = Math.max(
    ...(filteredData?.productBreakdown.map((p) => p.count) ?? [1]),
    1
  );
  const maxDailyCount = Math.max(
    ...(filteredData?.dailyScans.map((d) => d.count) ?? [1]),
    1
  );

  const headerActions = (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 border border-neutral-200 dark:border-neutral-800 rounded-lg p-1">
        {(["7d", "30d", "90d", "all"] as const).map((range) => (
          <button
            key={range}
            onClick={() => handleQuickRange(range)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
              quickRange === range
                ? "bg-brand-600 text-white"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            }`}
          >
            {range === "7d" ? "7d" : range === "30d" ? "30d" : range === "90d" ? "90d" : "All"}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 ml-2">
        <label className="text-xs text-neutral-500 dark:text-neutral-400">From</label>
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
          className="px-2 py-1 text-xs rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <label className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">To</label>
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
          className="px-2 py-1 text-xs rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        {(dateRange.from || dateRange.to) && (
          <button
            onClick={() => setDateRange({ from: "", to: "" })}
            className="text-xs text-brand-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      <button
        onClick={handleExport}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        <Download className="h-3.5 w-3.5" />
        Export JSON
      </button>
      <button
        onClick={fetchData}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        Refresh
      </button>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-300">
      <AdminPageHeader
        title="Scan Analytics"
        description="Consumer scan volume, device mix, and product performance across every packaging QR code."
      >
        {headerActions}
      </AdminPageHeader>

      <div className="space-y-6">
        {loading && !filteredData ? (
          <div className="text-center py-20 text-gray-400 dark:text-neutral-400 text-sm">
            Loading analytics…
          </div>
        ) : !filteredData || filteredData.totalScans === 0 ? (
          <div className="text-center py-20">
            <BarChart3 className="size-12 text-gray-300 dark:text-neutral-500 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-neutral-300 text-sm font-medium">No scans yet</p>
            <p className="text-gray-400 dark:text-neutral-400 text-xs mt-1">
              Scans will appear here once users visit product pages.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <SummaryCard
                icon={Hash}
                label="Total Scans"
                value={filteredData!.totalScans.toLocaleString()}
              />
              <SummaryCard
                icon={Package}
                label="Products"
                value={filteredData!.productBreakdown.length.toString()}
              />
              <SummaryCard
                icon={TrendingUp}
                label="Top Product"
                value={filteredData!.productBreakdown[0]?.name ?? "-"}
                sub={filteredData!.productBreakdown[0]?.count.toLocaleString() ?? ""}
              />
              <SummaryCard
                icon={Clock}
                label="Last Scan"
                value={
                  filteredData!.recentScans.length > 0
                    ? new Date(filteredData!.recentScans[0].timestamp).toLocaleDateString()
                    : "-"
                }
              />
              <SummaryCard
                icon={BarChart3}
                label="Avg Rating"
                value={filteredData!.totalFeedback > 0 ? `${filteredData!.averageRating} / 5` : "-"}
                sub={`${filteredData!.totalFeedback} reviews`}
              />
              <SummaryCard
                icon={MessageSquare}
                label="Feedback"
                value={filteredData!.totalFeedback.toLocaleString()}
              />
            </div>

            {/* Per-Product Breakdown */}
            <section className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package className="size-4 text-gray-500 dark:text-neutral-300" />
                <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">Scans by Product</h2>
              </div>
              <div className="space-y-3">
                {filteredData!.productBreakdown.map((p) => (
                  <div key={p.slug}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">
                        {p.name}
                      </span>
                      <span className="text-sm font-bold text-gray-800 dark:text-neutral-100">
                        {p.count.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-kharis-green-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${(p.count / maxProductCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Daily Scans */}
            <section className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="size-4 text-gray-500 dark:text-neutral-300" />
                <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">
                  Scans Over Time
                </h2>
              </div>
              {filteredData!.dailyScans.length > 0 ? (
                <div className="flex items-end gap-1 h-32">
                  {filteredData!.dailyScans.map((d) => (
                    <div
                      key={d.date}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span className="text-[10px] text-gray-400 dark:text-neutral-400 font-medium">
                        {d.count}
                      </span>
                      <div
                        className="w-full bg-kharis-gold-400 rounded-t transition-all duration-500"
                        style={{
                          height: `${(d.count / maxDailyCount) * 100}%`,
                          minHeight: d.count > 0 ? "4px" : "0",
                        }}
                      />
                      <span className="text-[10px] text-gray-400 dark:text-neutral-400 -rotate-45 origin-left whitespace-nowrap">
                        {new Date(d.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-neutral-400 text-center py-6">
                  No daily data yet
                </p>
              )}
            </section>

            {/* Device & Browser/OS Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Device */}
              <section className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="size-4 text-gray-500 dark:text-neutral-300" />
                  <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">Devices</h2>
                </div>
                <div className="space-y-2.5">
                  {data!.deviceBreakdown.map((d) => (
                    <div key={d.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DeviceIcon type={d.type} />
                        <span className="text-sm text-gray-600 dark:text-neutral-300">{d.type}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 dark:text-neutral-100">
                        {d.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Browser */}
              <section className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="size-4 text-gray-500 dark:text-neutral-300" />
                  <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">Browsers</h2>
                </div>
                <div className="space-y-2.5">
                  {data!.browserBreakdown.map((b) => (
                    <div key={b.name} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-neutral-300">{b.name}</span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-neutral-100">
                        {b.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* OS */}
              <section className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Monitor className="size-4 text-gray-500 dark:text-neutral-300" />
                  <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">OS</h2>
                </div>
                <div className="space-y-2.5">
                  {data!.osBreakdown.map((o) => (
                    <div key={o.name} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-neutral-300">{o.name}</span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-neutral-100">
                        {o.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Consumer Feedback Reviews */}
            {filteredData!.totalFeedback > 0 && (
              <section className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="size-4 text-kharis-green-600" />
                  <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">
                    Consumer Feedback & Reviews
                  </h2>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
                  {filteredData!.recentFeedback.map((f) => (
                    <div key={f.id} className="p-3 bg-gray-50 dark:bg-neutral-950 rounded-lg border border-gray-100 dark:border-neutral-800">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-gray-800 dark:text-neutral-200">{f.productName}</p>
                          <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                            {f.rating} / 5
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-neutral-400">
                          {new Date(f.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {f.comment && (
                        <p className="text-xs text-gray-650 dark:text-neutral-350 mt-2 bg-white dark:bg-neutral-900 p-2 rounded border border-gray-100 dark:border-neutral-800/50 italic leading-relaxed">
                          "{f.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recent Scans */}
            <section className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="size-4 text-gray-500 dark:text-neutral-300" />
                <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">
                  Recent Scans
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-neutral-800 text-left">
                      <th className="pb-2 pr-3 text-gray-400 dark:text-neutral-400 font-medium text-xs uppercase tracking-wider">
                        Product
                      </th>
                      <th className="pb-2 pr-3 text-gray-400 dark:text-neutral-400 font-medium text-xs uppercase tracking-wider">
                        Device
                      </th>
                      <th className="pb-2 pr-3 text-gray-400 dark:text-neutral-400 font-medium text-xs uppercase tracking-wider">
                        Browser
                      </th>
                      <th className="pb-2 pr-3 text-gray-400 dark:text-neutral-400 font-medium text-xs uppercase tracking-wider">
                        OS
                      </th>
                      <th className="pb-2 text-gray-400 dark:text-neutral-400 font-medium text-xs uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData!.recentScans.map((s) => (
                      <tr key={s.id} className="border-b border-gray-50 dark:border-neutral-850">
                        <td className="py-2.5 pr-3 text-gray-800 dark:text-neutral-100 font-medium">
                          {s.productName}
                        </td>
                        <td className="py-2.5 pr-3 text-gray-500 dark:text-neutral-300">{s.deviceType}</td>
                        <td className="py-2.5 pr-3 text-gray-500 dark:text-neutral-300">{s.browser}</td>
                        <td className="py-2.5 pr-3 text-gray-500 dark:text-neutral-300">{s.os}</td>
                        <td className="py-2.5 text-gray-400 dark:text-neutral-400 whitespace-nowrap">
                          {new Date(s.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
);
  // eslint-disable-next-line no-unused-expressions
  void 0;
}
