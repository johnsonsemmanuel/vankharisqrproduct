"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  QrCode,
  Barcode as BarcodeIcon,
  BarChart3,
  MessageSquare,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Package,
  Settings,
  LayoutDashboard as LayoutDashboardIcon,
} from "lucide-react";
import { logout as adminLogout } from "@/lib/admin-auth";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { name: "Overview", href: "/admin", icon: LayoutDashboardIcon },
      { name: "QR Studio", href: "/admin/qr", icon: QrCode },
      { name: "Batch Registry", href: "/admin/batches", icon: Package },
      { name: "Product Barcodes", href: "/admin/barcodes", icon: BarcodeIcon },
    ],
  },
  {
    label: "Insights",
    items: [
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Customer Feedback", href: "/admin/feedback", icon: MessageSquare },
    ],
  },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    adminLogout();
    router.push("/admin/login");
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);

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
                        ? "bg-brand-50 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/70 dark:hover:text-neutral-100"
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 ${
                        active
                          ? "text-brand-700 dark:text-brand-300"
                          : "text-neutral-400 group-hover:text-neutral-700 dark:text-neutral-500 dark:group-hover:text-neutral-300"
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