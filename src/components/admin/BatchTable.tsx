"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2, Save, X, Download, FileText, Package } from "lucide-react";
import type { BatchRecord } from "@/lib/batch-store";
import { MATERIAL_CONFIGS } from "@/lib/qr-types";

interface BatchTableProps {
  batches: BatchRecord[];
  onUpdate: (id: string, data: { printQuantity: number; packagingMaterial: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onBulkExport: (ids: string[], format: "csv" | "zip") => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  selectAll: boolean;
  onSelectAll: () => void;
}

export function BatchTable({
  batches,
  onUpdate,
  onDelete,
  onBulkExport,
  selectedIds,
  onSelectionChange,
  selectAll,
  onSelectAll,
}: BatchTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ printQuantity: number; packagingMaterial: string }>({ printQuantity: 0, packagingMaterial: "" });

  const handleEditClick = (batch: BatchRecord) => {
    setEditingId(batch.id);
    setDraft({ printQuantity: batch.printQuantity, packagingMaterial: batch.packagingMaterial });
  };

  const handleSave = async (batch: BatchRecord) => {
    await onUpdate(batch.id, draft);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = async (batch: BatchRecord) => {
    if (confirm(`Delete batch ${batch.batchCode}? This cannot be undone.`)) {
      await onDelete(batch.id);
    }
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((s) => s !== id));
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectionChange([]);
    } else {
      onSelectionChange(batches.map((b) => b.id));
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
      {selectedIds.length > 0 && (
        <div className="sticky bottom-0 bg-white/95 dark:bg-neutral-950/95 backdrop-blur border-t border-neutral-200 dark:border-neutral-800 p-4 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {selectedIds.length} batch{selectedIds.length !== 1 ? "es" : ""} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onBulkExport(selectedIds, "csv")}>
                <FileText className="w-4 h-4 mr-1" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => onBulkExport(selectedIds, "zip")}>
                <Download className="w-4 h-4 mr-1" />
                Export QR ZIP
              </Button>
              <Button variant="destructive" size="sm" onClick={() => {
                if (confirm(`Delete ${selectedIds.length} batches? This cannot be undone.`)) {
                  selectedIds.forEach(id => onDelete(id));
                  onSelectionChange([]);
                }
              }}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAll && batches.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                  aria-label="Select all"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Product</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Batch Code</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Material</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Print Qty</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Scans</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {batches.map((batch) => (
              <BatchRow
                key={batch.id}
                batch={batch}
                editing={editingId === batch.id}
                draft={draft}
                onEditClick={handleEditClick}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
                onSelectChange={(checked) => handleCheckboxChange(batch.id, checked)}
                selected={selectedIds.includes(batch.id)}
                setDraft={setDraft}
              />
            ))}
          </tbody>
        </table>
      </div>

      {batches.length === 0 && (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
          <Package className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
          <p className="text-sm">No batches found</p>
        </div>
      )}
    </div>
  );
}

function BatchRow({
  batch,
  editing,
  draft,
  onEditClick,
  onSave,
  onCancel,
  onDelete,
  onSelectChange,
  selected,
  setDraft,
}: {
  batch: BatchRecord;
  editing: boolean;
  draft: { printQuantity: number; packagingMaterial: string };
  onEditClick: (batch: BatchRecord) => void;
  onSave: (batch: BatchRecord) => void;
  onCancel: () => void;
  onDelete: (batch: BatchRecord) => void;
  onSelectChange: (checked: boolean) => void;
  selected: boolean;
  setDraft: React.Dispatch<React.SetStateAction<{ printQuantity: number; packagingMaterial: string }>>;
}) {
  return editing ? (
    <tr className="bg-brand-50/50 dark:bg-brand-900/20">
      <td className="px-4 py-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelectChange(e.target.checked)}
          className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
        />
      </td>
      <td className="px-4 py-2">{batch.productName}</td>
      <td className="px-4 py-2 font-mono text-brand-700 dark:text-brand-300">{batch.batchCode}</td>
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
      <td className="px-4 py-2">
        <input
          type="number"
          value={draft.printQuantity}
          onChange={(e) => setDraft({ ...draft, printQuantity: parseInt(e.target.value) || 0 })}
          min="1"
          className="w-24 text-sm border rounded px-2 py-1 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </td>
      <td className="px-4 py-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
          batch.scanCount > 0
            ? "bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700"
            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
        }`}>
          {batch.scanCount > 0 ? "Active" : "Pending"}
        </span>
      </td>
      <td className="px-4 py-2 font-mono">{batch.scanCount.toLocaleString()}</td>
      <td className="px-4 py-2">
        <div className="flex gap-1">
          <Button size="sm" variant="default" onClick={() => onSave(batch)}>
            <Save className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancel}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  ) : (
    <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelectChange(e.target.checked)}
          className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
        />
      </td>
      <td className="px-4 py-3">{batch.productName}</td>
      <td className="px-4 py-3 font-mono text-brand-700 dark:text-brand-300">{batch.batchCode}</td>
      <td className="px-4 py-3">{batch.packagingMaterial}</td>
      <td className="px-4 py-3">{batch.printQuantity.toLocaleString()}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
          batch.scanCount > 0
            ? "bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700"
            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
        }`}>
          {batch.scanCount > 0 ? "Active" : "Pending"}
        </span>
      </td>
      <td className="px-4 py-3 font-mono">{batch.scanCount.toLocaleString()}</td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => onEditClick(batch)}>
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(batch)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}