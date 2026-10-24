"use client";

import { Menu, Search, ExternalLink } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface AdminHeaderProps {
  pathname: string;
  onMenuClick: () => void;
  onOpenPalette: () => void;
}

const sections = [
  { href: "/admin/qr", label: "QR Studio" },
  { href: "/admin/batches", label: "Batch Registry" },
  { href: "/admin/barcodes", label: "Product Barcodes" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/feedback", label: "Customer Feedback" },
];

function currentSection(pathname: string) {
  return sections.find(
    (section) => pathname === section.href || pathname.startsWith(`${section.href}/`)
  );
}

export default function AdminHeader({ pathname, onMenuClick, onOpenPalette }: AdminHeaderProps) {
  const section = currentSection(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="flex min-w-0 flex-1 items-center gap-2 text-sm" aria-label="Breadcrumb">
          <Link
            href="/admin"
            className="font-medium text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            Operations
          </Link>
          {section && (
            <>
              <span className="text-neutral-300 dark:text-neutral-600">/</span>
              <span className="truncate font-semibold text-neutral-900 dark:text-neutral-100">
                {section.label}
              </span>
            </>
          )}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenPalette}
            className="hidden items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-200 sm:flex"
            aria-label="Search the console"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="rounded border border-neutral-200 bg-white px-1.5 font-mono text-[10px] text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500">
              ⌘K
            </kbd>
          </button>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 sm:flex"
          >
            Live site
            <ExternalLink className="h-3 w-3" />
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
