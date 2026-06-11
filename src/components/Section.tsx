"use client";

import { motion } from "framer-motion";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
}

export default function Section({ title, children, delay = 0 }: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      className="px-5 py-8 border-b border-kharis-green-100 last:border-b-0"
    >
      <h2 className="text-lg font-bold text-kharis-green-800 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-kharis-gold-500 rounded-full inline-block" />
        {title}
      </h2>
      {children}
    </motion.section>
  );
}
