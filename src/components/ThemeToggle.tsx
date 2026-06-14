"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

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

  if (!mounted) return <div className="w-9 h-9" />;

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  // Find the icon for the currently selected theme setting
  const SelectedIcon =
    theme === "light" ? Sun :
    theme === "dark" ? Moon :
    Monitor;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-kharis-green-500 hover:bg-kharis-green-50 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-2 focus-visible:outline-kharis-green-500"
        aria-label="Select theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <SelectedIcon className="w-4 h-4 animate-in fade-in zoom-in duration-200" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-1.5 w-32 origin-top-right rounded-xl border border-kharis-green-100 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md p-1 shadow-lg shadow-neutral-200/50 dark:shadow-black/50 z-50 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
          >
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setTheme(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors text-left font-medium cursor-pointer
                    ${
                      isSelected
                        ? "text-kharis-green-800 dark:text-kharis-gold-400 bg-kharis-green-50 dark:bg-neutral-900"
                        : "text-kharis-green-600 dark:text-neutral-400 hover:bg-kharis-green-50/50 dark:hover:bg-neutral-900/50"
                    }
                  `}
                  role="menuitem"
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-kharis-green-600 dark:text-kharis-gold-500" : ""}`} />
                  {opt.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
