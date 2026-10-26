"use client";

import { useMemo } from "react";
import { ShieldCheck } from "lucide-react";
import { generateEAN13Svg, formatToValidEAN13 } from "@/lib/ean13";
import type { MaterialConfig } from "@/lib/qr-types";

interface RealtimeBagMockupProps {
  productName: string;
  productSlug: string;
  category: string;
  productImage: string;
  qrSvgString: string;
  gtin: string;
  batchCode: string;
  qrColor: string;
  material: MaterialConfig;
  glareActive?: boolean;
  glarePosition?: number;
}

export default function RealtimeBagMockup({
  productName,
  productSlug,
  category,
  productImage,
  qrSvgString,
  gtin,
  batchCode,
  qrColor,
  material,
  glareActive = true,
  glarePosition = 0,
}: RealtimeBagMockupProps) {
  const validEan = useMemo(() => formatToValidEAN13(gtin), [gtin]);

  const materialStyle = useMemo(
    () => ({
      ...material.style,
      backgroundColor: material.approxBgHex,
    }),
    [material]
  );

  // Perceived luminance to drive adaptive text / border contrast
  const hex = material.approxBgHex.replace("#", "");
  const rgb = [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
  const luminance =
    (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  const isDark = luminance < 0.4;
  const isShiny = material.category === "shiny";
  const isClear = material.category === "other";

  // Dull the grain image for opaque/dark substrates so the material color reads through
  const imageOpacity = isClear ? 1 : 0.85;
  const imageFilter = isClear ? "none" : "brightness(90%) contrast(95%)";

  // Contrast-aware barcode color (white bars on dark substrates, black on light)
  const barcodeBarColor = isDark ? "#ffffff" : "#000000";
  // Print-ready module width: 4px ≈ 0.33mm X-dimension at 96 DPI
  const barcodeScale = 4;

  // Glare highlight positioned by glarePosition (degrees around the bag face)
  const glareStyle = material.hasGlare && glareActive
    ? {
        opacity: isShiny ? 0.5 : 0.35,
        background:
          "radial-gradient(circle at " +
          (50 + Math.cos(glarePosition) * 40) +
          "% " +
          (50 + Math.sin(glarePosition) * 30) +
          "%, rgba(255,255,255,0.7) 0%, transparent 55%)",
      }
    : undefined;

  // Generate 1D barcode specifically for the pouch
  const barcodeSvg = useMemo(() => {
    return generateEAN13Svg(validEan, {
      barColor: barcodeBarColor,
      backgroundColor: "transparent",
      scale: barcodeScale,
      height: 40,
      includeText: true,
      fontSize: 10,
    });
  }, [validEan, barcodeBarColor, barcodeScale]);

  return (
    <div className="flex flex-col items-center select-none w-full max-w-sm">
      {/* ============================================================== */}
      {/* AUTHENTIC GHANA GRAIN / SACK POUCH BAG MOCKUP (Per Reference) */}
      {/* ============================================================== */}
      <div
        className={`relative w-full max-w-[320px] aspect-[1/1.6] rounded-[2rem] shadow-2xl p-4 flex flex-col justify-between overflow-hidden border transition-all ${material.bracketColor}`}
        style={materialStyle}
      >
        {/* Real Grain Background that fills the whole transparent packaging bag */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src={productImage}
            alt={productName}
            className={`w-full h-full object-cover brightness-95 opacity-${Math.round(imageOpacity * 100)} ${imageFilter ? `filter-[${imageFilter}]` : ""}`}
          />
          {/* Subtle Polyethylene Plastic Reflection Overlay (only for reflective materials) */}
          {material.hasGlare && glareActive && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={glareStyle}
            />
          )}
        </div>

        {/* TOP SEAL: category-matched crimp */}
        <div className="relative z-10 -mx-4 -mt-4 h-9 overflow-hidden border-b border-black/20 shadow-xs">
          <div
            className="w-full h-full"
            style={{
              background:
                isDark || isShiny
                  ? "repeating-linear-gradient(90deg, #374151, #374151 8px, #9ca3af 8px, #9ca3af 16px)"
                  : "repeating-linear-gradient(90deg, #1b5e20, #1b5e20 8px, #ffffff 8px, #ffffff 16px)",
            }}
          />
          {/* Heat-seal pressure crimp dots */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10 pointer-events-none" />
        </div>

        {/* TOP BRAND EMBLEM: category-matched badge */}
        <div className="relative z-10 pt-2 flex flex-col items-center">
          <div
            className="relative flex items-center justify-center w-28 h-20 rounded-[50%] border-2 shadow-md p-2"
            style={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              borderColor:
                material.bracketColor.replace("border-", "") ===
                material.bracketColor
                  ? isDark
                    ? "border-white/40"
                    : "border-kharis-green-700"
                  : isDark
                    ? "border-white/40"
                    : "border-kharis-green-700",
            }}
          >
            {/* Green Circular Badge Wrapper with text */}
            <div className="w-full h-full rounded-[50%] border-2 border-dashed flex flex-col items-center justify-center text-center">
              <img
                src="/images/kharisfoods-removebg-preview.png"
                alt="Kharis Foods"
                className={`h-7 w-auto object-contain ${isDark ? "invert grayscale" : ""}`}
              />
              <span className={`text-[7.5px] font-black uppercase tracking-tighter leading-none mt-0.5 ${isDark ? "text-white" : "text-kharis-green-800"}`}>
                Kharis Choice
              </span>
            </div>
          </div>
        </div>

        {/* MIDDLE: Clear Viewing Area of Natural Grain with Organic Sack Folds */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-3 pointer-events-none">
          {/* Organic sack side folds / creases */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/15 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-black/15 to-transparent pointer-events-none" />
        </div>

        {/* BOTTOM: Authentic Product Label with Nutritional Table, EAN-13 Barcode & 2D QR Code */}
        <div
          className={`relative z-10 rounded-xl border-2 p-2.5 shadow-lg space-y-2 ${isDark ? "text-white" : "text-black"}`}
          style={{
            backgroundColor: `${material.approxBgHex}ee`,
            borderColor:
              material.category === "shiny" || material.category === "other"
                ? isDark
                  ? "border-kharis-green-400"
                  : "border-kharis-green-400"
                : isDark
                  ? "border-white/40"
                  : "border-kharis-green-800",
          }}
        >
          {/* Top Label Row: Product Name & Category */}
          <div className="flex items-start justify-between border-b border-white/30 pb-1.5">
            <div>
              <span className={`text-[8px] font-bold uppercase tracking-wider block leading-tight ${isDark ? "text-kharis-green-300" : "text-kharis-green-800"}`}>
                PRODUCE OF GHANA
              </span>
              <h3 className={`text-sm font-black uppercase tracking-tight leading-tight ${isDark ? "text-white" : "text-gray-950"}`}>
                {productName}
              </h3>
              <p className={`text-[7.5px] font-medium ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
                100% Pure · Naturally Processed
              </p>
            </div>

            <div className="text-right">
              <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${isDark ? "bg-white/20 text-white border border-white/30" : "bg-gray-100 text-gray-800"}`}>
                {batchCode}
              </span>
              <span className={`text-[8px] font-bold block mt-0.5 ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                1.5 kg e / 3.3 lbs
              </span>
            </div>
          </div>

          {/* Middle Label Row: Mini Nutritional Table (left) + Dual Barcode & QR Code (right) */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            {/* Nutritional Grid (Exact match to reference bag layout) */}
            <div className={`flex-1 text-[7px] leading-tight border rounded p-1 ${isDark ? "border-white/30 bg-white/10" : "border-gray-200 bg-gray-50/80"}`}>
              <div className={`font-bold border-b border-white/30 pb-0.5 flex justify-between ${isDark ? "text-white" : "text-gray-800"}`}>
                <span>NUTRITION</span>
                <span>Per 100g</span>
              </div>
              <div className="grid grid-cols-2 gap-x-1 pt-0.5">
                <span className={`${isDark ? "text-neutral-400" : "text-gray-600"}`}>Energy:</span> <span className={`text-right font-medium ${isDark ? "text-white" : "text-gray-600"}`}>360 kcal</span>
                <span className={`${isDark ? "text-neutral-400" : "text-gray-600"}`}>Carbs:</span> <span className={`text-right font-medium ${isDark ? "text-white" : "text-gray-600"}`}>82.5g</span>
                <span className={`${isDark ? "text-neutral-400" : "text-gray-600"}`}>Fiber:</span> <span className={`text-right font-medium ${isDark ? "text-white" : "text-gray-600"}`}>4.2g</span>
                <span className={`${isDark ? "text-neutral-400" : "text-gray-600"}`}>Protein:</span> <span className={`text-right font-medium ${isDark ? "text-white" : "text-gray-600"}`}>1.5g</span>
              </div>
            </div>

            {/* 2D QR Code Viewfinder */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`p-1.5 rounded shadow-2xs ${isDark ? "bg-black border-white/30" : qrColor.toLowerCase() === "#ffffff" ? "bg-black border-neutral-800" : "bg-white border-gray-300"}`}
              >
                {qrSvgString ? (
                  <div
                    className="w-[58px] h-[58px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full"
                    dangerouslySetInnerHTML={{ __html: qrSvgString }}
                    role="img"
                    aria-label={`QR code for ${productName} batch ${batchCode}`}
                  />
                ) : (
                  <div className="w-[58px] h-[58px] flex items-center justify-center text-[7px] text-gray-400">
                    QR
                  </div>
                )}
              </div>
              <span className={`text-[6.5px] font-bold mt-0.5 ${isDark ? "text-kharis-green-300" : "text-kharis-green-800"}`}>
                Scan Guide
              </span>
            </div>
          </div>

          {/* Bottom Label Row: 1D EAN-13 Retail Barcode */}
          <div className={`pt-1 border-t border-white/30 flex items-center justify-between`}>
            <div className="flex-1 flex justify-center overflow-hidden">
              <div
                className="max-w-[170px] [&>svg]:w-full [&>svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: barcodeSvg }}
              />
            </div>
            <div className={`text-[7px] font-mono pl-2 shrink-0 ${isDark ? "text-neutral-300" : "text-gray-400"}`}>
              {validEan}
            </div>
          </div>
        </div>

        {/* BOTTOM SEAL: category-matched crimp */}
        <div className="relative z-10 -mx-4 -mb-4 h-6 overflow-hidden border-t border-black/20 shadow-xs">
          <div
            className="w-full h-full"
            style={{
              background:
                isDark || isShiny
                  ? "repeating-linear-gradient(90deg, #374151, #374151 8px, #9ca3af 8px, #9ca3af 16px)"
                  : "repeating-linear-gradient(90deg, #1b5e20, #1b5e20 8px, #ffffff 8px, #ffffff 16px)",
            }}
          />
        </div>
      </div>

      {/* Clean Tag Info */}
      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-xs text-gray-600 dark:text-neutral-300 shadow-2xs">
        <ShieldCheck className="w-3.5 h-3.5 text-kharis-green-600" />
        <span>Authentic Ghana Sack Packaging Profile</span>
      </div>
    </div>
  );
}
