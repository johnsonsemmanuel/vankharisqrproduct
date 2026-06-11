import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Kharis Foods — Product Guide",
  description:
    "Scan the QR code on your Kharis Foods product bag to view usage instructions, product details, and more.",
  icons: {
    icon: "/images/kharisfoods-removebg-preview.png",
    apple: "/images/kharisfoods-removebg-preview.png",
  },
  openGraph: {
    title: "Kharis Foods — Product Guide",
    description:
      "Scan the QR code on your Kharis Foods product bag to view usage instructions and product details.",
    siteName: "Kharis Foods",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1b5e20",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh">
        <ThemeProvider>
          <main className="mx-auto max-w-lg min-h-dvh bg-white dark:bg-neutral-950 shadow-sm dark:shadow-black/30">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
