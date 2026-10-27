"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Check } from "lucide-react";

interface AuthenticitySplashProps {
  show: boolean;
  onComplete: () => void;
}

export default function AuthenticitySplash({ show, onComplete }: AuthenticitySplashProps) {
  const [stage, setStage] = useState<"checking" | "verified">("checking");

  useEffect(() => {
    if (show) {
      setStage("checking");
      const checkTimer = setTimeout(() => {
        setStage("verified");
      }, 1800);
      return () => clearTimeout(checkTimer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-lg"
        >
          <div className="relative flex flex-col items-center justify-center px-6 text-center">
            <AnimatePresence mode="wait">
              {stage === "checking" && (
                <motion.div
                  key="checking"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-white/10"
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white/60"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute inset-2 rounded-full border-4 border-transparent border-t-white/40"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                      <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg font-semibold text-white tracking-wide"
                  >
                    Checking Authenticity
                  </motion.p>
                </motion.div>
              )}

              {stage === "verified" && (
                <motion.div
                  key="verified"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.05, opacity: 0 }}
                  transition={{ type: "spring", damping: 18, stiffness: 320 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 400, delay: 0.05 }}
                    className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-brand-500 shadow-[0_0_80px_rgba(34,197,94,0.6)]"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 10, stiffness: 400, delay: 0.25 }}
                    >
                      <Check className="h-14 w-14 text-white stroke-[3]" />
                    </motion.div>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="text-xl font-bold text-white"
                  >
                    Authentic Kharis Foods Product
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    onClick={onComplete}
                    className="mt-8 rounded-full bg-white px-10 py-3 text-sm font-semibold text-brand-700 shadow-xl shadow-white/20 transition-transform active:scale-95 hover:scale-105"
                  >
                    OK
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
