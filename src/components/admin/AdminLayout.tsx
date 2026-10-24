"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import CommandPalette from "@/components/CommandPalette";

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileSidebarOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-dvh bg-neutral-50 dark:bg-neutral-950">
      {/* Persistent desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <AdminSidebar />
      </aside>

      {/* Mobile drawer — fallback only, the console is designed for desktop */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${mobileSidebarOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileSidebarOpen}
        inert={!mobileSidebarOpen}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
            mobileSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileSidebarOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-64 shadow-2xl transition-transform duration-200 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar onClose={() => setMobileSidebarOpen(false)} />
        </div>
      </div>

      <div className="flex min-h-dvh flex-col lg:pl-64">
        <AdminHeader
          pathname={pathname}
          onMenuClick={() => setMobileSidebarOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
