"use client";

import { motion } from "framer-motion";
import { UsageStep } from "@/types";

interface UsageGuideProps {
  steps: UsageStep[];
}

export default function UsageGuide({ steps }: UsageGuideProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <motion.div
          key={step.step}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="flex gap-4"
        >
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-kharis-green-700 dark:bg-neutral-700 text-white text-sm font-bold flex items-center justify-center">
              {step.step}
            </div>
            {i < steps.length - 1 && (
              <div className="w-px flex-1 bg-kharis-green-200 dark:bg-neutral-800 mt-1" />
            )}
          </div>
          <div className="pb-4">
            <h3 className="text-base font-bold text-kharis-green-800 dark:text-neutral-100">
              {step.title}
            </h3>
            <p className="mt-1 text-sm text-kharis-green-600 dark:text-neutral-200 leading-relaxed">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
