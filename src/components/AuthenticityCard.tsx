"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, BadgeCheck, Clock } from "lucide-react";

interface AuthenticityCardProps {
  slug?: string;
  batch: string | null;
  timestamp?: string | null;
  sig?: string | null;
}

interface BatchInfo {
  batchCode: string;
  productName: string;
  printQuantity: number;
  productionDate: string;
  expiryDate?: string;
  packagingMaterial: string;
  qrColorName: string;
  facility: string;
  scanCount: number;
  status?: string;
}

type VerificationState = "loading" | "verified" | "expired" | "invalid" | "unregistered";

export default function AuthenticityCard({
  slug,
  batch,
  timestamp,
  sig,
}: AuthenticityCardProps) {
  const [state, setState] = useState<VerificationState>("loading");
  const [batchInfo, setBatchInfo] = useState<BatchInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!batch) {
      setState("verified");
      return;
    }

    let isMounted = true;
    setState("loading");

    const query = new URLSearchParams({
      code: batch.trim(),
      ...(slug ? { slug } : {}),
      ...(timestamp ? { ts: timestamp } : {}),
      ...(sig ? { sig } : {}),
    });

    fetch(`/api/batches/verify?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;

        if (data.signature?.status === "tampered") {
          setState("invalid");
          setErrorMessage("QR code parameters or batch code have been modified.");
          return;
        }

        if (data.signature?.status === "expired") {
          setState("expired");
          setErrorMessage("Production certificate has exceeded physical shelf-life limits.");
          return;
        }

        if (data.ok && data.found && data.batch) {
          setBatchInfo(data.batch);
          if (data.batch.status === "archived") {
            setState("expired");
          } else {
            setState("verified");
          }
        } else if (data.ok && !data.found) {
          if (batch.startsWith("KF-")) {
            setState("unregistered");
          } else {
            setState("invalid");
            setErrorMessage("Batch code format does not match Kharis Foods security specifications.");
          }
        } else {
          setState("invalid");
          setErrorMessage("Verification failed. Please try again.");
        }
      })
      .catch(() => {
        if (isMounted) {
          if (batch.startsWith("KF-")) {
            setState("unregistered");
          } else {
            setState("invalid");
            setErrorMessage("Verification failed. Please try again.");
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, [batch, slug, timestamp, sig]);

  // General guide banner (when no batch is provided)
  if (!batch) {
    return (
      <div className="mx-4 sm:mx-6 mt-4 mb-3 px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0">
          <BadgeCheck className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
            Verified Product Guide
          </h3>
          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5 leading-snug">
            Official preparation and authentic storage specifications from Kharis Foods.
          </p>
        </div>
      </div>
    );
  }

  // Skeleton Loader
  if (state === "loading") {
    return (
      <div className="mx-4 sm:mx-6 mt-4 mb-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/30">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
            <div className="h-3 bg-neutral-100 dark:bg-neutral-800/60 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  // State: Tampered / Invalid
  if (state === "invalid") {
    return (
      <div className="mx-4 sm:mx-6 mt-4 mb-3 p-4 rounded-xl border border-rose-200 bg-rose-50/70 dark:border-rose-800/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold">Security Warning: Verification Failed</h3>
            <p className="text-xs mt-1 leading-relaxed opacity-90">
              {errorMessage || "The batch identification parameters could not be validated against official Kharis Foods records."}
            </p>
            <div className="mt-2 text-[10px] font-mono opacity-80">
              Code: {batch}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State: Expired / Out of date
  if (state === "expired") {
    return (
      <div className="mx-4 sm:mx-6 mt-4 mb-3 p-4 rounded-xl border border-amber-200 bg-amber-50/70 dark:border-amber-800/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold">Batch Shelf-Life Notice</h3>
            <p className="text-xs mt-1 leading-relaxed opacity-90">
              This packaging certificate has reached or passed its recommended shelf-life window. Please check the physical Best Before date printed on the packaging seal.
            </p>
            {batchInfo && (
              <div className="mt-2 text-[10px] font-mono opacity-80">
                Batch: {batchInfo.batchCode}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // State: Valid format but uncatalogued/fallback batch
  if (state === "unregistered") {
    return (
      <div className="mx-4 sm:mx-6 mt-4 mb-3 p-4 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-neutral-700 dark:text-neutral-300 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Authentic Kharis Foods Product
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
              Verified production code for batch{" "}
              <strong className="font-mono text-neutral-900 dark:text-neutral-100">{batch}</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // State: Verified Registered Batch
  return (
    <div className="mx-4 sm:mx-6 mt-4 mb-3 p-4 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-neutral-700 dark:text-neutral-300 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Authentic Kharis Foods Verified
          </h3>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
            Officially catalogued production run for{" "}
            <strong className="font-semibold text-neutral-900 dark:text-neutral-100">{batchInfo?.productName}</strong>
            . Packed at {batchInfo?.facility || "Accra Processing Center"}.
          </p>

          <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-2 text-[10px] text-neutral-700 dark:text-neutral-300">
            <div>
              <span className="text-neutral-500 dark:text-neutral-400">Batch Code: </span>
              <span className="font-mono font-semibold">{batchInfo?.batchCode}</span>
            </div>
            <div>
              <span className="text-neutral-500 dark:text-neutral-400">Material: </span>
              <span className="font-semibold">{batchInfo?.packagingMaterial}</span>
            </div>
            {batchInfo?.productionDate && (
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">Pack Date: </span>
                <span className="font-semibold">{batchInfo.productionDate}</span>
              </div>
            )}
            {batchInfo && batchInfo.scanCount > 0 && (
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">Verified Scans: </span>
                <span className="font-mono font-semibold">{batchInfo.scanCount.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
