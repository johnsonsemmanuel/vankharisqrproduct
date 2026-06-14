"use client";

interface LanguageSelectorProps {
  currentLocale: string;
  onChange: (locale: string) => void;
}

export default function LanguageSelector({ currentLocale, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center bg-kharis-green-50/50 dark:bg-neutral-900 rounded-lg p-0.5 border border-kharis-green-100 dark:border-neutral-800">
      <button
        type="button"
        onClick={() => onChange("en")}
        className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
          currentLocale === "en"
            ? "bg-white dark:bg-neutral-800 text-kharis-green-700 dark:text-kharis-gold-400 shadow-sm"
            : "text-kharis-green-600 dark:text-neutral-400 hover:text-kharis-green-800 dark:hover:text-neutral-200"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange("fr")}
        className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
          currentLocale === "fr"
            ? "bg-white dark:bg-neutral-800 text-kharis-green-700 dark:text-kharis-gold-400 shadow-sm"
            : "text-kharis-green-600 dark:text-neutral-400 hover:text-kharis-green-800 dark:hover:text-neutral-200"
        }`}
      >
        FR
      </button>
    </div>
  );
}
