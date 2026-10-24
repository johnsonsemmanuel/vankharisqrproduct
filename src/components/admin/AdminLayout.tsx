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

      {/* Mobile slide-up sheet for full menu / More */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${mobileSidebarOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileSidebarOpen}
        inert={!mobileSidebarOpen}
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            mobileSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileSidebarOpen(false)}
        />
        <div
          className={`absolute inset-x-0 bottom-0 w-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform ${
            mobileSidebarOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <AdminSidebar variant="sheet" onClose={() => setMobileSidebarOpen(false)} />
        </div>
      </div>

      {/* Persistent Mobile App Bottom Navigation Bar */}
      <AdminSidebar
        variant="bottom-bar"
        moreOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onToggleMore={() => setMobileSidebarOpen((prev) => !prev)}
      />

      <div className="flex min-h-dvh flex-col lg:pl-64">
        <AdminHeader
          pathname={pathname}
          onOpenPalette={() => setPaletteOpen(true)}
        />
        <main className="flex-1 px-4 pt-5 pb-24 sm:px-6 lg:px-8 lg:py-6">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
