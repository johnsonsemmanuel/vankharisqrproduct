"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { products } from "@/data/products";

export default function AdminQRPage() {
  const [baseUrl, setBaseUrl] = useState("https://kharisfoods.vankharis.com");

  useEffect(() => {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      setBaseUrl(`http://localhost:${window.location.port}`);
    }
  }, []);

  return (
    <div className="min-h-dvh bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-5 h-14 max-w-lg mx-auto">
          <h1 className="font-bold text-gray-800 text-sm">QR Code Generator</h1>
          <span className="text-xs text-gray-400">Internal Use</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-6">
        {products.map((product) => (
          <ProductQRCard
            key={product.id}
            product={product}
            baseUrl={baseUrl}
          />
        ))}
      </div>
    </div>
  );
}

function ProductQRCard({
  product,
  baseUrl,
}: {
  product: (typeof products)[number];
  baseUrl: string;
}) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const productUrl = `${baseUrl}/product/${product.slug}`;

  useEffect(() => {
    if (!baseUrl) return;
    QRCode.toDataURL(productUrl, {
      width: 400,
      margin: 2,
      color: { dark: "#1b5e20", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [baseUrl, productUrl]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR code for ${product.name}`}
              className="w-28 h-28"
            />
          ) : (
            <div className="w-28 h-28 bg-gray-100 rounded-lg" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-gray-800">{product.name}</h2>
          <p className="text-xs text-gray-500 mt-0.5 break-all">{productUrl}</p>
          {qrDataUrl && (
            <a
              href={qrDataUrl}
              download={`qr-${product.slug}.png`}
              className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 bg-kharis-green-700 text-white text-xs font-semibold rounded-lg hover:bg-kharis-green-800 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PNG
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
