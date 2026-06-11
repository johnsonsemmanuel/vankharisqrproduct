"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { getSectionIcon } from "@/lib/section-icons";

interface AccordionProps {
  items: {
    title: string;
    content: React.ReactNode;
  }[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    items.length > 0 ? 0 : null
  );

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const Icon = getSectionIcon(item.title);

        return (
          <div
            key={i}
            className="border-b border-kharis-green-100 dark:border-neutral-800 last:border-b-0"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left active:bg-kharis-green-50 dark:active:bg-neutral-900 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1 h-5 bg-kharis-gold-500 rounded-full inline-block shrink-0" />
                <Icon className="w-4 h-4 text-kharis-gold-500 shrink-0" />
                <h3 className="text-base font-bold text-kharis-green-800 dark:text-neutral-100">
                  {item.title}
                </h3>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-kharis-green-500 dark:text-neutral-300 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
