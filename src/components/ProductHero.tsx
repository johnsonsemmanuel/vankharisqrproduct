"use client";

import { motion } from "framer-motion";
import { Product } from "@/types";

interface ProductHeroProps {
  product: Product;
}

export default function ProductHero({ product }: ProductHeroProps) {
  return (
    <section className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[2/1] bg-kharis-green-50 overflow-hidden"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kharis-green-900/70 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute bottom-0 left-0 right-0 p-5 pb-6"
      >
        <span className="inline-block text-xs font-semibold text-kharis-gold-300 bg-kharis-green-900/60 px-2.5 py-1 rounded-full backdrop-blur-sm mb-2">
          {product.category}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          {product.name}
        </h1>
        {product.tagline && (
          <p className="mt-1.5 text-sm sm:text-base text-kharis-green-100 max-w-xl">
            {product.tagline}
          </p>
        )}
      </motion.div>
    </section>
  );
}
