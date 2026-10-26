"use client";

import { useMemo, useState } from "react";
import { Download, Copy, Check, Barcode as BarcodeIcon } from "lucide-react";
import { generateEAN13Svg, formatToValidEAN13 } from "@/lib/ean13";
import { Button } from "@/components/ui/button";

interface BarcodeGeneratorCardProps {
  initialGtin?: string;
  productName: string;
  productSlug: string;
  barColor?: string;
  backgroundColor?: string;
}

export default function BarcodeGeneratorCard({
  initialGtin = "0602500000018",
  productName,
  productSlug,
  barColor = "#000000",
  backgroundColor = "transparent",
}: BarcodeGeneratorCardProps) {
  const [rawInput, setRawInput] = useState(initialGtin);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const validEan = useMemo(() => formatToValidEAN13(rawInput), [rawInput]);

  // Generate SVG strings for both variants
  const svgBlackOnWhite = useMemo(() => {
    return generateEAN13Svg(validEan, {
      barColor: "#000000",
      backgroundColor: "#FFFFFF",
      scale: 3,
      height: 95,
      includeText: true,
      fontSize: 16,
    });
  }, [validEan]);

  const svgWhiteOnBlack = useMemo(() => {
    return generateEAN13Svg(validEan, {
      barColor: "#FFFFFF",
      backgroundColor: "#000000",
      scale: 3,
      height: 95,
      includeText: true,
      fontSize: 16,
    });
  }, [validEan]);

  // Save GTIN to database
  const handleSaveGtin = async () => {
    setSaving(true);
    try {
      await fetch(`/api/products/${productSlug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gtin: validEan }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  // Copy Barcode Number
  const handleCopy = () => {
    navigator.clipboard.writeText(validEan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download PNG
  const handleDownloadPNG = (svg: string, variant: string) => {
    setDownloading(true);
    const img = new Image();
    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const URLObject = window.URL || window.webkitURL || window;
    const blobUrl = URLObject.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const printScale = 4;
      canvas.width = img.width * printScale;
      canvas.height = img.height * printScale;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = pngUrl;
            a.download = `kharis-${productSlug}-barcode-${validEan}-${variant}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(pngUrl);
          }
          setDownloading(false);
          URLObject.revokeObjectURL(blobUrl);
        }, "image/png");
      } else {
        setDownloading(false);
        URLObject.revokeObjectURL(blobUrl);
      }
    };
    img.onerror = () => {
      setDownloading(false);
      URLObject.revokeObjectURL(blobUrl);
    };
    img.src = blobUrl;
  };

  // Download SVG
  const handleDownloadSVG = (svg: string, variant: string) => {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kharis-${productSlug}-barcode-${validEan}-${variant}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
            <BarcodeIcon className="w-4 h-4 text-white dark:text-neutral-900" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {productName}
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Product Barcode
            </p>
          </div>
        </div>
      </div>

      {/* Barcode Variants */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Select Variant</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 w-full">
            <div className="p-4 rounded-xl bg-white border border-neutral-200 flex items-center justify-center w-full overflow-hidden">
              <div
                className="w-full"
                dangerouslySetInnerHTML={{ __html: svgBlackOnWhite }}
                role="img"
                aria-label="Black on white"
              />
            </div>
            <p className="text-[10px] text-center text-neutral-500">Black on White (Light Packaging)</p>
            <div className="grid grid-cols-2 gap-1.5">
              <Button type="button" variant="outline" size="sm" onClick={() => handleDownloadSVG(svgBlackOnWhite, "black-on-white")} className="text-[10px] h-7">SVG</Button>
              <Button type="button" variant="primary" size="sm" onClick={() => handleDownloadPNG(svgBlackOnWhite, "black-on-white")} disabled={downloading} className="text-[10px] h-7">PNG</Button>
            </div>
          </div>
          <div className="space-y-2 w-full">
            <div className="p-4 rounded-xl bg-black border border-neutral-800 flex items-center justify-center w-full overflow-hidden">
              <div
                className="w-full"
                dangerouslySetInnerHTML={{ __html: svgWhiteOnBlack }}
                role="img"
                aria-label="White on black"
              />
            </div>
            <p className="text-[10px] text-center text-neutral-500">White on Black (Dark Packaging)</p>
            <div className="grid grid-cols-2 gap-1.5">
              <Button type="button" variant="outline" size="sm" onClick={() => handleDownloadSVG(svgWhiteOnBlack, "white-on-black")} className="text-[10px] h-7">SVG</Button>
              <Button type="button" variant="primary" size="sm" onClick={() => handleDownloadPNG(svgWhiteOnBlack, "white-on-black")} disabled={downloading} className="text-[10px] h-7">PNG</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Barcode Number Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          Barcode Number
        </label>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              maxLength={13}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Enter barcode digits..."
              className="w-full px-3.5 py-2 text-sm font-mono tracking-wider rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white focus:outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-neutral-900"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSaveGtin}
            disabled={saving}
            className="rounded-xl px-3.5 text-xs gap-1.5 h-9"
          >
            <span>{saving ? "Saving..." : saved ? "Saved" : "Save"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="rounded-xl px-3.5 text-xs gap-1.5 h-9"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
        <p className="text-[10px] text-neutral-500 text-center">Use black on white for light packaging, white on black for dark packaging</p>
      </div>
    </div>
  );
}
