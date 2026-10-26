"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  QrCode,
  Barcode as BarcodeIcon,
  BarChart3,
  MessageSquare,
  ChevronRight,
  ScanLine,
  Package,
  RefreshCw,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { checkAuth } from "@/lib/admin-auth";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import type { AnalyticsSnapshot } from "@/lib/analytics-types";
import type { BatchRecord } from "@/lib/batch-store";

const quickActions = [
  {
    href: "/admin/qr",
    icon: QrCode,
    title: "QR & Barcode Studio",
    description: "Generate packaging QR codes, simulate substrates and register print batches.",
    action: "Open studio",
  },
  {
    href: "/admin/barcodes",
    icon: BarcodeIcon,
    title: "Product Barcodes",
    description: "Manage and download print-ready barcodes for product packaging.",
    action: "Open barcodes",
  },
  {
    href: "/admin/analytics",
    icon: BarChart3,
    title: "Scan Analytics",
    description: "Track scan volume, devices, browsers and product performance.",
    action: "View metrics",
  },
  {
    href: "/admin/feedback",
    icon: MessageSquare,
    title: "Customer Feedback",
    description: "Read verified consumer ratings and product reviews.",
    action: "Read feedback",
  },
];

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {label}
        </p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tabular-nums tracking-tight text-neutral-900 dark:text-neutral-100">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>}
    </div>
  );
}

function formatRelative(timestamp?: number) {
  if (!timestamp) return "-";
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export default function AdminPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot | null>(null);
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, batchesRes] = await Promise.all([
        fetch("/api/analytics", { cache: "no-store" }),
        fetch("/api/batches", { cache: "no-store" }),
      ]);

      if (analyticsRes.ok) {
        setAnalytics((await analyticsRes.json()) as AnalyticsSnapshot);
      }
      if (batchesRes.ok) {
        const payload = (await batchesRes.json()) as { batches?: BatchRecord[] };
        setBatches(Array.isArray(payload.batches) ? payload.batches : []);
      }
      if (!analyticsRes.ok && !batchesRes.ok) {
        setError("Could not load dashboard data.");
      }
    } catch {
      setError("Could not reach the dashboard APIs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/admin/login?redirect=/admin");
      return;
    }
    loadData();
  }, [router, loadData]);

  const activeBatches = batches.filter((batch) => batch.status === "active").length;
  const totalPrint = batches.reduce((sum, batch) => sum + (batch.printQuantity || 0), 0);
  const averageRating = analytics?.averageRating ?? 0;

  return (
    <div className="animate-in fade-in duration-300">
      <AdminPageHeader
        title="Operations Overview"
        description="Monitor scans, manage packaging codes, and review customer feedback across every product."
      >
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </AdminPageHeader>

      {error && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total scans"
          value={loading ? "—" : (analytics?.totalScans ?? 0).toLocaleString()}
          hint="Consumer QR scans"
          icon={ScanLine}
        />
        <StatCard
          label="Active batches"
          value={loading ? "—" : activeBatches.toLocaleString()}
          hint={`${batches.length.toLocaleString()} registered · ${totalPrint.toLocaleString()} units`}
          icon={Package}
        />
        <StatCard
          label="Feedback"
          value={loading ? "-" : (analytics?.totalFeedback ?? 0).toLocaleString()}
          hint="Verified reviews"
          icon={MessageSquare}
        />
        <StatCard
          label="Average rating"
          value={loading ? "-" : averageRating > 0 ? `${averageRating.toFixed(1)} / 5` : "-"}
          hint={`${analytics?.totalFeedback ?? 0} ratings collected`}
          icon={BarChart3}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Workspace
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-xs transition-all hover:border-brand-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-brand-700"
                >
                  <div>
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 transition-transform group-hover:scale-105 dark:bg-white">
                      <Icon className="h-5 w-5 text-white dark:text-neutral-900" />
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 transition-colors group-hover:text-brand-700 dark:text-neutral-100 dark:group-hover:text-brand-300">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-semibold text-brand-700 dark:border-neutral-800 dark:text-brand-300">
                    <span>{item.action}</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Recent scans
            </h2>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {loading ? (
              <p className="px-5 py-8 text-center text-xs text-neutral-400">Loading activity…</p>
            ) : analytics?.recentScans?.length ? (
              analytics.recentScans.slice(0, 6).map((scan) => (
                <div key={scan.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                    <ScanLine className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {scan.productName}
                    </p>
                    <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                      {scan.deviceType} · {scan.browser}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-neutral-400">
                    {formatRelative(scan.timestamp)}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-xs text-neutral-400">No scans recorded yet.</p>
            )}
          </div>
        </section>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Recent feedback
            </h2>
            <Link
              href="/admin/feedback"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {loading ? (
              <p className="px-5 py-8 text-center text-xs text-neutral-400">Loading feedback…</p>
            ) : analytics?.recentFeedback?.length ? (
              analytics.recentFeedback.slice(0, 5).map((feedback) => (
                <div key={feedback.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {feedback.productName}
                    </p>
                    <span className="shrink-0 rounded-md bg-brand-50 px-1.5 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                      {feedback.rating} / 5
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {feedback.comment || "No comment provided."}
                  </p>
                </div>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-xs text-neutral-400">
                No feedback collected yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Production batches
            </h2>
            <Link
              href="/admin/batches"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300"
            >
              Manage
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {loading ? (
              <p className="px-5 py-8 text-center text-xs text-neutral-400">Loading batches…</p>
            ) : batches.length ? (
              batches.slice(0, 5).map((batch) => (
                <div key={batch.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                    <Package className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {batch.productName}
                    </p>
                    <p className="truncate font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      {batch.batchCode}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-[11px] text-neutral-400">
                    <Clock className="h-3 w-3" />
                    {formatRelative(batch.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-xs text-neutral-400">
                No batches registered yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
