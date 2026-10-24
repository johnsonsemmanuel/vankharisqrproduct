"use client";

import { useState } from "react";
import { Check, X, Edit2, Trash2, ExternalLink, ShieldCheck, Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BatchRecord } from "@/lib/batch-store";

interface BatchTableProps {
  batches: BatchRecord[];
  onUpdate: (id: string, updates: Partial<BatchRecord>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onBulkExportCSV?: (selectedIds: string[]) => void;
}

const MATERIAL_OPTIONS = [
  "White Poly Sack",
  "Kraft Eco-Paper",
  "Matte Black Pouch",
  "Kharis Green Sack",
  "Shiny Silver Foil",
  "Shiny Gold Foil",
  "Glossy Laminated Plastic",
  "Industrial Black Rubber",
  "Clear Poly Film",
];

export default function BatchTable({
  batches,
  onUpdate,
  onDelete,
  onBulkExportCSV,
}: BatchTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.length === batches.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(batches.map((b) => b.id || b.batchCode));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkExport = () => {
    const targets =
      selectedIds.length > 0
        ? batches.filter((b) => selectedIds.includes(b.id || b.batchCode))
        : batches;

    const headers = [
      "Batch Code",
      "Product Name",
      "Product Slug",
      "Print Quantity",
      "Packaging Material",
      "Production Date",
      "Status",
      "Scan Count",
    ];

    const rows = targets.map((b) => [
      `"${b.batchCode}"`,
      `"${b.productName}"`,
      `"${b.productSlug}"`,
      b.printQuantity,
      `"${b.packagingMaterial}"`,
      `"${b.productionDate}"`,
      `"${b.status}"`,
      b.scanCount,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `kharis-batches-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-3">
      {/* Bulk Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
          <span>{batches.length} total registered print batches</span>
          {selectedIds.length > 0 && (
            <span className="font-semibold text-kharis-green-700 dark:text-kharis-green-300">
              ({selectedIds.length} selected)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBulkExport}
            className="text-xs h-8 rounded-lg gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-neutral-950/80 border-b border-gray-200 dark:border-neutral-800 text-[11px] font-bold text-gray-600 dark:text-neutral-300">
              <th className="py-3 px-3 w-8">
                <input
                  type="checkbox"
                  checked={batches.length > 0 && selectedIds.length === batches.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-kharis-green-600 focus:ring-kharis-green-500"
                />
              </th>
              <th className="py-3 px-3">Batch Code</th>
              <th className="py-3 px-3">Product Item</th>
              <th className="py-3 px-3">Packaging Material</th>
              <th className="py-3 px-3">Print Run Volume</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-center">Verified Scans</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
            {batches.map((batch) => {
              const isSelected = selectedIds.includes(batch.id || batch.batchCode);
              const isEditing = editingId === (batch.id || batch.batchCode);

              return (
                <BatchTableRow
                  key={batch.id || batch.batchCode}
                  batch={batch}
                  isSelected={isSelected}
                  isEditing={isEditing}
                  onToggleSelect={() => toggleSelect(batch.id || batch.batchCode)}
                  onStartEdit={() => setEditingId(batch.id || batch.batchCode)}
                  onCancelEdit={() => setEditingId(null)}
                  onSave={async (updates) => {
                    await onUpdate(batch.id || batch.batchCode, updates);
                    setEditingId(null);
                  }}
                  onDelete={() => onDelete(batch.id || batch.batchCode)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BatchTableRow({
  batch,
  isSelected,
  isEditing,
  onToggleSelect,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: {
  batch: BatchRecord;
  isSelected: boolean;
  isEditing: boolean;
  onToggleSelect: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (updates: Partial<BatchRecord>) => Promise<void>;
  onDelete: () => void;
}) {
  const [printQty, setPrintQty] = useState(batch.printQuantity);
  const [material, setMaterial] = useState(batch.packagingMaterial);
  const [status, setStatus] = useState(batch.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        printQuantity: Number(printQty),
        packagingMaterial: material,
        status,
      });
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <tr className="bg-amber-50/50 dark:bg-amber-950/20">
        <td className="py-3 px-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="rounded border-gray-300 text-kharis-green-600 focus:ring-kharis-green-500"
          />
        </td>
        <td className="py-3 px-3 font-mono font-bold text-gray-900 dark:text-neutral-100">
          {batch.batchCode}
        </td>
        <td className="py-3 px-3 text-gray-700 dark:text-neutral-300">
          {batch.productName}
        </td>
        <td className="py-3 px-3">
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="text-xs rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1"
          >
            {MATERIAL_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </td>
        <td className="py-3 px-3">
          <input
            type="number"
            min={1}
            value={printQty}
            onChange={(e) => setPrintQty(Number(e.target.value))}
            className="w-24 text-xs rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1 font-mono"
          />
        </td>
        <td className="py-3 px-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="text-xs rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1 font-semibold"
          >
            <option value="active">Active</option>
            <option value="depleted">Depleted</option>
            <option value="recalled">Recalled</option>
          </select>
        </td>
        <td className="py-3 px-3 text-center font-mono text-gray-500">
          {batch.scanCount}
        </td>
        <td className="py-3 px-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="p-1.5 rounded-lg bg-brand-700 text-white hover:bg-brand-800 cursor-pointer"
              title="Save changes"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 cursor-pointer"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr
      className={`hover:bg-gray-50/70 dark:hover:bg-neutral-800/40 transition-colors ${
        isSelected ? "bg-kharis-green-50/40 dark:bg-kharis-green-950/20" : ""
      }`}
    >
      <td className="py-3 px-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="rounded border-gray-300 text-kharis-green-600 focus:ring-kharis-green-500"
        />
      </td>
      <td className="py-3 px-3 font-mono font-bold text-gray-900 dark:text-neutral-100">
        {batch.batchCode}
      </td>
      <td className="py-3 px-3 text-gray-800 dark:text-neutral-200">
        {batch.productName}
      </td>
      <td className="py-3 px-3 text-gray-600 dark:text-neutral-300">
        {batch.packagingMaterial}
      </td>
      <td className="py-3 px-3 font-mono font-semibold text-brand-700">
        {batch.printQuantity.toLocaleString()} bags
      </td>
      <td className="py-3 px-3">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
            batch.status === "active"
              ? "bg-brand-700 text-white"
              : batch.status === "depleted"
              ? "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-neutral-800 dark:text-neutral-300"
              : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/70 dark:text-rose-300"
          }`}
        >
          {batch.status ? batch.status.toUpperCase() : "ACTIVE"}
        </span>
      </td>
      <td className="py-3 px-3 text-center font-mono font-bold text-gray-900 dark:text-neutral-100">
        {batch.scanCount.toLocaleString()}
      </td>
      <td className="py-3 px-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={`/product/${batch.productSlug}?batch=${batch.batchCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-md text-gray-400 hover:text-brand-700 cursor-pointer"
            title="Verify consumer page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={onStartEdit}
            className="p-1 rounded-md text-gray-400 hover:text-amber-600 cursor-pointer"
            title="Edit batch"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1 rounded-md text-gray-400 hover:text-rose-600 cursor-pointer"
            title="Delete batch"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
