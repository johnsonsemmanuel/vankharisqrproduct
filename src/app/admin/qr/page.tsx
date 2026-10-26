"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Settings,
  FileSpreadsheet,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkAuth } from "@/lib/admin-auth";
import { products } from "@/data/products";
import {
  MATERIAL_CONFIGS,
  COLOR_PRESETS,
  PRESET_QUANTITIES,
  BASE_URL,
} from "@/lib/qr-types";
import QRCodePreview from "@/components/admin/QRCodePreview";
import RealtimeBagMockup from "@/components/RealtimeBagMockup";

export interface BatchRecord {
  id: string;
  batchCode: string;
  productSlug: string;
  productName: string;
  printQuantity: number;
  qrColor: string;
  qrColorName: string;
  packagingMaterial: string;
  createdAt: number;
  productionDate: string;
  expiryDate?: string;
  facility?: string;
  notes?: string;
  scanCount: number;
  lastScannedAt?: number;
  status: "active" | "depleted" | "recalled";
}

function makeBatchCode(skuPrefix: string, prodDate: string) {
  const cleanDate = (prodDate || new Date().toISOString().slice(0, 10))
    .slice(2, 10)
    .replace(/-/g, "");
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KF-${skuPrefix}-${cleanDate}-${suffix}`;
}

export default function QRStudioMainPage() {
  const router = useRouter();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [productSlug, setProductSlug] = useState(products[0]?.slug || "maize-grits");
  const [productionDate, setProductionDate] = useState(today);
  const [expiryDate, setExpiryDate] = useState("");
  const [batchCode, setBatchCode] = useState(() =>
    makeBatchCode(products[0]?.sku?.split("-")[1] || "MG", today)
  );
  const [printQuantity, setPrintQuantity] = useState(1000);
  const [qrColor, setQrColor] = useState("#000000");
  const [qrColorName, setQrColorName] = useState("Black");
  const [packagingMaterial, setPackagingMaterial] = useState(
    MATERIAL_CONFIGS[0]?.name || "Kharis Brand Woven Sack"
  );
  const [facility, setFacility] = useState("Accra Processing Center");
  const [notes, setNotes] = useState("");

  const [qrSvgString, setQrSvgString] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registeredBatch, setRegisteredBatch] = useState<BatchRecord | null>(null);

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/admin/login?redirect=/admin/qr");
    }
  }, [router]);

  const activeProduct = useMemo(
    () => products.find((p) => p.slug === productSlug) || products[0],
    [productSlug]
  );

  const activeMaterial = useMemo(
    () =>
      MATERIAL_CONFIGS.find((m) => m.name === packagingMaterial) ||
      MATERIAL_CONFIGS[0],
    [packagingMaterial]
  );

  const isWhiteQr = qrColor.toLowerCase() === "#ffffff";
  const qrBgColor = isWhiteQr ? "#000000" : "#ffffff";

  const targetUrl = useMemo(() => {
    const cleanBatch = batchCode.trim();
    return cleanBatch
      ? `${BASE_URL}/product/${activeProduct.slug}?batch=${encodeURIComponent(cleanBatch)}`
      : `${BASE_URL}/product/${activeProduct.slug}`;
  }, [activeProduct.slug, batchCode]);

  const handleProductChange = (newSlug: string) => {
    setProductSlug(newSlug);
    const prod = products.find((p) => p.slug === newSlug);
    const prefix = prod?.sku?.split("-")[1] || "MG";
    setBatchCode(makeBatchCode(prefix, productionDate));
    setRegisteredBatch(null);
  };

  const handleAutoBatch = () => {
    const prefix = activeProduct?.sku?.split("-")[1] || "MG";
    setBatchCode(makeBatchCode(prefix, productionDate));
    setRegisteredBatch(null);
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(targetUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSvgReady = useCallback((svg: string) => {
    setQrSvgString(svg);
  }, []);

  const handleDownloadQRSVG = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kharis-${activeProduct.slug}-qr-${batchCode || "guide"}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadQRPNG = () => {
    if (!qrSvgString) return;
    setDownloadingPng(true);
    const img = new Image();
    const svgBlob = new Blob([qrSvgString], { type: "image/svg+xml;charset=utf-8" });
    const blobUrl = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = qrBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = pngUrl;
            a.download = `kharis-${activeProduct.slug}-qr-${batchCode || "guide"}-2048px.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(pngUrl);
          }
          setDownloadingPng(false);
          URL.revokeObjectURL(blobUrl);
        }, "image/png");
      } else {
        setDownloadingPng(false);
        URL.revokeObjectURL(blobUrl);
      }
    };
    img.onerror = () => {
      setDownloadingPng(false);
      URL.revokeObjectURL(blobUrl);
    };
    img.src = blobUrl;
  };

  const handleRegisterBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setRegisteredBatch(null);

    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: activeProduct.slug,
          productName: activeProduct.name,
          batchCode: batchCode.trim(),
          printQuantity,
          qrColor,
          qrColorName,
          packagingMaterial,
          productionDate,
          expiryDate,
          facility,
          notes,
        }),
      });
      const data = await res.json();
      if (data.ok && data.batch) {
        setRegisteredBatch(data.batch);
      }
    } catch {
      // handled silently
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Studio Header with Secondary Tool Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/50 border border-brand-200 dark:border-brand-800 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-brand-700 dark:text-brand-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                QR Studio
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Generate packaging QR codes, preview live bag placement, and register print runs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/qr/presets">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              Material Presets
            </Button>
          </Link>
          <Link href="/admin/qr/export">
            <Button variant="outline" size="sm" className="gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Bulk Export
            </Button>
          </Link>
          <Link href="/admin/batches">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Batch Registry
            </Button>
          </Link>
        </div>
      </div>

      {/* Main 3-Column Studio Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Configuration & Batch Form */}
        <form onSubmit={handleRegisterBatch} className="xl:col-span-5 space-y-5">
          {/* 1. Product & Batch Code */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              1. Product & Batch Code
            </h2>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Select Product
                </label>
                <select
                  value={productSlug}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-500"
                >
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Batch Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
                    placeholder="KF-MG-261024-ABCD"
                    className="flex-1 font-mono px-3.5 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAutoBatch}
                    className="rounded-xl px-3.5 gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    New Code
                  </Button>
                </div>
              </div>

              {/* Target Destination Link */}
              <div className="pt-1">
                <label className="block text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  QR Destination Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={targetUrl}
                    className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyUrl}
                    className="h-8 px-2.5 text-xs gap-1"
                  >
                    {copiedUrl ? (
                      <Check className="w-3.5 h-3.5 text-brand-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedUrl ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* 2. QR Appearance & Packaging Material */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              2. QR Appearance & Bag Material
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                QR Ink Color ({qrColorName})
              </label>
              <div className="flex flex-wrap gap-2.5">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setQrColor(preset.hex);
                      setQrColorName(preset.name);
                    }}
                    className={`w-9 h-9 rounded-xl border-2 transition-all cursor-pointer ${
                      qrColor === preset.hex
                        ? "border-brand-500 ring-2 ring-brand-500/30 scale-105"
                        : "border-neutral-300 dark:border-neutral-700 hover:border-brand-400"
                    } ${preset.swatchBg}`}
                    title={preset.name}
                    aria-label={preset.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Packaging Material
              </label>
              <select
                value={packagingMaterial}
                onChange={(e) => setPackagingMaterial(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-500"
              >
                {MATERIAL_CONFIGS.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
              {activeMaterial?.description && (
                <p className="mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                  {activeMaterial.description}
                </p>
              )}
            </div>
          </section>

          {/* 3. Print Run Details */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              3. Print Run Details
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Print Quantity
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {PRESET_QUANTITIES.map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setPrintQuantity(qty)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      printQuantity === qty
                        ? "bg-brand-700 text-white border-brand-700 dark:bg-brand-600"
                        : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-brand-400"
                    }`}
                  >
                    {qty.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={1}
                value={printQuantity}
                onChange={(e) => setPrintQuantity(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Production Date
                </label>
                <input
                  type="date"
                  value={productionDate}
                  onChange={(e) => setProductionDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Processing Facility
              </label>
              <input
                type="text"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={registering}
              className="w-full rounded-xl h-10 text-sm font-semibold"
            >
              {registering ? "Registering Batch..." : "Save & Register Batch"}
            </Button>

            {registeredBatch && (
              <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-700 dark:text-brand-300 shrink-0 mt-0.5" />
                <div className="text-xs text-brand-900 dark:text-brand-100">
                  <p className="font-bold">Batch Registered</p>
                  <p className="mt-0.5 text-brand-700 dark:text-brand-300">
                    Saved <span className="font-mono font-semibold">{registeredBatch.batchCode}</span> ({registeredBatch.printQuantity.toLocaleString()} units).
                  </p>
                </div>
              </div>
            )}
          </section>
        </form>

        {/* CENTER COLUMN: Live QR Code Generator & Export */}
        <div className="xl:col-span-3 space-y-5">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Generated QR Code
                </h2>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {activeProduct.name}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 font-mono text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                {batchCode || "GUIDE"}
              </span>
            </div>

            {/* QR Canvas Box */}
            <div
              className={`p-6 rounded-xl border flex flex-col items-center justify-center transition-colors ${
                isWhiteQr
                  ? "bg-black border-neutral-800"
                  : "bg-white border-neutral-200"
              }`}
            >
              <QRCodePreview
                data={targetUrl}
                color={qrColor}
                size={200}
                backgroundColor={qrBgColor}
                onSvgReady={handleSvgReady}
              />
              <span
                className={`mt-2 text-[11px] font-mono ${
                  isWhiteQr ? "text-neutral-300" : "text-neutral-500"
                }`}
              >
                {batchCode}
              </span>
            </div>

            {/* Download Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadQRSVG}
                className="rounded-xl text-xs gap-1.5 h-9"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SVG</span>
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleDownloadQRPNG}
                disabled={downloadingPng}
                className="rounded-xl text-xs gap-1.5 h-9"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadingPng ? "Saving..." : "Download PNG"}</span>
              </Button>
            </div>

            {/* Test Verification Link */}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <a
                href={`/product/${activeProduct.slug}?batch=${encodeURIComponent(batchCode.trim())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold h-9 px-3 transition-colors"
              >
                <span>Test Customer Scan Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Bag Mockup */}
        <div className="xl:col-span-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-4">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Live Bag Preview
                </h2>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Real-time placement of QR code and barcode on bag label
                </p>
              </div>
            </div>

            <RealtimeBagMockup
              productName={activeProduct.name}
              productSlug={activeProduct.slug}
              category={activeProduct.category}
              productImage={activeProduct.images[0]}
              qrSvgString={qrSvgString}
              gtin={activeProduct.gtin || "0602500000018"}
              batchCode={batchCode || "KF-BATCH"}
              qrColor={qrColor}
              material={activeMaterial}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
