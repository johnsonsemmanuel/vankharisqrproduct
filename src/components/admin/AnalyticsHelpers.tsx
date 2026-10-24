"use client";

import { ReactElement } from "react";
import { Hash, Package, TrendingUp, Clock, Star, MessageSquare, Smartphone, Monitor, Tablet } from "lucide-react";

interface SummaryCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}

export function SummaryCard({ icon, label, value, sub }: SummaryCardProps) {
  const Icon = icon;
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="size-3.5 text-gray-400 dark:text-neutral-400" />
        <span className="text-xs text-gray-500 dark:text-neutral-300 font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold text-gray-800 dark:text-neutral-100 truncate">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 dark:text-neutral-400 mt-0.5">{sub}</p>}
    </div>
  );
}

interface DeviceIconProps {
  type: string;
}

export function DeviceIcon({ type }: DeviceIconProps) {
  const cls = "size-4 text-gray-400 dark:text-neutral-400";
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