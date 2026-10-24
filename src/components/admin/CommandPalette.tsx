"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Search, Zap, ExternalLink, QrCode, Package, BarChart3, Settings, Download, ShieldCheck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

interface Command {
  id: string;
  label: string;
  description: string;
  shortcut?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  section: string;
}

export default function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: "new-batch",
      label: "New Batch Registration",
      description: "Create a new traceable batch with QR code",
      shortcut: "⌘N",
      icon: QrCode,
      section: "QR Studio",
      action: () => router.push("/admin/qr/studio"),
    },
    {
      id: "view-batches",
      label: "View All Batches",
      description: "Browse and manage batch registry",
      shortcut: "⌘B",
      icon: Package,
      section: "QR Studio",
      action: () => router.push("/admin/qr/batches"),
    },
    {
      id: "export-csv",
      label: "Export Batches CSV",
      description: "Download complete batch data as spreadsheet",
      shortcut: "⌘E",
      icon: Download,
      section: "QR Studio",
      action: () => router.push("/admin/qr/export"),
    },
    {
      id: "manage-presets",
      label: "Manage Material Presets",
      description: "Configure packaging substrates & colors",
      shortcut: "⌘P",
      icon: Settings,
      section: "QR Studio",
      action: () => router.push("/admin/qr/presets"),
    },
    {
      id: "analytics",
      label: "Scan Analytics",
      description: "View consumer scan metrics & trends",
      icon: BarChart3,
      section: "Analytics",
      action: () => router.push("/admin/analytics"),
    },
    {
      id: "feedback",
      label: "Customer Feedback",
      description: "Review ratings & comments",
      icon: ShieldCheck,
      section: "Analytics",
      action: () => router.push("/admin/feedback"),
    },
    {
      id: "barcodes",
      label: "Universal Barcodes",
      description: "Generate GS1 EAN-13 retail barcodes",
      icon: ExternalLink,
      section: "Barcodes",
      action: () => router.push("/admin/barcodes"),
    },
    {
      id: "home",
      label: "Go to Dashboard",
      description: "Return to operations console overview",
      icon: Zap,
      section: "Navigation",
      action: () => router.push("/admin"),
    },
  ];

  const filteredCommands = commands
    .filter((cmd) => {
      const q = query.toLowerCase();
      return (
        cmd.label.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.section.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const aMatch = a.label.toLowerCase().startsWith(query.toLowerCase());
      const bMatch = b.label.toLowerCase().startsWith(query.toLowerCase());
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      executeCommand(filteredCommands[selectedIndex]);
    }
  };

  const executeCommand = (cmd: Command) => {
    cmd.action();
    close();
  };

  const openPalette = () => {
    setOpen(true);
    setQuery("");
    setSelectedIndex(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const handleGlobalOpen = () => openPalette();
    const handleGlobalClose = () => close();

    window.addEventListener("open-command-palette", handleGlobalOpen);
    window.addEventListener("close-all-modals", handleGlobalClose);

    return () => {
      window.removeEventListener("open-command-palette", handleGlobalOpen);
      window.removeEventListener("close-all-modals", handleGlobalClose);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          close();
        } else {
          openPalette();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={close} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-2xl mx-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl overflow-hidden"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="w-full px-12 py-4 pl-12 text-base border-b border-neutral-200 dark:border-neutral-700 bg-transparent focus:outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded">
            ⌘K
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 dark:text-neutral-400">
              No commands found
            </div>
          ) : (
            <CommandList
              commands={filteredCommands}
              selectedIndex={selectedIndex}
              onSelect={executeCommand}
            />
          )}
        </div>

        <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 text-center">
          <kbd className="px-2 py-1 text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded mr-2">↑</kbd>
          <kbd className="px-2 py-1 text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded mr-2">↓</kbd>
          <kbd className="px-2 py-1 text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded mr-2">⏎</kbd>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Navigate · Select · </span>
          <kbd className="px-2 py-1 text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded">Esc</kbd>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Close</span>
        </div>
      </motion.div>
    </div>
  );
}

function CommandList({
  commands,
  selectedIndex,
  onSelect,
}: {
  commands: Command[];
  selectedIndex: number;
  onSelect: (cmd: Command) => void;
}) {
  const sections = new Map<string, Command[]>();
  commands.forEach((cmd) => {
    if (!sections.has(cmd.section)) {
      sections.set(cmd.section, []);
    }
    sections.get(cmd.section)!.push(cmd);
  });

  return (
    <div>
      {Array.from(sections.entries()).map(([section, cmds], sectionIndex) => (
        <div key={section}>
          <div className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800">
            {section}
          </div>
          {cmds.map((cmd, cmdIndex) => {
            const globalIndex = commands.indexOf(cmd);
            const isSelected = globalIndex === selectedIndex;
            const Icon = cmd.icon;

            return (
              <button
                key={cmd.id}
                onClick={() => onSelect(cmd)}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                  isSelected
                    ? "bg-brand-50 dark:bg-brand-900/30 text-brand-900 dark:text-brand-50"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected
                    ? "bg-brand-100 dark:bg-brand-900/50 border border-brand-200 dark:border-brand-700"
                    : "bg-neutral-100 dark:bg-neutral-800"
                }`}>
                  <Icon className={`w-5 h-5 ${isSelected ? "text-brand-700 dark:text-brand-300" : "text-neutral-600 dark:text-neutral-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{cmd.label}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{cmd.description}</div>
                </div>
                {cmd.shortcut && (
                  <kbd className="px-2 py-1 text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded">
                    {cmd.shortcut}
                  </kbd>
                )}
                <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}