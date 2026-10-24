"use client";

import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
  global?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const router = useRouter();
  const pathname = usePathname();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrlKey ? (e.ctrlKey || e.metaKey) : true;
        const metaMatch = shortcut.metaKey ? (e.metaKey || e.ctrlKey) : true;
        const shiftMatch = shortcut.shiftKey ? e.shiftKey : true;
        const altMatch = shortcut.altKey ? e.altKey : true;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && metaMatch && shiftMatch && altMatch && keyMatch) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export function useGlobalShortcuts() {
  const router = useRouter();
  const pathname = usePathname();

  const shortcuts = [
    {
      key: "k",
      metaKey: true,
      action: () => {
        window.dispatchEvent(new CustomEvent("open-command-palette"));
      },
      description: "Open command palette",
      global: true,
    },
    {
      key: "n",
      metaKey: true,
      action: () => {
        if (pathname.startsWith("/admin")) {
          router.push("/admin/qr");
        }
      },
      description: "New batch registration",
    },
    {
      key: "b",
      metaKey: true,
      action: () => {
        if (pathname.startsWith("/admin")) {
          router.push("/admin/batches");
        }
      },
      description: "View batch registry",
    },
    {
      key: "e",
      metaKey: true,
      action: () => {
        if (pathname.startsWith("/admin/qr")) {
          router.push("/admin/qr/export");
        }
      },
      description: "Bulk export",
    },
    {
      key: "p",
      metaKey: true,
      action: () => {
        if (pathname.startsWith("/admin/qr")) {
          router.push("/admin/qr/presets");
        }
      },
      description: "Manage presets",
    },
    {
      key: "Escape",
      action: () => {
        window.dispatchEvent(new CustomEvent("close-all-modals"));
      },
      description: "Close modals/panels",
      global: true,
    },
  ];

  useKeyboardShortcuts(shortcuts);
}