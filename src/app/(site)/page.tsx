"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ScanOverlay from "@/components/ScanOverlay";
import ProductCard from "@/components/ProductCard";
import ThemeToggle from "@/components/ThemeToggle";
import { products } from "@/data/products";
import { ProductCardData } from "@/types";

const cardData: ProductCardData[] = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  tagline: p.tagline,
  image: p.images[0],
  category: p.category,
}));

export default function HomePage() {
  const [showScan, setShowScan] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showScan && <ScanOverlay onDone={() => setShowScan(false)} />}
      </AnimatePresence>

      <div className="min-h-dvh flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xs border-b border-neutral-200/80 dark:border-neutral-800">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/kharisfoods-removebg-preview.png"
                alt="Kharis Foods"
                className="h-8 w-auto"
              />
              <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm tracking-tight">
                Kharis Foods
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Product Guide
              </span>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="flex-1 max-w-5xl w-full mx-auto">
          {/* Intro */}
          <section className="px-4 sm:px-6 pt-8 pb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-tight">
              Our Products
            </h1>
            <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
              Scan the QR code on your product bag for detailed preparation and usage instructions.
            </p>
          </section>

          {/* Product Grid */}
          <section className="px-4 sm:px-6 pb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {cardData.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              &copy; {new Date().getFullYear()} Kharis Foods. All rights reserved.
            </p>
            <p className="mt-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Member of{" "}
              <a
                href="https://vankharis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 dark:text-brand-400 underline underline-offset-2 hover:text-brand-800 dark:hover:text-brand-300 transition-colors"
              >
                Vankharis Limited
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
