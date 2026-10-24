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

  // Generate 1D barcode specifically for the pouch
  const barcodeSvg = useMemo(() => {
    return generateEAN13Svg(validEan, {
      barColor: "#000000",
      backgroundColor: "transparent",
      scale: 1.5,
      height: 40,
      includeText: true,
      fontSize: 10,
    });
  }, [validEan]);

  return (
    <div className="flex flex-col items-center select-none w-full max-w-sm">
      {/* ============================================================== */}
      {/* AUTHENTIC GHANA GRAIN / SACK POUCH BAG MOCKUP (Per Reference) */}
      {/* ============================================================== */}
      <div className="relative w-full max-w-[320px] aspect-[1/1.6] rounded-[2rem] shadow-2xl p-4 flex flex-col justify-between overflow-hidden border border-neutral-300/60 dark:border-neutral-700/60 transition-all bg-white">
        
        {/* Real Grain Background that fills the whole transparent packaging bag */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover brightness-95"
          />
          {/* Subtle Polyethylene Plastic Reflection Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-white/10 to-transparent pointer-events-none" />
        </div>

        {/* TOP SEAL: Green & White Striped Packaging Crimp (Exact match to reference bag) */}
        <div className="relative z-10 -mx-4 -mt-4 h-9 overflow-hidden border-b border-black/20 shadow-xs">
          <div
            className="w-full h-full"
            style={{
              background:
                "repeating-linear-gradient(90deg, #1b5e20, #1b5e20 8px, #ffffff 8px, #ffffff 16px)",
            }}
          />
          {/* Heat-seal pressure crimp dots */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10 pointer-events-none" />
        </div>

        {/* TOP BRAND EMBLEM: Oval Logo Crest (Exact match to People's Choice reference) */}
        <div className="relative z-10 pt-2 flex flex-col items-center">
          <div className="relative flex items-center justify-center w-28 h-20 rounded-[50%] bg-white border-2 border-kharis-green-700 shadow-md p-2">
            {/* Green Circular Badge Wrapper with text */}
            <div className="w-full h-full rounded-[50%] border-2 border-dashed border-kharis-green-600 flex flex-col items-center justify-center text-center">
              <img
                src="/images/kharisfoods-removebg-preview.png"
                alt="Kharis Foods"
                className="h-7 w-auto object-contain"
              />
              <span className="text-[7.5px] font-black uppercase text-kharis-green-800 tracking-tighter leading-none mt-0.5">
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

        {/* BOTTOM: Authentic White Product Label with Nutritional Table, EAN-13 Barcode & 2D QR Code */}
        <div className="relative z-10 bg-white/95 rounded-xl border-2 border-kharis-green-800 p-2.5 shadow-lg text-black space-y-2">
          {/* Top Label Row: Product Name & Category */}
          <div className="flex items-start justify-between border-b border-gray-200 pb-1.5">
            <div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-kharis-green-800 block leading-tight">
                PRODUCE OF GHANA
              </span>
              <h3 className="text-sm font-black uppercase tracking-tight text-gray-950 leading-tight">
                {productName}
              </h3>
              <p className="text-[7.5px] text-gray-500 font-medium">
                100% Pure · Naturally Processed
              </p>
            </div>

            <div className="text-right">
              <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">
                {batchCode}
              </span>
              <span className="text-[8px] font-bold text-gray-700 block mt-0.5">
                1.5 kg e / 3.3 lbs
              </span>
            </div>
          </div>

          {/* Middle Label Row: Mini Nutritional Table (left) + Dual Barcode & QR Code (right) */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            {/* Nutritional Grid (Exact match to reference bag layout) */}
            <div className="flex-1 text-[7px] leading-tight border border-gray-200 rounded p-1 bg-gray-50/80">
              <div className="font-bold border-b border-gray-200 pb-0.5 text-gray-800 flex justify-between">
                <span>NUTRITION</span>
                <span>Per 100g</span>
              </div>
              <div className="grid grid-cols-2 gap-x-1 pt-0.5 text-gray-600">
                <span>Energy:</span> <span className="text-right font-medium">360 kcal</span>
                <span>Carbs:</span> <span className="text-right font-medium">82.5g</span>
                <span>Fiber:</span> <span className="text-right font-medium">4.2g</span>
                <span>Protein:</span> <span className="text-right font-medium">1.5g</span>
              </div>
            </div>

            {/* 2D QR Code Viewfinder */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`p-1.5 rounded border shadow-2xs transition-colors ${
                  qrColor.toLowerCase() === "#ffffff"
                    ? "bg-black border-neutral-800"
                    : "bg-white border-gray-300"
                }`}
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
              <span className="text-[6.5px] font-bold text-kharis-green-800 mt-0.5">
                Scan Guide
              </span>
            </div>
          </div>

          {/* Bottom Label Row: 1D EAN-13 Retail Barcode */}
          <div className="pt-1 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-center overflow-hidden">
              <div
                className="max-w-[170px] [&>svg]:w-full [&>svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: barcodeSvg }}
              />
            </div>
            <div className="text-[7px] font-mono text-gray-400 pl-2 shrink-0">
              {validEan}
            </div>
          </div>
        </div>

        {/* BOTTOM SEAL: Green & White Striped Packaging Crimp (Exact match to reference bag) */}
        <div className="relative z-10 -mx-4 -mb-4 h-6 overflow-hidden border-t border-black/20 shadow-xs">
          <div
            className="w-full h-full"
            style={{
              background:
                "repeating-linear-gradient(90deg, #1b5e20, #1b5e20 8px, #ffffff 8px, #ffffff 16px)",
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
