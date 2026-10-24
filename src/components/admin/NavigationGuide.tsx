"use client";

import { useState } from "react";
import { Info, ChevronRight, Keyboard, MousePointer, Command, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface NavigationGuideProps {
  title: string;
  description: string;
  shortcuts?: { key: string; description: string }[];
  steps?: { number: number; title: string; description: string; icon?: React.ReactNode }[];
  tips?: string[];
}

export function NavigationGuide({
  title,
  description,
  shortcuts = [],
  steps = [],
  tips = [],
}: NavigationGuideProps) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 text-xs"
      >
        <Info className="w-4 h-4" />
        Show Guide
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 rounded-2xl p-5 mb-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/50 border border-brand-300 dark:border-brand-700 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-brand-700 dark:text-brand-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-900 dark:text-brand-50">{title}</h3>
            <p className="text-xs text-brand-700 dark:text-brand-300 mt-0.5">{description}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close guide">
          <ChevronRight className="w-4 h-4 rotate-90" />
        </Button>
      </div>

      {(shortcuts.length > 0 || steps.length > 0 || tips.length > 0) && (
        <div className="mt-4 space-y-4">
          {shortcuts.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5" />
                Keyboard Shortcuts
              </h4>
              <div className="flex flex-wrap gap-2">
                {shortcuts.map((s, i) => (
                  <kbd key={i} className="px-2.5 py-1.5 text-[10px] font-mono bg-white dark:bg-neutral-900 border border-brand-200 dark:border-brand-800 rounded-lg text-brand-800 dark:text-brand-200">
                    {s.key}
                  </kbd>
                ))}
              </div>
            </div>
          )}

          {steps.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Quick Steps
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {steps.map((step) => (
                  <div key={step.number} className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-brand-100 dark:border-brand-800">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/50 border border-brand-300 dark:border-brand-700 flex items-center justify-center text-[10px] font-bold text-brand-700 dark:text-brand-300">
                        {step.number}
                      </span>
                      <h5 className="font-bold text-brand-900 dark:text-brand-50 text-xs">{step.title}</h5>
                    </div>
                    {step.icon && (
                      <div className="text-brand-600 dark:text-brand-400 mb-1">{step.icon}</div>
                    )}
                    <p className="text-[10px] text-brand-700 dark:text-brand-300">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tips.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Pro Tips
              </h4>
              <ul className="space-y-1.5">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[10px] text-brand-700 dark:text-brand-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:text-brand-400 mt-1.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Pre-configured guides for each admin section
export const adminGuides = {
  qrOverview: {
    title: "QR & Barcode Studio Overview",
    description: "Central hub for all packaging code operations. Access studios, registries, and exports from here.",
    shortcuts: [
      { key: "⌘N", description: "New Batch" },
      { key: "⌘B", description: "Batch Registry" },
      { key: "⌘E", description: "Bulk Export" },
      { key: "⌘P", description: "Manage Presets" },
    ],
    steps: [
      { number: 1, title: "QR Studio", description: "Generate single QR codes with custom materials & colors", icon: <Zap className="w-4 h-4" /> },
      { number: 2, title: "Batch Registry", description: "Manage all registered batches with inline editing", icon: <ShieldCheck className="w-4 h-4" /> },
      { number: 3, title: "Presets", description: "Configure packaging materials & color presets", icon: <Command className="w-4 h-4" /> },
      { number: 4, title: "Bulk Export", description: "Download CSV, QR packages, or print sheets", icon: <MousePointer className="w-4 h-4" /> },
    ],
    tips: [
      "Use ⌘K anywhere to open the command palette for instant navigation",
      "Batch table supports multi-select for bulk operations",
      "Auto-generate batch codes with the 'Auto' button in QR Studio",
    ],
  },

  barcodeStudio: {
    title: "Universal Barcode Studio",
    description: "Generate GS1-compliant EAN-13 retail barcodes for supermarket POS and supply chain.",
    shortcuts: [
      { key: "⌘N", description: "New Batch" },
      { key: "⌘B", description: "Batch Registry" },
      { key: "⌘K", description: "Command Palette" },
    ],
    steps: [
      { number: 1, title: "Select Product", description: "Choose from product catalog or search by name/SKU/GTIN", icon: <MousePointer className="w-4 h-4" /> },
      { number: 2, title: "Enter GTIN", description: "Input 12 or 13 digits — check digit auto-calculated", icon: <Zap className="w-4 h-4" /> },
      { number: 3, title: "Validate", description: "Green = valid EAN-13 format ready for export", icon: <ShieldCheck className="w-4 h-4" /> },
      { number: 4, title: "Export", description: "Vector SVG for print or High-Res PNG (1200px)", icon: <MousePointer className="w-4 h-4" /> },
    ],
    tips: [
      "EAN-13 barcodes include human-readable text below for manual entry",
      "PNG exports at 4x scale (1200px) with crisp edges for optical scanners",
      "SVG is vector-based for infinite scaling without quality loss",
      "Auto-loads product GTIN when selecting from catalog",
    ],
  },

  batchRegistry: {
    title: "Batch Registry",
    description: "Manage traceable print runs with inline editing, faceted search, and bulk operations.",
    shortcuts: [
      { key: "⌘N", description: "New Batch" },
      { key: "⌘K", description: "Command Palette" },
      { key: "Escape", description: "Close modals/editing" },
    ],
    steps: [
      { number: 1, title: "Search & Filter", description: "Find batches by product, material, status, or date range", icon: <MousePointer className="w-4 h-4" /> },
      { number: 2, title: "Inline Edit", description: "Click Edit on any row to modify quantity or material", icon: <Zap className="w-4 h-4" /> },
      { number: 3, title: "Bulk Actions", description: "Select multiple rows for CSV/ZIP export or delete", icon: <ShieldCheck className="w-4 h-4" /> },
      { number: 4, title: "Sort Columns", description: "Click column headers to sort ascending/descending", icon: <Command className="w-4 h-4" /> },
    ],
    tips: [
      "Shift+Click to select multiple consecutive rows",
      "Status badge: Green = Active (scanned), Gray = Pending (no scans)",
      "Export presets in the Export page for common workflows",
      "Use date filters to find batches from specific production runs",
    ],
  },

  analytics: {
    title: "Scan Analytics",
    description: "Real-time consumer engagement metrics, device breakdowns, and feedback trends.",
    shortcuts: [
      { key: "⌘K", description: "Command Palette" },
    ],
    steps: [
      { number: 1, title: "Overview Cards", description: "Total scans, products, top product, avg rating at a glance", icon: <Zap className="w-4 h-4" /> },
      { number: 2, title: "Product Breakdown", description: "Horizontal bars show scans per product with counts", icon: <MousePointer className="w-4 h-4" /> },
      { number: 3, title: "Time Series", description: "Daily scan chart with hover details", icon: <Command className="w-4 h-4" /> },
      { number: 4, title: "Device/Browser/OS", description: "Three-column breakdown of consumer hardware", icon: <ShieldCheck className="w-4 h-4" /> },
    ],
    tips: [
      "Click Refresh button to pull latest data without page reload",
      "Export Report downloads full JSON for external analysis",
      "Feedback section shows star ratings and written comments",
      "Recent scans table includes device, browser, OS, and timestamp",
    ],
  },

  feedback: {
    title: "Customer Feedback",
    description: "Verified consumer cooking ratings and preparation feedback from product scans.",
    shortcuts: [
      { key: "⌘K", description: "Command Palette" },
    ],
    steps: [
      { number: 1, title: "Summary Stats", description: "Total entries, average rating, top product, peak rating", icon: <Zap className="w-4 h-4" /> },
      { number: 2, title: "Product Ratings", description: "Star visualization with average score and review count", icon: <MousePointer className="w-4 h-4" /> },
      { number: 3, title: "Recent Feedback", description: "Expandable cards with ratings, dates, and comments", icon: <Command className="w-4 h-4" /> },
    ],
    tips: [
      "All feedback comes from verified product scans only",
      "Ratings are 1-5 stars with optional written comments",
      "Use Refresh to check for new submissions",
      "Top product section highlights best-performing SKU",
    ],
  },
};

export default NavigationGuide;