"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { products } from "@/data/products";
import { Loader2 } from "lucide-react";

export default function BarcodeRedirectPage() {
  const params = useParams<{ gtin: string }>();
  const router = useRouter();
  const gtin = params?.gtin || "";

  useEffect(() => {
    const cleanGtin = gtin.replace(/\D/g, "");
    const product = products.find((p) => p.gtin === cleanGtin);

    if (product) {
      fetch(`/api/barcode?gtin=${cleanGtin}`).catch(() => {});
      router.replace(`/product/${product.slug}`);
    } else {
      router.replace("/");
    }
  }, [gtin, router]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-white dark:bg-neutral-950">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Looking up product...</p>
      </div>
    </div>
  );
}
