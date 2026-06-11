"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3, Smartphone, Monitor, Tablet, Globe, Clock,
  RefreshCw, TrendingUp, Hash, Package, LayoutDashboard, LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkAuth, logout as adminLogout } from "@/lib/admin-auth";
import type { AnalyticsSnapshot } from "@/lib/analytics-types";

export default function AnalyticsPage() {
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

  const maxProductCount = Math.max(
    ...(data?.productBreakdown.map((p) => p.count) ?? [1]),
    1
  );
  const maxDailyCount = Math.max(
    ...(data?.dailyScans.map((d) => d.count) ?? [1]),
    1
  );

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
            <h1 className="font-bold text-gray-800 dark:text-neutral-100 text-sm">Analytics</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-100 transition-colors"
            >
              <LayoutDashboard className="size-3.5" />
              Dashboard
            </Link>
            <button
              onClick={() => { adminLogout(); router.push("/admin"); }}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-neutral-500 hover:text-red-500 transition-colors"
            >
              <LogOut className="size-3.5" />
              Logout
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-neutral-500">Realtime</span>
            <Button
              onClick={fetchData}
              variant="ghost"
              size="icon"
              className="size-7"
              title="Refresh"
            >
              <RefreshCw
                className={`size-4 text-gray-400 dark:text-neutral-500 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
        {loading && !data ? (
          <div className="text-center py-20 text-gray-400 dark:text-neutral-500 text-sm">
            Loading analytics…
          </div>
        ) : !data || data.totalScans === 0 ? (
          <div className="text-center py-20">
            <BarChart3 className="size-12 text-gray-300 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-neutral-400 text-sm font-medium">No scans yet</p>
            <p className="text-gray-400 dark:text-neutral-500 text-xs mt-1">
              Scans will appear here once users visit product pages.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SummaryCard
                icon={Hash}
                label="Total Scans"
                value={data.totalScans.toLocaleString()}
              />
              <SummaryCard
                icon={Package}
                label="Products"
                value={data.productBreakdown.length.toString()}
              />
              <SummaryCard
                icon={TrendingUp}
                label="Top Product"
                value={data.productBreakdown[0]?.name ?? "—"}
                sub={data.productBreakdown[0]?.count.toLocaleString() ?? ""}
              />
              <SummaryCard
                icon={Clock}
                label="Last Scan"
                value={
                  data.recentScans.length > 0
                    ? new Date(data.recentScans[0].timestamp).toLocaleDateString()
                    : "—"
                }
              />
            </div>

            {/* Per-Product Breakdown */}
            <section className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package className="size-4 text-gray-500 dark:text-neutral-400" />
                <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">Scans by Product</h2>
              </div>
              <div className="space-y-3">
                {data.productBreakdown.map((p) => (
                  <div key={p.slug}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
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
                <BarChart3 className="size-4 text-gray-500 dark:text-neutral-400" />
                <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">
                  Scans Over Time
                </h2>
              </div>
              {data.dailyScans.length > 0 ? (
                <div className="flex items-end gap-1 h-32">
                  {data.dailyScans.map((d) => (
                    <div
                      key={d.date}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span className="text-[10px] text-gray-400 dark:text-neutral-500 font-medium">
                        {d.count}
                      </span>
                      <div
                        className="w-full bg-kharis-gold-400 rounded-t transition-all duration-500"
                        style={{
                          height: `${(d.count / maxDailyCount) * 100}%`,
                          minHeight: d.count > 0 ? "4px" : "0",
                        }}
                      />
                      <span className="text-[10px] text-gray-400 dark:text-neutral-500 -rotate-45 origin-left whitespace-nowrap">
                        {new Date(d.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-neutral-500 text-center py-6">
                  No daily data yet
                </p>
              )}
            </section>

            {/* Device & Browser/OS Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Device */}
              <section className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="size-4 text-gray-500 dark:text-neutral-400" />
                  <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">Devices</h2>
                </div>
                <div className="space-y-2.5">
                  {data.deviceBreakdown.map((d) => (
                    <div key={d.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DeviceIcon type={d.type} />
                        <span className="text-sm text-gray-600 dark:text-neutral-400">{d.type}</span>
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
                  <Globe className="size-4 text-gray-500 dark:text-neutral-400" />
                  <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">Browsers</h2>
                </div>
                <div className="space-y-2.5">
                  {data.browserBreakdown.map((b) => (
                    <div key={b.name} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-neutral-400">{b.name}</span>
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
                  <Monitor className="size-4 text-gray-500 dark:text-neutral-400" />
                  <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">OS</h2>
                </div>
                <div className="space-y-2.5">
                  {data.osBreakdown.map((o) => (
                    <div key={o.name} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-neutral-400">{o.name}</span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-neutral-100">
                        {o.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Recent Scans */}
            <section className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="size-4 text-gray-500 dark:text-neutral-400" />
                <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">
                  Recent Scans
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-neutral-800 text-left">
                      <th className="pb-2 pr-3 text-gray-400 dark:text-neutral-500 font-medium text-xs uppercase tracking-wider">
                        Product
                      </th>
                      <th className="pb-2 pr-3 text-gray-400 dark:text-neutral-500 font-medium text-xs uppercase tracking-wider">
                        Device
                      </th>
                      <th className="pb-2 pr-3 text-gray-400 dark:text-neutral-500 font-medium text-xs uppercase tracking-wider">
                        Browser
                      </th>
                      <th className="pb-2 pr-3 text-gray-400 dark:text-neutral-500 font-medium text-xs uppercase tracking-wider">
                        OS
                      </th>
                      <th className="pb-2 text-gray-400 dark:text-neutral-500 font-medium text-xs uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentScans.map((s) => (
                      <tr key={s.id} className="border-b border-gray-50">
                        <td className="py-2.5 pr-3 text-gray-800 dark:text-neutral-100 font-medium">
                          {s.productName}
                        </td>
                        <td className="py-2.5 pr-3 text-gray-500 dark:text-neutral-400">{s.deviceType}</td>
                        <td className="py-2.5 pr-3 text-gray-500 dark:text-neutral-400">{s.browser}</td>
                        <td className="py-2.5 pr-3 text-gray-500 dark:text-neutral-400">{s.os}</td>
                        <td className="py-2.5 text-gray-400 dark:text-neutral-500 whitespace-nowrap">
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
        <Icon className="size-3.5 text-gray-400 dark:text-neutral-500" />
        <span className="text-xs text-gray-500 dark:text-neutral-400 font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold text-gray-800 dark:text-neutral-100 truncate">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 dark:text-neutral-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function DeviceIcon({ type }: { type: string }) {
  const cls = "size-4 text-gray-400 dark:text-neutral-500";
  switch (type.toLowerCase()) {
    case "mobile":
      return <Smartphone className={cls} />;
    case "tablet":
      return <Tablet className={cls} />;
    case "desktop":
      return <Monitor className={cls} />;
    default:
      return <Smartphone className={cls} />;
  }
}
