"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Download,
  FileText,
  Package,
  Barcode,
  QrCode,
  ChevronRight,
  Check,
  Filter,
  Calendar,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkAuth } from "@/lib/admin-auth";
import { products } from "@/data/products";
import type { BatchRecord } from "@/lib/batch-store";

export default function ExportPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<"csv" | "json" | "zip" | "print">("csv");
  const [includeQR, setIncludeQR] = useState(true);
  const [includeBarcode, setIncludeBarcode] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    productSlug: "",
    material: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/batches");
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.batches) {
          setBatches(data.batches);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/admin/login?redirect=/admin/qr/export");
      return;
    }
    fetchBatches();
  }, [router, fetchBatches]);

  const handleExport = async () => {
    const selectedBatches = batches.filter((b) => selectedIds.includes(b.id));
    if (selectedBatches.length === 0) return;

    setExporting(true);

    try {
      if (exportFormat === "csv") {
        exportCSV(selectedBatches);
      } else if (exportFormat === "json") {
        exportJSON(selectedBatches);
      } else if (exportFormat === "zip") {
        await exportZIP(selectedBatches);
      } else if (exportFormat === "print") {
        exportPrintSheet(selectedBatches);
      }
    } finally {
      setExporting(false);
    }
  };

  const exportCSV = (batchList: BatchRecord[]) => {
    const headers = [
      "Product Name",
      "Product Slug",
      "Batch Code",
      "Packaging Material",
      "Print Quantity",
      "Production Date",
      "Expiry Date",
      "Facility",
      "QR Color",
      "QR Color Name",
      "Scan Count",
      "Status",
      "Created At",
      "Notes",
    ];
    const rows = batchList.map((b) => [
      b.productName,
      b.productSlug,
      b.batchCode,
      b.packagingMaterial,
      b.printQuantity.toString(),
      b.productionDate,
      b.expiryDate || "",
      b.facility || "",
      b.qrColor,
      b.qrColorName,
      b.scanCount.toString(),
      b.status,
      new Date(b.createdAt).toISOString(),
      b.notes || "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map(escapeCSV).join(","))].join("\n");
    downloadFile(csv, `batches-export-${Date.now()}.csv`, "text/csv");
  };

  const exportJSON = (batchList: BatchRecord[]) => {
    const json = JSON.stringify(batchList, null, 2);
    downloadFile(json, `batches-export-${Date.now()}.json`, "application/json");
  };

  const escapeCSV = (field: string) => {
    if (field.includes(",") || field.includes('"') || field.includes("\n")) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  const exportZIP = async (batchList: BatchRecord[]) => {
    // For now, export QR URLs as CSV (actual ZIP would need JSZip library)
    const headers = ["Product", "Batch Code", "QR URL", "Barcode URL"];
    const rows = batchList.map((b) => [
      b.productName,
      b.batchCode,
      `https://kharisfoods.vankharis.com/product/${b.productSlug}?batch=${encodeURIComponent(b.batchCode)}`,
      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`https://kharisfoods.vankharis.com/product/${b.productSlug}?batch=${b.batchCode}`)}`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map(escapeCSV).join(","))].join("\n");
    downloadFile(csv, `qr-links-${Date.now()}.csv`, "text/csv");
  };

  const exportPrintSheet = (batchList: BatchRecord[]) => {
    const html = generatePrintHTML(batchList);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `print-sheet-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePrintHTML = (batchList: BatchRecord[]) => {
    return `<!DOCTYPE html>
<html>
<head>
  <title>Batch Print Sheet</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { margin: 0; color: #1b5e20; }
    .header p { margin: 5px 0; color: #666; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
    th { background: #f5f5f5; font-weight: 600; }
    .qr-placeholder { width: 60px; height: 60px; border: 2px solid #000; display: inline-block; }
    .barcode-placeholder { width: 120px; height: 40px; border: 2px solid #000; display: inline-block; }
    @media print { body { margin: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Kharis Foods - Batch Print Sheet</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    <p>Total Batches: ${batchList.length}</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Product</th>
        <th>Batch Code</th>
        <th>Material</th>
        <th>Qty</th>
        <th>Prod. Date</th>
        <th>QR Code</th>
        <th>Barcode</th>
      </tr>
    </thead>
    <tbody>
      ${batchList
        .map(
          (b, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${b.productName}</td>
          <td><code>${b.batchCode}</code></td>
          <td>${b.packagingMaterial}</td>
          <td>${b.printQuantity.toLocaleString()}</td>
          <td>${b.productionDate}</td>
          <td><div class="qr-placeholder"></div></td>
          <td><div class="barcode-placeholder"></div></td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
  <div class="no-print" style="text-align:center; margin-top:20px;">
    <button onclick="window.print()" style="padding:10px 20px; background:#1b5e20; color:white; border:none; border-radius:4px; cursor:pointer;">Print This Sheet</button>
  </div>
</body>
</html>`;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredBatches = useMemo(() => {
    let result = [...batches];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (b) =>
          b.productName.toLowerCase().includes(q) ||
          b.batchCode.toLowerCase().includes(q) ||
          b.packagingMaterial.toLowerCase().includes(q)
      );
    }
    if (filters.productSlug) {
      result = result.filter((b) => b.productSlug === filters.productSlug);
    }
    if (filters.material) {
      result = result.filter((b) => b.packagingMaterial === filters.material);
    }
    if (filters.status) {
      result = result.filter((b) => b.status === filters.status);
    }
    if (filters.dateFrom) {
      result = result.filter((b) => b.productionDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((b) => b.productionDate <= filters.dateTo);
    }

    return result;
  }, [batches, filters]);

  const handleSelectionChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((s) => s !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredBatches.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const allSelected = filteredBatches.length > 0 && selectedIds.length === filteredBatches.length;

  const materials = useMemo(() => [...new Set(batches.map((b) => b.packagingMaterial))].sort(), [batches]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-700" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Bulk Export
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Download QR codes, barcodes, CSV data, and print sheets for selected batches.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="w-4 h-4 mr-1.5" />
          {showFilters ? "Hide" : "Show"} Filters
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 mb-4 space-y-4 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Search</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="search"
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  placeholder="Product, batch code, material..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Product</label>
              <select
                value={filters.productSlug}
                onChange={(e) => setFilters((prev) => ({ ...prev, productSlug: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">All Products</option>
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Material</label>
              <select
                value={filters.material}
                onChange={(e) => setFilters((prev) => ({ ...prev, material: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">All Materials</option>
                {materials.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="depleted">Depleted</option>
                <option value="recalled">Recalled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
          {Object.values(filters).some((v) => v) && (
            <Button variant="ghost" size="sm" onClick={() => setFilters({ search: "", productSlug: "", material: "", status: "", dateFrom: "", dateTo: "" })}>
              Clear All Filters
            </Button>
          )}
        </div>
      )}

      {/* Export Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selection Panel */}
        <section className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Select Batches ({selectedIds.length}/{filteredBatches.length})
            </h2>
            <Button variant="outline" size="sm" onClick={() => handleSelectAll(!allSelected)}>
              {allSelected ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Product</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Batch Code</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Material</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Qty</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Scans</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {filteredBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(batch.id)}
                        onChange={(e) => handleSelectionChange(batch.id, e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                      />
                    </td>
                    <td className="px-4 py-3">{batch.productName}</td>
                    <td className="px-4 py-3 font-mono text-brand-700 dark:text-brand-300">{batch.batchCode}</td>
                    <td className="px-4 py-3">{batch.packagingMaterial}</td>
                    <td className="px-4 py-3">{batch.printQuantity.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono">{batch.scanCount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBatches.length === 0 && (
            <div className="text-center py-8 text-neutral-400 dark:text-neutral-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
              <p className="text-sm">No batches match current filters</p>
            </div>
          )}
        </section>

        {/* Export Options Panel */}
        <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4 sticky top-24">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Options
          </h2>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Format</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors hover:border-brand-300 dark:hover:border-brand-700">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={exportFormat === "csv"}
                  onChange={() => setExportFormat("csv")}
                  className="w-4 h-4 text-brand-600 border-neutral-300 focus:ring-brand-500"
                />
                <div>
                  <FileText className="w-5 h-5 text-brand-700 dark:text-brand-300" />
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">CSV Spreadsheet</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">All batch data in Excel-compatible format</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors hover:border-brand-300 dark:hover:border-brand-700">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={exportFormat === "json"}
                  onChange={() => setExportFormat("json")}
                  className="w-4 h-4 text-brand-600 border-neutral-300 focus:ring-brand-500"
                />
                <div>
                  <FileText className="w-5 h-5 text-brand-700 dark:text-brand-300" />
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">JSON Data</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Complete batch objects for API integration</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors hover:border-brand-300 dark:hover:border-brand-700">
                <input
                  type="radio"
                  name="format"
                  value="zip"
                  checked={exportFormat === "zip"}
                  onChange={() => setExportFormat("zip")}
                  className="w-4 h-4 text-brand-600 border-neutral-300 focus:ring-brand-500"
                />
                <div>
                  <QrCode className="w-5 h-5 text-brand-700 dark:text-brand-300" />
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">QR Code Package</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">CSV with QR/barcode URLs for printing</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors hover:border-brand-300 dark:hover:border-brand-700">
                <input
                  type="radio"
                  name="format"
                  value="print"
                  checked={exportFormat === "print"}
                  onChange={() => setExportFormat("print")}
                  className="w-4 h-4 text-brand-600 border-neutral-300 focus:ring-brand-500"
                />
                <div>
                  <Package className="w-5 h-5 text-brand-700 dark:text-brand-300" />
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Print Sheet</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">HTML sheet with QR/barcode placeholders</div>
                </div>
              </label>
            </div>
          </div>

          {exportFormat !== "csv" && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeQR}
                  onChange={(e) => setIncludeQR(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Include QR code URLs</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBarcode}
                  onChange={(e) => setIncludeBarcode(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Include barcode URLs (EAN-13)</span>
              </label>
            </div>
          )}

          <Button
            variant="primary"
            className="w-full"
            size="lg"
            onClick={handleExport}
            disabled={selectedIds.length === 0 || exporting}
            loading={exporting}
          >
            <Download className="w-4 h-4 mr-1" />
            Export {selectedIds.length} Batch{selectedIds.length !== 1 ? "es" : ""}
          </Button>
        </section>
      </div>

      {/* Export Presets */}
      <section className="mt-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Quick Export Presets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ExportPresetCard
            icon={FileText}
            title="All Batches CSV"
            description="Complete batch registry export"
            onClick={() => {
              setSelectedIds(batches.map((b) => b.id));
              setExportFormat("csv");
              handleExport();
            }}
          />
          <ExportPresetCard
            icon={QrCode}
            title="Active Batches QR"
            description="Only batches with scans"
            onClick={() => {
              const active = batches.filter((b) => b.scanCount > 0);
              setSelectedIds(active.map((b) => b.id));
              setExportFormat("zip");
              handleExport();
            }}
          />
          <ExportPresetCard
            icon={Package}
            title="Pending Print Sheet"
            description="Unscanned batches for printing"
            onClick={() => {
              const pending = batches.filter((b) => b.scanCount === 0);
              setSelectedIds(pending.map((b) => b.id));
              setExportFormat("print");
              handleExport();
            }}
          />
          <ExportPresetCard
            icon={Barcode}
            title="Barcode URLs"
            description="EAN-13 links for retail"
            onClick={() => {
              setSelectedIds(batches.map((b) => b.id));
              setExportFormat("zip");
              setIncludeBarcode(true);
              handleExport();
            }}
          />
        </div>
      </section>
    </div>
  );
}

function ExportPresetCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-all text-left"
    >
      <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/50 border border-brand-200 dark:border-brand-700 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-brand-700 dark:text-brand-300" />
      </div>
      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{title}</h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{description}</p>
    </button>
  );
}