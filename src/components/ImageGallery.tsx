"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="aspect-[4/3] bg-kharis-green-50 rounded-xl overflow-hidden"
        >
          <img
            src={images[selected]}
            alt={`${productName} - view ${selected + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200
                ${i === selected
                  ? "border-kharis-gold-500 ring-1 ring-kharis-gold-500"
                  : "border-kharis-green-100 opacity-70 hover:opacity-100"
                }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
