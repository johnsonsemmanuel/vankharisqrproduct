"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Package,
  Barcode as BarcodeIcon,
  BarChart3,
  MessageSquare,
  Moon,
  Sun,
  LayoutDashboard,
  ExternalLink,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Navigation" | "Actions" | "Quick Links";
  icon: React.ComponentType<{ className?: string }>;
  perform: () => void;
}

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CommandPalette({ open: controlledOpen, onOpenChange }: CommandPaletteProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) {
      setQuery("");
      setSelectedIndex(0);
    }
  };

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: "nav-overview",
        title: "Operations Overview",
        subtitle: "Dashboard statistics, recent scans & alerts",
        category: "Navigation",
        icon: LayoutDashboard,
        perform: () => router.push("/admin"),
      },
      {
        id: "nav-studio",
        title: "QR Studio",
        subtitle: "Generate packaging QR codes and register print batches",
        category: "Navigation",
        icon: Package,
        perform: () => router.push("/admin/qr"),
      },
      {
        id: "nav-batches",
        title: "Batch Registry",
        subtitle: "View, edit, and export registered production batches",
        category: "Navigation",
        icon: Package,
        perform: () => router.push("/admin/batches"),
      },
      {
        id: "nav-barcodes",
        title: "Product Barcodes",
        subtitle: "Export retail product barcodes in SVG and PNG formats",
        category: "Navigation",
        icon: BarcodeIcon,
        perform: () => router.push("/admin/barcodes"),
      },
      {
        id: "nav-analytics",
        title: "Scan Analytics",
        subtitle: "Scan volume, devices and product breakdown",
        category: "Navigation",
        icon: BarChart3,
        perform: () => router.push("/admin/analytics"),
      },
      {
        id: "nav-feedback",
        title: "Customer Feedback & Reviews",
        subtitle: "Review satisfaction ratings and customer comments",
        category: "Navigation",
        icon: MessageSquare,
        perform: () => router.push("/admin/feedback"),
      },
      {
        id: "act-theme",
        title: "Toggle Color Theme",
        subtitle: `Switch current theme (currently ${theme || "light"})`,
        category: "Actions",
        icon: theme === "dark" ? Sun : Moon,
        perform: () => setTheme(theme === "dark" ? "light" : "dark"),
      },
      {
        id: "link-store",
        title: "View Consumer Website",
        subtitle: "Open the public product catalog in customer view",
        category: "Quick Links",
        icon: ExternalLink,
        perform: () => window.open("/", "_blank", "noopener,noreferrer"),
      },
    ],
    [router, theme, setTheme]
  );

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(lower) ||
        c.subtitle.toLowerCase().includes(lower) ||
        c.category.toLowerCase().includes(lower)
    );
  }, [commands, query]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
        return;
      }

      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % (filteredCommands.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (i) => (i - 1 + filteredCommands.length) % (filteredCommands.length || 1)
        );
      } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].perform();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredCommands, selectedIndex]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center border-b border-neutral-200 px-4 py-3.5 dark:border-neutral-800">
          <Search className="mr-3 h-5 w-5 shrink-0 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search pages and actions…"
            aria-label="Search commands"
            className="flex-1 bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none dark:text-neutral-100"
            autoFocus
          />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close command palette"
            className="rounded-md p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
              No matching commands or destinations found.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.perform();
                      setOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? "bg-brand-600 text-white"
                        : "text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold leading-tight">
                          {cmd.title}
                        </div>
                        <div
                          className={`mt-0.5 truncate text-xs leading-tight ${
                            isSelected ? "text-white/80" : "text-neutral-500 dark:text-neutral-400"
                          }`}
                        >
                          {cmd.subtitle}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-2.5 text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-neutral-200 bg-white px-1 font-mono dark:border-neutral-700 dark:bg-neutral-800">
                ↑↓
              </kbd>{" "}
              navigate
            </span>
            <span>
              <kbd className="rounded border border-neutral-200 bg-white px-1 font-mono dark:border-neutral-700 dark:bg-neutral-800">
                ↵
              </kbd>{" "}
              select
            </span>
            <span>
              <kbd className="rounded border border-neutral-200 bg-white px-1 font-mono dark:border-neutral-700 dark:bg-neutral-800">
                esc
              </kbd>{" "}
              close
            </span>
          </div>
          <span className="font-medium text-brand-700 dark:text-brand-400">Kharis Console</span>
        </div>
      </div>
    </div>
  );
}
