import type { RichSection as RichSectionType } from "@/types";

export default function SectionBody({ section }: { section: RichSectionType }) {
  if (section.type === "paragraph" && section.body) {
    return (
      <p className="text-sm text-kharis-green-700 leading-relaxed whitespace-pre-line">
        {section.body}
      </p>
    );
  }

  if (section.type === "list" && section.items) {
    return (
      <ul className="space-y-1.5">
        {section.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-kharis-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-kharis-gold-500 mt-1.5 shrink-0" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (section.type === "steps" && section.steps) {
    return (
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
    );
  }

  if (section.type === "columns" && section.columns) {
    return (
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
            {col.note && (
              <p className="mt-1 text-xs text-kharis-green-500 italic">{col.note}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === "table" && section.rows) {
    return (
      <div className="bg-kharis-green-50 rounded-xl overflow-hidden divide-y divide-kharis-green-100">
        {section.rows.map((row, i) => (
          <div key={i} className="flex items-start justify-between px-4 py-3">
            <span className="text-sm font-medium text-kharis-green-700">{row.label}</span>
            <span className="text-sm text-kharis-green-900 text-right max-w-[60%]">{row.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
