"use client";

import { motion } from "framer-motion";
import { getSectionIcon } from "@/lib/section-icons";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
}

export default function Section({ title, children, delay = 0 }: SectionProps) {
  const Icon = getSectionIcon(title);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      className="px-4 sm:px-6 py-7 border-b border-neutral-200/80 dark:border-neutral-800 last:border-b-0"
    >
      <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-3.5 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-brand-600 rounded-full inline-block shrink-0" />
        <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
        {title}
      </h2>
      {children}
    </motion.section>
  );
}
