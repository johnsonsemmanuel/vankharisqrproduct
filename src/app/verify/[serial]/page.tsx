"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, XCircle } from "lucide-react";
import Link from "next/link";

type Status = "loading" | "valid" | "already_used" | "invalid";

export default function VerifySerialPage() {
  const params = useParams<{ serial: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const serial = params?.serial;
    if (!serial) return;
    fetch(`/api/serials/verify?serial=${encodeURIComponent(serial)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.valid) {
          setStatus("valid");
          setData(json.serial);
        } else if (json.reason === "already_used") {
          setStatus("already_used");
        } else {
          setStatus("invalid");
        }
      })
      .catch(() => setStatus("invalid"));
  }, [params?.serial]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {status === "loading" && (
          <div className="text-center p-8">
            <div className="animate-spin h-12 w-12 border-4 border-brand-200 border-t-brand-600 rounded-full mx-auto mb-4" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Verifying security code...</p>
          </div>
        )}

        {status === "valid" && (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border-2 border-brand-500 p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Authentic Product</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">This product has been verified as genuine.</p>
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Product</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{data?.productName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Batch</span>
                <span className="font-mono text-neutral-900 dark:text-white">{data?.batchCode}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Security Code</span>
                <span className="font-mono text-neutral-900 dark:text-white">{data?.serialCode}</span>
              </div>
            </div>
            <Link
              href={`/product/${data?.productSlug}`}
              className="inline-block w-full py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
            >
              View Product Details
            </Link>
          </div>
        )}

        {status === "already_used" && (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border-2 border-amber-500 p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Code Already Verified</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">This security code has been used before. It may be counterfeit or duplicated.</p>
          </div>
        )}

        {status === "invalid" && (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border-2 border-red-500 p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Invalid Code</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">This security code is not valid or does not exist in our system.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
