"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function QrGrid() {
  const cells = [
    [1,1,1,1,1,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,0,1,0,1,0,0,1,1,1,1,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1],
    [1,1,1,1,1,0,1,0,0,1,0,0,1,0,0,0,1,1,0,1,1],
    [0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0],
    [1,1,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,1,0,1,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,1,0,0],
    [1,0,1,0,1,1,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0],
    [1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,0,1,0,1,1],
    [0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,1,1,1,0,0,0,0,0,1,1,0,1,1,1,0,1,1,1,1,0],
    [0,0,0,0,1,0,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0],
    [0,1,1,1,0,0,0,0,1,0,1,0,0,0,1,1,1,0,1,1,0],
    [1,0,1,1,1,1,0,1,1,1,0,1,1,0,1,0,1,1,0,0,1],
    [1,1,0,1,0,0,1,1,1,0,1,1,1,1,0,0,1,0,0,1,1],
    [1,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,1,0],
    [0,1,0,0,1,0,0,1,1,0,0,1,0,1,0,0,0,1,0,1,0],
    [1,1,1,0,0,1,1,0,0,0,0,0,1,1,1,0,0,1,1,0,1],
    [1,0,0,0,1,0,1,0,1,1,1,0,0,0,1,0,1,0,0,0,1],
    [1,1,1,1,0,1,0,1,0,0,0,1,0,0,1,1,0,0,0,1,1],
  ];

  return (
    <div
      className="absolute inset-0 flex items-center justify-center opacity-[0.06]"
      aria-hidden
    >
      <div className="flex flex-wrap w-[178px]" style={{ gap: "1.5px" }}>
        {cells.flat().map((v, i) => (
          <div
            key={i}
            className={`w-[7px] h-[7px] rounded-[1px] ${
              v ? "bg-white" : "bg-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ScanOverlay({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-kharis-green-900 flex flex-col items-center justify-center px-6"
    >
      <QrGrid />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center relative z-10"
      >
        <img
          src="/images/kharisfoods-removebg-preview.png"
          alt="Kharis Foods"
          className="h-24 w-auto mx-auto mb-4"
        />
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Kharis Foods
        </h1>
        <p className="text-kharis-green-200 text-sm max-w-xs mx-auto">
          Scan the QR code on your product bag to view usage instructions and product details.
        </p>
        <Button
          onClick={onDone}
          variant="secondary"
          size="lg"
          className="mt-8 rounded-full font-bold"
        >
          Browse Products
        </Button>
      </motion.div>

      {/* Animated scan line */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 80, opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-44 h-px bg-kharis-gold-400/60"
      />
    </motion.div>
  );
}
