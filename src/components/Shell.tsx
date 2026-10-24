"use client";

import { usePathname } from "next/navigation";
import ThemeProvider from "@/components/ThemeProvider";
import RegisterSW from "@/components/RegisterSW";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <ThemeProvider>
      <RegisterSW />
      {isAdmin ? (
        <div className="w-full min-h-dvh bg-gray-50 dark:bg-neutral-950">
          {children}
        </div>
      ) : (
        <main className="mx-auto max-w-lg min-h-dvh bg-white dark:bg-neutral-950 shadow-sm dark:shadow-black/30">
          {children}
        </main>
      )}
    </ThemeProvider>
  );
}
