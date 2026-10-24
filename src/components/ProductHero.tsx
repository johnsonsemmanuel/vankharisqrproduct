"use client";

import { motion } from "framer-motion";
import { Product } from "@/types";

interface ProductHeroProps {
  product: Product;
}

export default function ProductHero({ product }: ProductHeroProps) {
  return (
    <section className="px-4 sm:px-6 pt-1 pb-2">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-xs">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="absolute bottom-0 left-0 right-0 p-5 sm:p-7"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-800/85 border border-white/15 px-3 py-1 rounded-full backdrop-blur-xs mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-kharis-gold-400" />
            {product.category}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-xs">
            {product.name}
          </h1>
          {product.tagline && (
            <p className="mt-1.5 text-sm sm:text-base text-neutral-100/90 max-w-2xl leading-relaxed">
              {product.tagline}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
