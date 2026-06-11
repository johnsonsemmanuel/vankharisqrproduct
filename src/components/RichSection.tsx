"use client";

import { motion } from "framer-motion";
import { RichSection as RichSectionType } from "@/types";

interface RichSectionProps {
  section: RichSectionType;
  index: number;
}

export default function RichSection({ section, index }: RichSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-kharis-green-100 last:border-b-0"
    >
      <div className="px-5 py-6">
        <h3 className="text-base font-bold text-kharis-green-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-kharis-gold-500 rounded-full inline-block" />
          {section.title}
        </h3>

        {section.type === "paragraph" && section.body && (
          <p className="text-sm text-kharis-green-700 leading-relaxed whitespace-pre-line">
            {section.body}
          </p>
        )}

        {section.type === "list" && section.items && (
          <ul className="space-y-1.5">
            {section.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-kharis-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-kharis-gold-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {section.type === "steps" && section.steps && (
          <div className="space-y-3">
            {section.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-6 h-6 rounded-full bg-kharis-green-700 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  {i < section.steps!.length - 1 && (
                    <div className="w-px flex-1 bg-kharis-green-200" />
                  )}
                </div>
                <div className="pb-2">
                  {step.title && (
                    <h4 className="text-sm font-bold text-kharis-green-800">{step.title}</h4>
                  )}
                  <p className="text-sm text-kharis-green-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {section.type === "columns" && section.columns && (
          <div className="space-y-4">
            {section.columns.map((col, i) => (
              <div key={i}>
                <h4 className="text-sm font-bold text-kharis-green-700 mb-1.5">{col.heading}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {col.items.map((item, j) => (
                    <span
                      key={j}
                      className="inline-block px-2.5 py-1 bg-kharis-green-50 text-sm text-kharis-green-700 rounded-lg"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {section.type === "table" && section.rows && (
          <div className="bg-kharis-green-50 rounded-xl overflow-hidden divide-y divide-kharis-green-100">
            {section.rows.map((row, i) => (
              <div key={i} className="flex items-start justify-between px-4 py-3">
                <span className="text-sm font-medium text-kharis-green-700">{row.label}</span>
                <span className="text-sm text-kharis-green-900 text-right max-w-[60%]">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
