"use client";

import { useMemo } from "react";
import { generateEAN13Svg, formatToValidEAN13, validateEAN13 } from "@/lib/ean13";
import { generateQrDataUrl } from "@/lib/batch-url";
import QRCodePreview from "@/components/admin/QRCodePreview";

interface ProductPreviewProps {
  productName: string;
  productSlug: string;
  gtin?: string;
  batchCode?: string;
  qrColor?: string;
  className?: string;
}

export default function ProductPreview({
  productName,
  productSlug,
  gtin,
  batchCode,
  qrColor = "#000000",
  className = "",
}: ProductPreviewProps) {
  const validEan = useMemo(() => formatToValidEAN13(gtin || ""), [gtin]);
  const isValidEan = useMemo(() => validateEAN13(validEan), [validEan]);
  const qrUrl = useMemo(() => batchCode ? generateQrDataUrl(productSlug, batchCode) : null, [productSlug, batchCode]);

  const eanSvg = useMemo(() => {
    if (!isValidEan) return null;
    return generateEAN13Svg(validEan, {
      barColor: "#000000",
      backgroundColor: "#ffffff",
      scale: 2,
      height: 60,
      includeText: true,
      fontSize: 12,
    });
  }, [validEan, isValidEan]);

  return (
    <div className={`bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6 ${className}`}>
      {/* Product Info Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-brand-700 dark:text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{productName}</h3>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
            {gtin ? `GTIN: ${gtin}` : "No GTIN assigned"}
          </p>
        </div>
      </div>

      {/* Preview Grid - QR Code | Barcode */}
      <div className="grid grid-cols-2 gap-4">
        {/* QR Code Preview */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 flex flex-col items-center">
          <div className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
            QR Code (Batch)
          </div>
          {qrUrl ? (
            <QRCodePreview
              data={qrUrl}
              color={qrColor}
              size={120}
              backgroundColor="#ffffff"
            />
          ) : (
            <div className="w-28 h-28 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex items-center justify-center text-[10px] text-neutral-400 dark:text-neutral-500">
              No batch code
            </div>
          )}
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-2 text-center font-mono truncate">
            {batchCode || "Scan to verify batch"}
          </p>
        </div>

        {/* Barcode Preview */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 flex flex-col items-center">
          <div className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
            Barcode (EAN-13)
          </div>
          {eanSvg ? (
            <div
              className="w-full max-w-xs"
              dangerouslySetInnerHTML={{ __html: eanSvg }}
              role="img"
              aria-label={`EAN-13 barcode for ${productName}: ${validEan}`}
            />
          ) : (
            <div className="w-full h-20 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex items-center justify-center text-[10px] text-neutral-400 dark:text-neutral-500">
              Invalid GTIN
            </div>
          )}
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-2 text-center font-mono truncate">
            {validEan || "No valid GTIN"}
          </p>
        </div>
      </div>

      {/* Usage Note */}
      <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800">
        <p className="text-[10px] text-brand-700 dark:text-brand-300">
          <strong>Consumer Scan:</strong> QR code links to product guide with batch verification. Barcode for POS checkout scanning.
        </p>
      </div>
    </div>
  );
}