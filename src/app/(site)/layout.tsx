export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full min-h-dvh bg-white dark:bg-neutral-950">
      {children}
    </main>
  );
}
