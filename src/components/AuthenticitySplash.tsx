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
        const completeTimer = setTimeout(() => {
          onComplete();
        }, 1400);
        return () => clearTimeout(completeTimer);
      }, 1600);
      return () => clearTimeout(checkTimer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
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
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/20 border-t-white"
                  >
                    <ShieldCheck className="h-9 w-9 text-white" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg font-semibold text-white"
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
                  exit={{ scale: 1.1, opacity: 0 }}
                  transition={{ type: "spring", damping: 18, stiffness: 320 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 400, delay: 0.05 }}
                    className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-500 shadow-2xl shadow-brand-500/50"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 10, stiffness: 400, delay: 0.2 }}
                    >
                      <Check className="h-12 w-12 text-white stroke-[3]" />
                    </motion.div>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold text-white"
                  >
                    Authentic Vankharis Product
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-1.5 text-sm text-white/80"
                  >
                    Verification Complete
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
