"use client";

import { motion } from "framer-motion";

interface SpecsTableProps {
  specs: Record<string, string>;
}

export default function SpecsTable({ specs }: SpecsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-kharis-green-50 rounded-xl overflow-hidden divide-y divide-kharis-green-100"
    >
      {Object.entries(specs).map(([key, val]) => (
        <div key={key} className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium text-kharis-green-700">{key}</span>
          <span className="text-sm text-kharis-green-900 font-semibold text-right max-w-[60%]">
            {val}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
