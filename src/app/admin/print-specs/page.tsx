"use client";

import { useState } from "react";
import { Printer, FileText, AlertTriangle } from "lucide-react";
import { PRINT_SPECS, PrintMethod, Substrate } from "@/lib/print-specs";

export default function PrintSpecsPage() {
  const [method, setMethod] = useState<PrintMethod>("flexo");
  const [substrate, setSubstrate] = useState<Substrate>("woven_pp");

  const spec = PRINT_SPECS[method][substrate];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-3">
            <Printer className="w-8 h-8" />
            Adaptive Print Specifications
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Optimized for different printing methods and substrates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">Print Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PrintMethod)}
              className="w-full px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            >
              <option value="digital">Digital</option>
              <option value="offset">Offset</option>
              <option value="flexo">Flexographic</option>
              <option value="thermal">Thermal Transfer/Direct</option>
              <option value="screen">Screen Printing</option>
              <option value="inkjet">Industrial Inkjet</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">Substrate/Media</label>
            <select
              value={substrate}
              onChange={(e) => setSubstrate(e.target.value as Substrate)}
              className="w-full px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            >
              <option value="paper">Paper</option>
              <option value="coated_paper">Coated Paper</option>
              <option value="label_stock">Label Stock</option>
              <option value="polybag">Poly Bag</option>
              <option value="woven_pp">Woven PP Sack</option>
              <option value="foil">Foil</option>
              <option value="metallized">Metallized Film</option>
              <option value="plastic_film">Plastic Film</option>
              <option value="shrink_film">Shrink Film</option>
              <option value="rubber">Rubber</option>
              <option value="carton">Carton</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-neutral-900 dark:text-white">
              <FileText className="w-5 h-5" />
              EAN-13 Barcode
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">X-Dimension</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{spec.ean13.xDimensionMm} mm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">Bar Height</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{spec.ean13.heightMm} mm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">Magnification</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{spec.ean13.magnification}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">Quiet Zone</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{spec.ean13.quietZoneMm} mm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">Min Contrast</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{spec.ean13.minContrast}%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-600 dark:text-neutral-400">Recommended DPI</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{spec.ean13.recommendedDpi}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-neutral-900 dark:text-white">
              <FileText className="w-5 h-5" />
              QR Code
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">Module Size</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{spec.qr.moduleSizeMm} mm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">Recommended Size</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{spec.qr.sizeMm} mm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">Quiet Zone</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{spec.qr.quietZoneModules} modules</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">Error Correction</span>
                <span className="font-semibold text-neutral-900 dark:text-white">Level {spec.qr.errorCorrection}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">Max Logo Size</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{spec.qr.logoMaxPercent}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">Min Contrast</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{spec.qr.minContrast}%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-600 dark:text-neutral-400">Recommended DPI</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{spec.qr.recommendedDpi}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5" />
            Notes & Recommendations
          </h3>
          <ul className="space-y-2">
            {spec.ean13.notes.map((note, i) => (
              <li key={`e${i}`} className="text-sm text-amber-800 dark:text-amber-300">• {note}</li>
            ))}
            {spec.qr.notes.map((note, i) => (
              <li key={`q${i}`} className="text-sm text-amber-800 dark:text-amber-300">• {note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
