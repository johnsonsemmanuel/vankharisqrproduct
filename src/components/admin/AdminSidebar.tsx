"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  QrCode,
  Barcode as BarcodeIcon,
  BarChart3,
  MessageSquare,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Package,
  LayoutDashboard as LayoutDashboardIcon,
  MoreHorizontal,
  X,
} from "lucide-react";
import { logout as adminLogout } from "@/lib/admin-auth";

interface NavItem {
  name: string;
  shortName?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { name: "Overview", shortName: "Overview", href: "/admin", icon: LayoutDashboardIcon },
      { name: "QR Studio", shortName: "QR Studio", href: "/admin/qr", icon: QrCode },
      { name: "Batch Registry", shortName: "Batches", href: "/admin/batches", icon: Package },
      { name: "Product Barcodes", shortName: "Barcodes", href: "/admin/barcodes", icon: BarcodeIcon },
    ],
  },
  {
    label: "Insights",
    items: [
      { name: "Analytics", shortName: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Customer Feedback", shortName: "Feedback", href: "/admin/feedback", icon: MessageSquare },
    ],
  },
];

const primaryMobileTabs: NavItem[] = [
  { name: "Overview", shortName: "Home", href: "/admin", icon: LayoutDashboardIcon },
  { name: "QR Studio", shortName: "QR Studio", href: "/admin/qr", icon: QrCode },
  { name: "Batch Registry", shortName: "Batches", href: "/admin/batches", icon: Package },
  { name: "Product Barcodes", shortName: "Barcodes", href: "/admin/barcodes", icon: BarcodeIcon },
];

interface AdminSidebarProps {
  onClose?: () => void;
  onToggleMore?: () => void;
  moreOpen?: boolean;
  variant?: "sidebar" | "bottom-bar" | "sheet";
}

export default function AdminSidebar({
  onClose,
  onToggleMore,
  moreOpen = false,
  variant = "sidebar",
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    adminLogout();
    onClose?.();
    router.push("/admin/login");
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);

  const isMoreRouteActive =
    pathname.startsWith("/admin/analytics") || pathname.startsWith("/admin/feedback");

  if (variant === "bottom-bar") {
    return (
      <nav
        aria-label="Mobile bottom navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200/90 bg-white/95 backdrop-blur-md pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] dark:border-neutral-800 dark:bg-neutral-900/95 lg:hidden"
      >
        <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center gap-1 px-2">
          {primaryMobileTabs.map((item) => {
            const Icon = item.icon;
            const active = !moreOpen && isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`group relative flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition-all duration-200 ${
                  active
                    ? "bg-brand-600 text-white shadow-xs dark:bg-brand-600 dark:text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    active
                      ? "text-white"
                      : "text-neutral-500 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-white"
                  }`}
                />
                <span className="text-[10px] font-semibold leading-none tracking-tight">
                  {item.shortName || item.name}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={onToggleMore}
            aria-expanded={moreOpen}
            aria-label="More options"
            className={`group relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition-all duration-200 ${
              moreOpen || isMoreRouteActive
                ? "bg-brand-600 text-white shadow-xs dark:bg-brand-600 dark:text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
            }`}
          >
            <MoreHorizontal
              className={`h-5 w-5 shrink-0 transition-colors ${
                moreOpen || isMoreRouteActive
                  ? "text-white"
                  : "text-neutral-500 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-white"
              }`}
            />
            <span className="text-[10px] font-semibold leading-none tracking-tight">More</span>
          </button>
        </div>
      </nav>
    );
  }

  if (variant === "sheet") {
    return (
      <div className="flex max-h-[82dvh] w-full flex-col rounded-t-3xl border-t border-neutral-200 bg-white pb-20 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* Pull handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        </div>

        {/* Sheet Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
          <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
            <img
              src="/images/kharisfoods-removebg-preview.png"
              alt="Kharis Foods"
              className="h-7 w-auto"
            />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-bold leading-tight text-neutral-900 dark:text-neutral-100">
                Kharis Foods
              </span>
              <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Operations Console
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Thumb-friendly Grid Navigation */}
        <nav className="space-y-4 overflow-y-auto px-4 py-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-1 pb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {group.label}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center gap-2.5 rounded-xl border p-3 text-xs font-semibold transition-all duration-200 active:scale-[0.98] ${
                        active
                          ? "border-brand-600 bg-brand-600 text-white shadow-xs dark:border-brand-500 dark:bg-brand-600 dark:text-white"
                          : "border-neutral-200/80 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          active
                            ? "text-white"
                            : "text-neutral-500 group-hover:text-neutral-800 dark:text-neutral-400 dark:group-hover:text-white"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between gap-2 border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
            <span>Customer Website</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-400 dark:hover:bg-rose-900 dark:hover:text-rose-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside className="flex h-full w-full flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b border-neutral-200 px-5 dark:border-neutral-800">
        <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
          <img
            src="/images/kharisfoods-removebg-preview.png"
            alt="Kharis Foods"
            className="h-8 w-auto"
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-bold leading-tight tracking-tight text-neutral-900 dark:text-neutral-100">
              Kharis Foods
            </span>
            <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Operations Console
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                      active
                        ? "bg-brand-600 text-white shadow-xs dark:bg-brand-600 dark:text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                        active
                          ? "text-white"
                          : "text-neutral-400 group-hover:text-neutral-800 dark:text-neutral-400 dark:group-hover:text-white"
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Utilities */}
      <div className="shrink-0 border-t border-neutral-200 p-3 dark:border-neutral-800">
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-[11px] font-medium text-neutral-600 dark:bg-neutral-950/60 dark:text-neutral-300">
          <ShieldCheck className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <span>Internal workspace</span>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
            Customer Website
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}