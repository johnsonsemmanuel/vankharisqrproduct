"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import { checkAuth } from "@/lib/admin-auth";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import BarcodeGeneratorCard from "@/components/BarcodeGeneratorCard";

export default function AdminBarcodesPage() {
  const router = useRouter();

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/admin/login?redirect=/admin/barcodes");
    }
  }, [router]);

  return (
    <div className="animate-in fade-in duration-300">
      <AdminPageHeader
        title="Product Barcodes"
        description="Manage and download print-ready barcodes for each product."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
        {products.map((product) => (
          <BarcodeGeneratorCard
            key={product.slug}
            initialGtin={product.gtin}
            productName={product.name}
            productSlug={product.slug}
          />
        ))}
      </div>
    </div>
  );
}
