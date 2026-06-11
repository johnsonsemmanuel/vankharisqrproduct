"use client";

import { motion } from "framer-motion";
import { RichSection as RichSectionType } from "@/types";
import { getSectionIcon } from "@/lib/section-icons";
import SectionBody from "@/components/SectionBody";

interface RichSectionProps {
  section: RichSectionType;
  index: number;
}

export default function RichSection({ section, index }: RichSectionProps) {
  const Icon = getSectionIcon(section.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-kharis-green-100 dark:border-kharis-green-700 last:border-b-0"
    >
      <div className="px-5 py-6">
        <h3 className="text-base font-bold text-kharis-green-800 dark:text-kharis-green-100 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-kharis-gold-500 rounded-full inline-block shrink-0" />
          <Icon className="w-4 h-4 text-kharis-gold-500 shrink-0" />
          {section.title}
        </h3>
        <SectionBody section={section} />
      </div>
    </motion.div>
  );
}
