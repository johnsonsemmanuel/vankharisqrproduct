"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Palette,
  Box,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  Check,
  Copy,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkAuth } from "@/lib/admin-auth";
import { MATERIAL_CONFIGS, COLOR_PRESETS } from "@/lib/qr-types";

interface MaterialConfig {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  badge: string;
  approxBgHex: string;
  bracketColor: string;
  hasGlare: boolean;
  style: React.CSSProperties;
  description: string;
}

interface ColorPresetConfig {
  id: string;
  name: string;
  hex: string;
  swatchBg: string;
  hint?: string;
}

export default function PresetsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<MaterialConfig[]>([]);
  const [colors, setColors] = useState<ColorPresetConfig[]>([]);

  // Custom presets stored in localStorage
  const [customMaterials, setCustomMaterials] = useState<MaterialConfig[]>([]);
  const [customColors, setCustomColors] = useState<ColorPresetConfig[]>([]);

  // Editing state
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const [materialDraft, setMaterialDraft] = useState<Partial<MaterialConfig>>({});
  const [colorDraft, setColorDraft] = useState<Partial<ColorPresetConfig>>({});

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/admin/login?redirect=/admin/qr/presets");
      return;
    }
    loadPresets();
  }, [router]);

  const loadPresets = () => {
    try {
      const savedMaterials = localStorage.getItem("kharis_custom_materials");
      const savedColors = localStorage.getItem("kharis_custom_colors");
      if (savedMaterials) setCustomMaterials(JSON.parse(savedMaterials));
      if (savedColors) setCustomColors(JSON.parse(savedColors));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const saveMaterials = (newMaterials: MaterialConfig[]) => {
    setCustomMaterials(newMaterials);
    localStorage.setItem("kharis_custom_materials", JSON.stringify(newMaterials));
  };

  const saveColors = (newColors: ColorPresetConfig[]) => {
    setCustomColors(newColors);
    localStorage.setItem("kharis_custom_colors", JSON.stringify(newColors));
  };

  const allMaterials = useMemo(
    () => [...MATERIAL_CONFIGS, ...customMaterials],
    [customMaterials]
  );
  const allColors = useMemo(
    () => [...COLOR_PRESETS, ...customColors],
    [customColors]
  );

  const handleAddMaterial = () => {
    const newMaterial: MaterialConfig = {
      id: `custom-${Date.now()}`,
      name: "",
      category: "other",
      categoryLabel: "Custom",
      badge: "Custom",
      approxBgHex: "#ffffff",
      bracketColor: "border-neutral-800",
      hasGlare: false,
      style: { backgroundColor: "#ffffff" },
      description: "",
    };
    setMaterials((prev) => [...prev, newMaterial]);
    setEditingMaterialId(newMaterial.id);
    setMaterialDraft(newMaterial);
  };

  const handleAddColor = () => {
    const newColor: ColorPresetConfig = {
      id: `custom-${Date.now()}`,
      name: "",
      hex: "#000000",
      swatchBg: "bg-black",
      hint: "Custom QR color",
    };
    setColors((prev) => [...prev, newColor]);
    setEditingColorId(newColor.id);
    setColorDraft(newColor);
  };

  const handleSaveMaterial = (material: MaterialConfig) => {
    const updated = allMaterials.map((m) => (m.id === material.id ? material : m));
    const custom = updated.filter((m) => m.id.startsWith("custom-"));
    saveMaterials(custom);
    setMaterials((prev) => prev.map((m) => (m.id === material.id ? material : m)));
    setEditingMaterialId(null);
  };

  const handleSaveColor = (color: ColorPresetConfig) => {
    const updated = allColors.map((c) => (c.id === color.id ? color : c));
    const custom = updated.filter((c) => c.id.startsWith("custom-"));
    saveColors(custom);
    setColors((prev) => prev.map((c) => (c.id === color.id ? color : c)));
    setEditingColorId(null);
  };

  const handleDeleteMaterial = (id: string) => {
    if (!confirm("Delete this material preset? This cannot be undone.")) return;
    const custom = customMaterials.filter((m) => m.id !== id);
    saveMaterials(custom);
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const handleDeleteColor = (id: string) => {
    if (!confirm("Delete this color preset? This cannot be undone.")) return;
    const custom = customColors.filter((c) => c.id !== id);
    saveColors(custom);
    setColors((prev) => prev.filter((c) => c.id !== id));
  };

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
            Material & Color Presets
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage packaging substrates and QR color presets used across the studio.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={handleAddMaterial}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Material
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddColor}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Color
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Materials */}
        <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Packaging Materials
              </h2>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {allMaterials.length} total ({customMaterials.length} custom)
            </span>
          </div>

          <div className="space-y-3">
            {allMaterials.map((material) => (
              <MaterialRow
                key={material.id}
                material={material}
                isCustom={material.id.startsWith("custom-")}
                editing={editingMaterialId === material.id}
                draft={materialDraft}
                onEdit={() => {
                  setEditingMaterialId(material.id);
                  setMaterialDraft(material);
                }}
                onSave={() => handleSaveMaterial(materialDraft as MaterialConfig)}
                onCancel={() => setEditingMaterialId(null)}
                onDelete={() => handleDeleteMaterial(material.id)}
                onChange={setMaterialDraft}
              />
            ))}
          </div>
        </section>

        {/* Colors */}
        <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                QR Colors
              </h2>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {allColors.length} total ({customColors.length} custom)
            </span>
          </div>

          <div className="space-y-3">
            {allColors.map((color) => (
              <ColorRow
                key={color.id}
                color={color}
                isCustom={color.id.startsWith("custom-")}
                editing={editingColorId === color.id}
                draft={colorDraft}
                onEdit={() => {
                  setEditingColorId(color.id);
                  setColorDraft(color);
                }}
                onSave={() => handleSaveColor(colorDraft as ColorPresetConfig)}
                onCancel={() => setEditingColorId(null)}
                onDelete={() => handleDeleteColor(color.id)}
                onChange={setColorDraft}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Usage Guide */}
      <section className="mt-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Usage Guide
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-brand-50 dark:bg-brand-900/30 p-4 rounded-xl border border-brand-200 dark:border-brand-800">
            <h4 className="font-bold text-brand-800 dark:text-brand-300 mb-2">Material Presets</h4>
            <ul className="space-y-1 text-brand-700 dark:text-brand-400 text-xs">
              <li>• Auto-match selects best substrate for QR contrast</li>
              <li>• 14 built-in materials: sacks, papers, foils, rubber, film</li>
              <li>• Custom materials save to browser storage</li>
              <li>• Used in QR Studio for substrate simulation</li>
            </ul>
          </div>
          <div className="bg-brand-50 dark:bg-brand-900/30 p-4 rounded-xl border border-brand-200 dark:border-brand-800">
            <h4 className="font-bold text-brand-800 dark:text-brand-300 mb-2">Color Presets</h4>
            <ul className="space-y-1 text-brand-700 dark:text-brand-400 text-xs">
              <li>• 4 built-in: Black, White, Brand Green, Metallic Gold</li>
              <li>• Custom colors support any hex value</li>
              <li>• Colors apply to QR dots, corners, and center</li>
              <li>• Exact hex preserved in PNG/SVG exports</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function MaterialRow({
  material,
  isCustom,
  editing,
  draft,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onChange,
}: {
  material: MaterialConfig;
  isCustom: boolean;
  editing: boolean;
  draft: Partial<MaterialConfig>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onChange: (draft: Partial<MaterialConfig>) => void;
}) {
  if (editing) {
    return (
      <div className="bg-brand-50/50 dark:bg-brand-900/20 rounded-xl p-4 space-y-3 border border-brand-200/50 dark:border-brand-700/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Name</label>
            <input
              value={draft.name || material.name}
              onChange={(e) => onChange({ ...draft, name: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Category</label>
            <select
              value={draft.category || material.category}
              onChange={(e) => onChange({ ...draft, category: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="sacks">Standard Sacks</option>
              <option value="dark">Dark Packaging</option>
              <option value="shiny">Premium Foil</option>
              <option value="rubber">Specialty Coatings</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Badge</label>
            <input
              value={draft.badge || material.badge}
              onChange={(e) => onChange({ ...draft, badge: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Background Hex</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={draft.approxBgHex || material.approxBgHex}
                onChange={(e) => onChange({ ...draft, approxBgHex: e.target.value })}
                className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 cursor-pointer"
              />
              <input
                value={draft.approxBgHex || material.approxBgHex}
                onChange={(e) => onChange({ ...draft, approxBgHex: e.target.value })}
                className="flex-1 px-3 py-2 text-sm font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Bracket Border Color</label>
            <input
              value={draft.bracketColor || material.bracketColor}
              onChange={(e) => onChange({ ...draft, bracketColor: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="border-brand-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`glare-${material.id}`}
              checked={draft.hasGlare ?? material.hasGlare}
              onChange={(e) => onChange({ ...draft, hasGlare: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor={`glare-${material.id}`} className="text-sm text-neutral-700 dark:text-neutral-300">
              Has Glare/Reflection
            </label>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Description</label>
            <textarea
              value={draft.description || material.description}
              onChange={(e) => onChange({ ...draft, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-brand-200/50 dark:border-brand-700/50">
          <Button size="sm" variant="primary" onClick={onSave}>
            <Save className="w-3.5 h-3.5 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancel}>
            <X className="w-3.5 h-3.5 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
      <div
        className="w-12 h-12 rounded-lg border flex items-center justify-center text-center"
        style={{
          backgroundColor: material.approxBgHex,
          borderColor: material.bracketColor.replace("border-", ""),
        }}
      >
        <span className="text-[10px] font-bold text-white mix-blend-difference">{material.badge}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">{material.name}</h3>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
            {material.categoryLabel}
          </span>
          {isCustom && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300">
              Custom
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{material.description}</p>
      </div>
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" onClick={onEdit} aria-label="Edit">
          <Edit className="w-4 h-4" />
        </Button>
        {isCustom && (
          <Button size="icon" variant="destructive" onClick={onDelete} aria-label="Delete">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function ColorRow({
  color,
  isCustom,
  editing,
  draft,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onChange,
}: {
  color: ColorPresetConfig;
  isCustom: boolean;
  editing: boolean;
  draft: Partial<ColorPresetConfig>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onChange: (draft: Partial<ColorPresetConfig>) => void;
}) {
  if (editing) {
    return (
      <div className="bg-brand-50/50 dark:bg-brand-900/20 rounded-xl p-4 space-y-3 border border-brand-200/50 dark:border-brand-700/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Name</label>
            <input
              value={draft.name || color.name}
              onChange={(e) => onChange({ ...draft, name: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Hex Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={draft.hex || color.hex}
                onChange={(e) => onChange({ ...draft, hex: e.target.value, swatchBg: `bg-[${e.target.value}]` })}
                className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 cursor-pointer"
              />
              <input
                value={draft.hex || color.hex}
                onChange={(e) => onChange({ ...draft, hex: e.target.value, swatchBg: `bg-[${e.target.value}]` })}
                className="flex-1 px-3 py-2 text-sm font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Hint</label>
            <input
              value={draft.hint || color.hint}
              onChange={(e) => onChange({ ...draft, hint: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-brand-200/50 dark:border-brand-700/50">
          <Button size="sm" variant="primary" onClick={onSave}>
            <Save className="w-3.5 h-3.5 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancel}>
            <X className="w-3.5 h-3.5 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
      <div className="w-12 h-12 rounded-lg border border-neutral-300 dark:border-neutral-600 flex items-center justify-center" style={{ backgroundColor: color.hex }}>
        <span className="text-[10px] font-bold text-white mix-blend-difference">QR</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">{color.name}</h3>
          <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">{color.hex}</span>
          {isCustom && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300">
              Custom
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{color.hint}</p>
      </div>
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" onClick={onEdit} aria-label="Edit">
          <Edit className="w-4 h-4" />
        </Button>
        {isCustom && (
          <Button size="icon" variant="destructive" onClick={onDelete} aria-label="Delete">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}