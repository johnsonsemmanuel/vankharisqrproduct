"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ScanOverlay({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-kharis-green-900 flex flex-col items-center justify-center px-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-kharis-gold-500 flex items-center justify-center">
          <svg className="w-10 h-10 text-kharis-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Kharis Foods
        </h1>
        <p className="text-kharis-green-200 text-sm max-w-xs mx-auto">
          Scan the QR code on your product bag to view usage instructions and product details.
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onDone}
          className="mt-8 px-8 py-3 bg-kharis-gold-500 text-kharis-green-900 font-bold rounded-full text-sm
            active:bg-kharis-gold-600 transition-colors"
        >
          Browse Products
        </motion.button>
      </motion.div>

      {/* Animated scan line */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 60, opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-40 h-px bg-kharis-gold-400/60"
      />
    </motion.div>
  );
}
