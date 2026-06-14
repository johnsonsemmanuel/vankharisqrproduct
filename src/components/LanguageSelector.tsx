"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LanguageSelectorProps {
  currentLocale: string;
  onChange: (locale: string) => void;
}

export default function LanguageSelector({ currentLocale, onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const languages = [
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-2.5 flex items-center gap-1.5 rounded-lg border border-kharis-green-150 dark:border-neutral-800 bg-kharis-green-50/30 dark:bg-neutral-900/30 text-kharis-green-600 dark:text-neutral-300 hover:bg-kharis-green-50 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-2 focus-visible:outline-kharis-green-500 text-xs font-semibold cursor-pointer"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3.5 h-3.5 text-kharis-green-500 dark:text-kharis-gold-500" />
        <span>{currentLocale.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-1.5 w-28 origin-top-right rounded-xl border border-kharis-green-100 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md p-1 shadow-lg shadow-neutral-200/50 dark:shadow-black/50 z-50 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
          >
            {languages.map((lang) => {
              const isSelected = currentLocale === lang.value;
              return (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => {
                    onChange(lang.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left font-medium cursor-pointer
                    ${
                      isSelected
                        ? "text-kharis-green-800 dark:text-kharis-gold-400 bg-kharis-green-50 dark:bg-neutral-900"
                        : "text-kharis-green-600 dark:text-neutral-400 hover:bg-kharis-green-50/50 dark:hover:bg-neutral-900/50"
                    }
                  `}
                  role="menuitem"
                >
                  <span>{lang.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-kharis-green-600 dark:text-kharis-gold-500" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
