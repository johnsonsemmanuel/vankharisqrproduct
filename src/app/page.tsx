"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ScanOverlay from "@/components/ScanOverlay";
import ProductCard from "@/components/ProductCard";
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

      <div className="min-h-dvh">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-kharis-green-100">
          <div className="flex items-center justify-between px-5 h-14">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-kharis-green-800 flex items-center justify-center">
                <span className="text-kharis-gold-400 text-xs font-extrabold">K</span>
              </div>
              <span className="font-bold text-kharis-green-800 text-sm">Kharis Foods</span>
            </div>
            <span className="text-xs text-kharis-green-500 font-medium">Product Guide</span>
          </div>
        </header>

        {/* Intro */}
        <section className="px-5 pt-6 pb-4">
          <h1 className="text-2xl font-extrabold text-kharis-green-800 leading-tight">
            Our Products
          </h1>
          <p className="mt-1.5 text-sm text-kharis-green-500 max-w-xs">
            Scan the QR code on your product bag for detailed usage instructions.
          </p>
        </section>

        {/* Product Grid */}
        <section className="px-5 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cardData.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-5 py-6 border-t border-kharis-green-100 text-center">
          <p className="text-xs text-kharis-green-400">
            &copy; {new Date().getFullYear()} Kharis Foods. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
