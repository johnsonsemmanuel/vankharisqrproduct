"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  QrCode,
  Barcode as BarcodeIcon,
  Package,
  BarChart3,
  MessageSquare,
  LogOut,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { logout as adminLogout } from "@/lib/admin-auth";
import ThemeToggle from "@/components/ThemeToggle";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    description: "System overview & quick actions",
  },
  {
    name: "QR & Barcode Studio",
    href: "/admin/qr",
    icon: QrCode,
    description: "Generate, manage & export packaging codes",
  },
  {
    name: "Universal Barcodes",
    href: "/admin/barcodes",
    icon: BarcodeIcon,
    description: "GS1 EAN-13 retail barcodes",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Consumer scans & metrics",
  },
  {
    name: "Feedback",
    href: "/admin/feedback",
    icon: MessageSquare,
    description: "Customer reviews & ratings",
  },
];

interface AdminSidebarProps {
  activeTab?: string;
  onClose?: () => void;
}

export default function AdminSidebar({ activeTab, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    adminLogout();
    router.push("/admin/login");
  };

  const handleNavClick = (href: string) => {
    if (onClose) onClose();
    router.push(href);
  };

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between min-h-screen sticky top-0 h-screen z-30">
      {/* Top Header / Branding */}
      <div className="flex flex-col">
        <div className="h-16 px-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2.5"
            onClick={() => handleNavClick("/admin")}
          >
            <img
              src="/images/kharisfoods-removebg-preview.png"
              alt="Kharis Foods"
              className="h-7 w-auto"
            />
            <div className="flex flex-col">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm leading-tight tracking-tight">
                Kharis Foods
              </span>
              <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 leading-tight">
                Operations Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          <div className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Workspaces
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-brand-50 dark:bg-brand-900/70 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-sm"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? "text-brand-700 dark:text-brand-400"
                        : "text-neutral-400 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Utilities */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
        <div className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
            <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Theme</span>
          </div>
          <ThemeToggle />
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onClose?.()}
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            <span>Customer Website</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}