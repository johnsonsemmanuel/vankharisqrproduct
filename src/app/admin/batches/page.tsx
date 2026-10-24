"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Download,
  Package,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  ShieldCheck,
  Plus,
  X,
  Save,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkAuth } from "@/lib/admin-auth";
import type { BatchRecord } from "@/lib/batch-store";
import { MATERIAL_CONFIGS } from "@/lib/qr-types";

const ITEMS_PER_PAGE = 15;

export default function BatchesPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [materialFilter, setMaterialFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof BatchRecord;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/batches");
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.batches)) {
          setBatches(data.batches);
        }
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/admin/login?redirect=/admin/batches");
      return;
    }
    fetchBatches();
  }, [router, fetchBatches]);

  const handleUpdate = async (id: string, updates: Partial<BatchRecord>) => {
    setSaving(id);
    try {
      const res = await fetch("/api/batches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updates }),
      });
      if (res.ok) {
        setBatches((prev) =>
          prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
        );
      }
    } catch {
      // error handled
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this batch? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch("/api/batches", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setBatches((prev) => prev.filter((b) => b.id !== id));
        setSelectedIds((prev) => prev.filter((s) => s !== id));
      }
    } catch {
      // error handled
    } finally {
      setDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} batches? This cannot be undone.`)) return;
    setDeleting("bulk");
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch("/api/batches", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          })
        )
      );
      setBatches((prev) => prev.filter((b) => !selectedIds.includes(b.id)));
      setSelectedIds([]);
    } catch {
      // error handled
    } finally {
      setDeleting(null);
    }
  };

  const handleBulkExport = async (format: "csv" | "json") => {
    const selectedBatches = batches.filter((b) => selectedIds.includes(b.id));
    if (selectedBatches.length === 0) return;

    if (format === "csv") {
      const headers = [
        "Batch Code",
        "Product",
        "Print Quantity",
        "Material",
        "QR Color",
        "Production Date",
        "Expiry Date",
        "Facility",
        "Scan Count",
        "Status",
        "Created At",
      ];
      const rows = selectedBatches.map((b) => [
        b.batchCode,
        b.productName,
        b.printQuantity.toString(),
        b.packagingMaterial,
        b.qrColorName,
        b.productionDate,
        b.expiryDate || "",
        b.facility || "",
        b.scanCount.toString(),
        b.status,
        new Date(b.createdAt).toISOString(),
      ]);
      const csv = [headers.join(","), ...rows.map((r) => r.map(escapeCSV).join(","))].join("\n");
      downloadFile(csv, `batches-${Date.now()}.csv`, "text/csv");
    } else {
      const json = JSON.stringify(selectedBatches, null, 2);
      downloadFile(json, `batches-${Date.now()}.json`, "application/json");
    }
  };

  const escapeCSV = (field: string) => {
    if (field.includes(",") || field.includes('"') || field.includes("\n")) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
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

  const handleSelectionChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((s) => s !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedFilteredBatches.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSort = (key: keyof BatchRecord) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const filteredBatches = useMemo(() => {
    let result = [...batches];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.batchCode.toLowerCase().includes(q) ||
          b.productName.toLowerCase().includes(q) ||
          b.packagingMaterial.toLowerCase().includes(q)
      );
    }
    if (materialFilter) {
      result = result.filter((b) => b.packagingMaterial === materialFilter);
    }
    if (statusFilter) {
      result = result.filter((b) => b.status === statusFilter);
    }

    result.sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [batches, search, materialFilter, statusFilter, sortConfig]);

  const totalPages = Math.ceil(filteredBatches.length / ITEMS_PER_PAGE) || 1;
  const paginatedFilteredBatches = useMemo(
    () =>
      filteredBatches.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [filteredBatches, currentPage]
  );

  const materials = useMemo(
    () => [...new Set(batches.map((b) => b.packagingMaterial))].sort(),
    [batches]
  );

  const getSortIcon = (key: keyof BatchRecord) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Batch Registry
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage traceable print runs with inline editing, bulk operations, and export.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin/qr")}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Batch
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 mb-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search batch code, product, material..."
              className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={materialFilter}
              onChange={(e) => {
                setMaterialFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Materials</option>
              {materials.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="depleted">Depleted</option>
              <option value="recalled">Recalled</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {selectedIds.length} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleBulkExport("csv")}>
                <FileText className="w-4 h-4 mr-1.5" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkExport("json")}>
                <Download className="w-4 h-4 mr-1.5" />
                Export JSON
              </Button>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-neutral-400 dark:text-neutral-500">Loading...</div>
        ) : filteredBatches.length === 0 ? (
          <div className="p-8 text-center text-neutral-400 dark:text-neutral-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
            <p>No batches found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="px-4 py-3 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === paginatedFilteredBatches.length && paginatedFilteredBatches.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer select-none" onClick={() => handleSort("batchCode")}>
                      Batch Code {getSortIcon("batchCode")}
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer select-none" onClick={() => handleSort("productName")}>
                      Product {getSortIcon("productName")}
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer select-none" onClick={() => handleSort("printQuantity")}>
                      Print Qty {getSortIcon("printQuantity")}
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer select-none" onClick={() => handleSort("packagingMaterial")}>
                      Material {getSortIcon("packagingMaterial")}
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer select-none" onClick={() => handleSort("qrColorName")}>
                      QR Color {getSortIcon("qrColorName")}
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer select-none" onClick={() => handleSort("status")}>
                      Status {getSortIcon("status")}
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer select-none" onClick={() => handleSort("scanCount")}>
                      Scans {getSortIcon("scanCount")}
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer select-none" onClick={() => handleSort("createdAt")}>
                      Created {getSortIcon("createdAt")}
                    </th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedFilteredBatches.map((batch) => (
                    <BatchRow
                      key={batch.id}
                      batch={batch}
                      selected={selectedIds.includes(batch.id)}
                      onSelectionChange={(checked) => handleSelectionChange(batch.id, checked)}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                      saving={saving === batch.id}
                      deleting={deleting === batch.id || (deleting === "bulk" && selectedIds.includes(batch.id))}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  Page {currentPage} of {totalPages} · {filteredBatches.length} batches
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed dark:text-neutral-400 dark:hover:text-neutral-200"
                    aria-label="First page"
                  >
                    <ChevronsLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed dark:text-neutral-400 dark:hover:text-neutral-200"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            pageNum === currentPage
                              ? "bg-brand-600 text-white"
                              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed dark:text-neutral-400 dark:hover:text-neutral-200"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed dark:text-neutral-400 dark:hover:text-neutral-200"
                    aria-label="Last page"
                  >
                    <ChevronsRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BatchRow({
  batch,
  selected,
  onSelectionChange,
  onUpdate,
  onDelete,
  saving,
  deleting,
}: {
  batch: BatchRecord;
  selected: boolean;
  onSelectionChange: (checked: boolean) => void;
  onUpdate: (id: string, updates: Partial<BatchRecord>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  saving: boolean;
  deleting: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    printQuantity: batch.printQuantity,
    packagingMaterial: batch.packagingMaterial,
    status: batch.status,
  });

  const handleSave = async () => {
    await onUpdate(batch.id, draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft({
      printQuantity: batch.printQuantity,
      packagingMaterial: batch.packagingMaterial,
      status: batch.status,
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <tr className="bg-brand-50/50 dark:bg-brand-900/20">
        <td className="px-4 py-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelectionChange(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
          />
        </td>
        <td className="px-4 py-2 font-mono text-brand-700 dark:text-brand-300">{batch.batchCode}</td>
        <td className="px-4 py-2">{batch.productName}</td>
        <td className="px-4 py-2">
          <input
            type="number"
            value={draft.printQuantity}
            onChange={(e) => setDraft({ ...draft, printQuantity: Math.max(1, parseInt(e.target.value) || 1) })}
            min="1"
            className="w-20 text-sm border rounded px-2 py-1 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </td>
        <td className="px-4 py-2">
          <select
            value={draft.packagingMaterial}
            onChange={(e) => setDraft({ ...draft, packagingMaterial: e.target.value })}
            className="w-full text-sm border rounded px-2 py-1 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {MATERIAL_CONFIGS.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </td>
        <td className="px-4 py-2">{batch.qrColorName}</td>
        <td className="px-4 py-2">
          <select
            value={draft.status}
            onChange={(e) => setDraft({ ...draft, status: e.target.value as "active" | "depleted" | "recalled" })}
            className="w-full text-sm border rounded px-2 py-1 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="active">Active</option>
            <option value="depleted">Depleted</option>
            <option value="recalled">Recalled</option>
          </select>
        </td>
        <td className="px-4 py-2">{batch.scanCount.toLocaleString()}</td>
        <td className="px-4 py-2">{new Date(batch.createdAt).toLocaleDateString()}</td>
        <td className="px-4 py-2 text-right">
          <div className="flex items-center justify-end gap-1">
            <Button size="sm" variant="primary" onClick={handleSave} loading={saving}>
              <Save className="w-3.5 h-3.5" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelectionChange(e.target.checked)}
          className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
        />
      </td>
      <td className="px-4 py-3 font-mono text-brand-700 dark:text-brand-300">{batch.batchCode}</td>
      <td className="px-4 py-3">{batch.productName}</td>
      <td className="px-4 py-3">{batch.printQuantity.toLocaleString()}</td>
      <td className="px-4 py-3">{batch.packagingMaterial}</td>
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center gap-1 text-sm"
          style={{ color: batch.qrColor }}
        >
          <span className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: batch.qrColor }} />
          {batch.qrColorName}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
          batch.status === "active"
            ? "bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300"
            : batch.status === "depleted"
            ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
            : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
        }`}>
          {batch.status}
        </span>
      </td>
      <td className="px-4 py-3 font-mono">{batch.scanCount.toLocaleString()}</td>
      <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
        {new Date(batch.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
            <Edit className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(batch.id)} loading={deleting}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}