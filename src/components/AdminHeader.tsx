"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  QrCode,
  BarChart3,
  MessageSquare,
  LogOut,
  Layers,
  ExternalLink,
} from "lucide-react";
import { logout as adminLogout } from "@/lib/admin-auth";
import ThemeToggle from "@/components/ThemeToggle";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "QR & Barcodes", href: "/admin/qr", icon: QrCode },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Feedback", href: "/admin/feedback", icon: MessageSquare },
];

export default function AdminHeader({ title, subtitle }: { title?: string; subtitle?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    adminLogout();
    router.push("/admin");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Page Info */}
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img
              src="/images/kharisfoods-removebg-preview.png"
              alt="Kharis Foods"
              className="h-7 w-auto"
            />
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-neutral-100 text-sm leading-tight tracking-tight">
                Kharis Foods
              </span>
              <span className="text-[10px] font-medium text-gray-500 dark:text-neutral-400 leading-tight">
                Operations Console
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-gray-200 dark:border-neutral-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-kharis-green-50 dark:bg-kharis-green-950/70 text-kharis-green-800 dark:text-kharis-green-300 border border-kharis-green-200 dark:border-kharis-green-800"
                      : "text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-200 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <div className="h-4 w-px bg-gray-200 dark:border-neutral-800 hidden sm:block" />

          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
