"use client";

import { ShieldCheck, CheckCircle2, AlertTriangle, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

interface AuthenticityCardProps {
  batch: string | null;
}

export default function AuthenticityCard({ batch }: AuthenticityCardProps) {
  // If no batch is provided, show a general guide verification banner
  if (!batch) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-5 mt-4 p-3 rounded-xl border bg-kharis-green-50/40 border-kharis-green-100 dark:bg-neutral-900/20 dark:border-neutral-800/50"
      >
        <div className="flex items-center gap-2.5">
          <BadgeCheck className="w-5 h-5 text-kharis-green-700 dark:text-kharis-gold-400 shrink-0" />
          <div>
            <h3 className="text-xs font-bold text-kharis-green-800 dark:text-neutral-200">
              Verified Product Guide
            </h3>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              This is the official instructions and cooking guide portal for Kharis Foods.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const isValidFormat = batch.startsWith("KF-");

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mx-5 mt-4 p-4 rounded-xl border ${
        isValidFormat
          ? "bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/50"
          : "bg-amber-50/70 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/50"
      }`}
    >
      <div className="flex gap-3">
        <div className="shrink-0 mt-0.5">
          {isValidFormat ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          )}
        </div>
        <div>
          <h3
            className={`text-sm font-bold ${
              isValidFormat
                ? "text-emerald-800 dark:text-emerald-300"
                : "text-amber-800 dark:text-amber-300"
            }`}
          >
            {isValidFormat ? "Authentic Product Verified" : "Unverified Batch Format"}
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
            {isValidFormat
              ? `This package has been verified as an authentic Kharis Foods product from batch ${batch}.`
              : "This QR code contains an unverified batch number. Please verify the source of this product."}
          </p>
          {isValidFormat && (
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 pt-2.5 border-t border-emerald-100 dark:border-emerald-900/50">
              <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                Freshness Certified
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                100% Quality Checked
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
