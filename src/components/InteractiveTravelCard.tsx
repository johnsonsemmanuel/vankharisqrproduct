"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface InteractiveTravelCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  actionText: string;
  href: string;
  badge?: string;
  className?: string;
}

export const InteractiveTravelCard = React.forwardRef<
  HTMLDivElement,
  InteractiveTravelCardProps
>(({ title, subtitle, imageUrl, actionText, href, badge, className }, ref) => {
  return (
    <div ref={ref} className={cn("group relative w-full", className)}>
      <Link
        href={href}
        aria-label={`${actionText}: ${title}`}
        className="block overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs transition-all duration-200 hover:border-brand-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          {badge && (
            <span className="absolute left-3 top-3 rounded-sm bg-neutral-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm dark:bg-white dark:text-neutral-900">
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold leading-tight text-neutral-900 group-hover:text-brand-700 dark:text-neutral-100 dark:group-hover:text-brand-300 transition-colors">
              {title}
            </h2>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              {subtitle}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-neutral-800 dark:text-brand-300 dark:group-hover:bg-brand-600 dark:group-hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </div>
  );
});
InteractiveTravelCard.displayName = "InteractiveTravelCard";
