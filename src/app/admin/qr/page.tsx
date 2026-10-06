"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import QRCodeStyling from "qr-code-styling";
import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Copy,
  Check,
  Download,
  Palette,
  Eye,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Sun,
  Layers,
  Paintbrush,
  Package,
  PackageCheck,
  Search,
  ExternalLink,
  X,
  Calendar,
  Hash,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { checkAuth, logout as adminLogout } from "@/lib/admin-auth";
import type { BatchRecord } from "@/lib/batch-store";

const BASE_URL = "https://kharisfoods.vankharis.com";

export type QRColorPreset = "black" | "white" | "green" | "gold" | "custom";
export type QRBgMode = "transparent" | "solid";

export type MaterialId =
  | "auto"
  | "white-sack"
  | "kraft-paper"
  | "dark-matte"
  | "brand-green"
  | "shiny-silver"
  | "shiny-gold"
  | "glossy-laminate"
  | "rubber-matte"
  | "rubber-silicone"
  | "clear-film"
  | "custom-substrate";

interface MaterialConfig {
  id: MaterialId;
  name: string;
  category: "sacks" | "dark" | "shiny" | "rubber" | "other";
  categoryLabel: string;
  badge: string;
  approxBgHex: string;
  bracketColor: string;
  hasGlare: boolean;
  style: React.CSSProperties;
  description: string;
}

const MATERIAL_CONFIGS: MaterialConfig[] = [
  {
    id: "white-sack",
    name: "White Poly Sack",
    category: "sacks",
    categoryLabel: "Standard Sacks",
    badge: "Woven White",
    approxBgHex: "#f5f5f7",
    bracketColor: "border-stone-800 dark:border-stone-200",
    hasGlare: false,
    style: {
      backgroundColor: "#f5f5f8",
      backgroundImage:
        "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(180deg, #fafafc 0%, #eeeff3 100%)",
      backgroundSize: "6px 6px, 100% 100%",
      boxShadow: "inset 0 0 35px rgba(0,0,0,0.05)",
    },
    description: "Woven polypropylene grain sack texture with subtle woven grain.",
  },
  {
    id: "kraft-paper",
    name: "Kraft Eco-Paper",
    category: "sacks",
    categoryLabel: "Standard Sacks",
    badge: "Brown Kraft",
    approxBgHex: "#d1ad7e",
    bracketColor: "border-[#422610]",
    hasGlare: false,
    style: {
      backgroundColor: "#d1ad7e",
      backgroundImage:
        "radial-gradient(rgba(70,40,15,0.08) 1px, transparent 0), linear-gradient(135deg, #dfbc8a 0%, #c49e6d 100%)",
      backgroundSize: "4px 4px, 100% 100%",
      boxShadow: "inset 0 0 40px rgba(70,40,15,0.18)",
    },
    description: "Natural unbleached kraft paper or corrugated carton packaging.",
  },
  {
    id: "dark-matte",
    name: "Matte Black Pouch",
    category: "dark",
    categoryLabel: "Dark Packaging",
    badge: "Matte Carbon",
    approxBgHex: "#141416",
    bracketColor: "border-white/80",
    hasGlare: false,
    style: {
      backgroundColor: "#141416",
      backgroundImage:
        "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(180deg, #1c1c1f 0%, #0f0f11 100%)",
      backgroundSize: "5px 5px, 100% 100%",
      boxShadow: "inset 0 0 50px rgba(0,0,0,0.85)",
    },
    description: "Deep carbon black soft-touch matte pouch for dark product packaging.",
  },
  {
    id: "brand-green",
    name: "Kharis Green Sack",
    category: "dark",
    categoryLabel: "Dark Packaging",
    badge: "Brand Green",
    approxBgHex: "#103c15",
    bracketColor: "border-emerald-300",
    hasGlare: false,
    style: {
      backgroundColor: "#103c15",
      backgroundImage:
        "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(135deg, #16501c 0%, #0b2b0e 100%)",
      backgroundSize: "5px 5px, 100% 100%",
      boxShadow: "inset 0 0 40px rgba(0,0,0,0.65)",
    },
    description: "Signature Kharis Foods deep green woven poly packaging sack.",
  },
  {
    id: "shiny-silver",
    name: "Shiny Silver Foil",
    category: "shiny",
    categoryLabel: "Shiny & Metallic",
    badge: "Aluminum Foil",
    approxBgHex: "#d8dbe0",
    bracketColor: "border-slate-800",
    hasGlare: true,
    style: {
      background:
        "linear-gradient(135deg, #c5c9d1 0%, #ffffff 25%, #a8aeb8 45%, #ffffff 65%, #9299a5 100%)",
      boxShadow:
        "inset 0 0 50px rgba(255,255,255,0.85), inset 0 0 25px rgba(0,0,0,0.25)",
      border: "1px solid rgba(255,255,255,0.6)",
    },
    description: "Reflective metallic aluminum foil pouch with specular specular sheen.",
  },
  {
    id: "shiny-gold",
    name: "Shiny Gold Foil",
    category: "shiny",
    categoryLabel: "Shiny & Metallic",
    badge: "Gold Metallic",
    approxBgHex: "#caa148",
    bracketColor: "border-[#432c02]",
    hasGlare: true,
    style: {
      background:
        "linear-gradient(135deg, #c8952c 0%, #fff0b8 25%, #af7e1d 48%, #ffea9f 70%, #855a0b 100%)",
      boxShadow:
        "inset 0 0 50px rgba(255,255,255,0.7), inset 0 0 25px rgba(70,45,0,0.35)",
      border: "1px solid rgba(255,230,150,0.7)",
    },
    description: "Luxury shiny golden packaging pouch with metallic reflections.",
  },
  {
    id: "glossy-laminate",
    name: "Glossy Laminated Plastic",
    category: "shiny",
    categoryLabel: "Shiny & Metallic",
    badge: "High Gloss",
    approxBgHex: "#ffffff",
    bracketColor: "border-neutral-900",
    hasGlare: true,
    style: {
      backgroundColor: "#ffffff",
      backgroundImage:
        "linear-gradient(120deg, rgba(255,255,255,0.9) 0%, rgba(235,245,255,0.75) 35%, rgba(255,255,255,0.98) 55%, rgba(230,240,250,0.7) 100%)",
      boxShadow:
        "inset 0 0 35px rgba(200,225,255,0.35), inset 0 2px 10px rgba(255,255,255,0.9)",
    },
    description: "High-gloss laminated polybag with reflective surface glaze.",
  },
  {
    id: "rubber-matte",
    name: "Industrial Black Rubber",
    category: "rubber",
    categoryLabel: "Rubber & Silicone",
    badge: "Textured Rubber",
    approxBgHex: "#161718",
    bracketColor: "border-white/90",
    hasGlare: false,
    style: {
      backgroundColor: "#161718",
      backgroundImage:
        "radial-gradient(rgba(255,255,255,0.09) 1.2px, transparent 1.2px), radial-gradient(rgba(0,0,0,0.7) 1px, transparent 1px)",
      backgroundSize: "4px 4px, 8px 8px",
      boxShadow:
        "inset 0 3px 12px rgba(0,0,0,0.95), inset 0 -3px 12px rgba(255,255,255,0.06)",
    },
    description: "Vulcanized black textured rubber or tyre-grip substrate with micro-stippling.",
  },
  {
    id: "rubber-silicone",
    name: "Silicone / Soft Rubber",
    category: "rubber",
    categoryLabel: "Rubber & Silicone",
    badge: "Matte Silicone",
    approxBgHex: "#282c30",
    bracketColor: "border-white/80",
    hasGlare: false,
    style: {
      backgroundColor: "#282c30",
      backgroundImage:
        "radial-gradient(circle at 50% 25%, #3c4248 0%, #1c1f22 100%)",
      boxShadow: "inset 0 0 35px rgba(0,0,0,0.75)",
    },
    description: "Velvety matte silicone or soft-touch molded rubber compound.",
  },
  {
    id: "clear-film",
    name: "Clear Poly Film",
    category: "other",
    categoryLabel: "Transparent Film",
    badge: "Window Film",
    approxBgHex: "#e2d7c0",
    bracketColor: "border-stone-800",
    hasGlare: true,
    style: {
      backgroundColor: "#e2d7c0",
      backgroundImage:
        "radial-gradient(#cbb993 2.5px, transparent 2.5px), radial-gradient(#d9caa6 3.5px, transparent 3.5px), linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 100%)",
      backgroundSize: "14px 14px, 20px 20px, 100% 100%",
      boxShadow: "inset 0 0 30px rgba(0,0,0,0.12)",
    },
    description: "Transparent window packaging showing yellow/golden maize grains underneath.",
  },
];

interface ColorPresetConfig {
  id: QRColorPreset;
  name: string;
  hex: string;
  swatchBg: string;
  hint: string;
}

const COLOR_PRESETS: ColorPresetConfig[] = [
  {
    id: "black",
    name: "Black",
    hex: "#000000",
    swatchBg: "bg-black",
    hint: "Universal standard for light materials: white sacks, paper & clear films.",
  },
  {
    id: "white",
    name: "White",
    hex: "#ffffff",
    swatchBg: "bg-white",
    hint: "Inverted standard for dark materials: black bags, dark sacks & rubber.",
  },
  {
    id: "green",
    name: "Brand Green",
    hex: "#1b5e20",
    swatchBg: "bg-[#1b5e20]",
    hint: "Kharis Foods signature dark green (#1b5e20).",
  },
  {
    id: "gold",
    name: "Metallic Gold",
    hex: "#c89624",
    swatchBg: "bg-[#c89624]",
    hint: "Premium metallic gold print for luxury specialty packaging.",
  },
];

// Contrast & Luminance Calculations
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (clean.length !== 6) return { r: 0, g: 0, b: 0 };
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const l1 = getLuminance(c1.r, c1.g, c1.b);
  const l2 = getLuminance(c2.r, c2.g, c2.b);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (brighter + 0.05) / (darker + 0.05);
}

// Download helpers ensuring exact colors are preserved
async function downloadHighResPNG({
  productUrl,
  colorHex,
  bgHex,
  includeLogo,
  filename,
}: {
  productUrl: string;
  colorHex: string;
  bgHex: string;
  includeLogo: boolean;
  filename: string;
}) {
  const qr = new QRCodeStyling({
    width: 1200,
    height: 1200,
    data: productUrl,
    type: "canvas",
    image: includeLogo ? "/images/kharisfoods-removebg-preview.png" : undefined,
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 10,
      imageSize: 0.38,
    },
    dotsOptions: {
      color: colorHex,
      type: "rounded",
    },
    cornersSquareOptions: {
      color: colorHex,
      type: "extra-rounded",
    },
    cornersDotOptions: {
      color: colorHex,
      type: "dot",
    },
    backgroundOptions: {
      color: bgHex,
    },
  });

  await qr.download({
    name: filename,
    extension: "png",
  });
}

function downloadExactSVG({
  qrElement,
  filename,
}: {
  qrElement: HTMLDivElement | null;
  filename: string;
}) {
  const svgEl = qrElement?.querySelector("svg");
  if (!svgEl) return;

  const clone = svgEl.cloneNode(true) as SVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(clone);
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function AdminQRPage() {
  const router = useRouter();
  const [baseUrl, setBaseUrl] = useState(BASE_URL);

  // Global presets
  const [globalColor, setGlobalColor] = useState<string>("#000000");
  const [globalColorMode, setGlobalColorMode] = useState<QRColorPreset>("black");
  const [globalMaterial, setGlobalMaterial] = useState<MaterialId>("auto");
  const [globalTimestamp, setGlobalTimestamp] = useState<number>(0);

  // Batches registry state
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [loadingBatches, setLoadingBatches] = useState<boolean>(true);
  const [batchSearch, setBatchSearch] = useState<string>("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<(typeof products)[number] | null>(null);
  const [modalBatchCode, setModalBatchCode] = useState("");
  const [modalColorHex, setModalColorHex] = useState("#000000");
  const [modalColorName, setModalColorName] = useState("Black");
  const [modalMaterialName, setModalMaterialName] = useState("White Poly Sack");

  const fetchBatches = async () => {
    try {
      const res = await fetch("/api/batches");
      const data = await res.json();
      if (data.ok && Array.isArray(data.batches)) {
        setBatches(data.batches);
      }
    } catch {
      // fallback
    } finally {
      setLoadingBatches(false);
    }
  };

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/admin");
      return;
    }
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      setBaseUrl(`http://localhost:${window.location.port}`);
    }
    fetchBatches();
  }, [router]);

  const applyGlobalColorPreset = (preset: ColorPresetConfig) => {
    setGlobalColorMode(preset.id);
    setGlobalColor(preset.hex);
    setGlobalTimestamp(Date.now());
  };

  const applyGlobalMaterial = (materialId: MaterialId) => {
    setGlobalMaterial(materialId);
    setGlobalTimestamp(Date.now());
  };

  const handleOpenRegisterModal = (
    product: (typeof products)[number],
    batchCode: string,
    colorHex: string,
    colorName: string,
    materialName: string
  ) => {
    setModalProduct(product);
    setModalBatchCode(batchCode);
    setModalColorHex(colorHex);
    setModalColorName(colorName);
    setModalMaterialName(materialName);
    setModalOpen(true);
  };

  const handleBatchRegistered = (newBatch: BatchRecord) => {
    setBatches((prev) => {
      const filtered = prev.filter(
        (b) => b.batchCode.toUpperCase() !== newBatch.batchCode.toUpperCase()
      );
      return [newBatch, ...filtered];
    });
  };

  const filteredBatches = useMemo(() => {
    if (!batchSearch.trim()) return batches;
    const q = batchSearch.trim().toLowerCase();
    return batches.filter(
      (b) =>
        b.batchCode.toLowerCase().includes(q) ||
        b.productName.toLowerCase().includes(q) ||
        b.packagingMaterial.toLowerCase().includes(q)
    );
  }, [batches, batchSearch]);

  const totalQuantityPrinted = useMemo(() => {
    return batches.reduce((sum, b) => sum + (Number(b.printQuantity) || 0), 0);
  }, [batches]);

  const totalScansRecorded = useMemo(() => {
    return batches.reduce((sum, b) => sum + (Number(b.scanCount) || 0), 0);
  }, [batches]);

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-neutral-950 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center justify-between px-5 h-14 max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/kharisfoods-removebg-preview.png"
              alt="Kharis Foods"
              className="h-6 w-auto"
            />
            <div>
              <h1 className="font-bold text-gray-800 dark:text-neutral-100 text-sm leading-none">
                QR Codes
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-neutral-400 mt-0.5">
                Packaging Material & Traceable Batch Generator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-neutral-300 hover:text-gray-800 dark:hover:text-neutral-100 transition-colors"
            >
              <LayoutDashboard className="size-3.5" />
              Dashboard
            </Link>
            <button
              onClick={() => {
                adminLogout();
                router.push("/admin");
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              <LogOut className="size-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Global Packaging Control Center */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-kharis-green-50 dark:bg-kharis-green-950/70 border border-kharis-green-200 dark:border-kharis-green-800 text-kharis-green-700 dark:text-kharis-green-300 shrink-0 mt-0.5">
              <Sparkles className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">
                Packaging Material & Traceable Batch Simulator
              </h2>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Test and verify QR code contrast across real packaging materials, including{" "}
                <strong className="text-gray-900 dark:text-white">Shiny Metallic Foil</strong>,{" "}
                <strong className="text-gray-900 dark:text-white">Industrial Rubber</strong>,{" "}
                <strong className="text-gray-900 dark:text-white">Kraft Paper</strong>, and{" "}
                <strong className="text-gray-900 dark:text-white">Woven Poly Sacks</strong>.
                Register print quantities to trace every printed batch in real time.
              </p>
            </div>
          </div>

          {/* Quick Apply Global Controls */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <span className="font-semibold text-gray-600 dark:text-neutral-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="size-3.5 text-gray-400" />
                Quick Set All Colors:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyGlobalColorPreset(p)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      globalColorMode === p.id
                        ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-neutral-900 dark:border-white shadow-xs"
                        : "bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-neutral-200 border-gray-200 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`size-2.5 rounded-full ${p.swatchBg} ring-1 ring-neutral-400/80`}
                    />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Global Material Quick Tester */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs pt-2 border-t border-gray-100 dark:border-neutral-800/60">
              <span className="font-semibold text-gray-600 dark:text-neutral-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="size-3.5 text-gray-400" />
                Simulate Material Across All:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => applyGlobalMaterial("auto")}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                    globalMaterial === "auto"
                      ? "bg-kharis-green-50 dark:bg-kharis-green-950 border-kharis-green-400 text-kharis-green-700 dark:text-kharis-green-300 font-semibold"
                      : "bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-neutral-300 hover:bg-gray-100"
                  }`}
                >
                  Auto Match
                </button>
                <button
                  type="button"
                  onClick={() => applyGlobalMaterial("white-sack")}
                  className="px-2 py-1 rounded-md text-[11px] font-medium border bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 cursor-pointer"
                >
                  White Sack
                </button>
                <button
                  type="button"
                  onClick={() => applyGlobalMaterial("kraft-paper")}
                  className="px-2 py-1 rounded-md text-[11px] font-medium border bg-[#d6ba90]/20 border-[#c4a478] text-[#5c3e1e] dark:text-[#f3dfc6] hover:bg-[#d6ba90]/30 cursor-pointer"
                >
                  Kraft Paper
                </button>
                <button
                  type="button"
                  onClick={() => applyGlobalMaterial("shiny-silver")}
                  className="px-2 py-1 rounded-md text-[11px] font-medium border bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-800 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
                >
                  ✨ Shiny Foil
                </button>
                <button
                  type="button"
                  onClick={() => applyGlobalMaterial("rubber-matte")}
                  className="px-2 py-1 rounded-md text-[11px] font-medium border bg-neutral-900 border-neutral-700 text-neutral-100 hover:bg-neutral-800 cursor-pointer"
                >
                  🔘 Rubber
                </button>
                <button
                  type="button"
                  onClick={() => applyGlobalMaterial("dark-matte")}
                  className="px-2 py-1 rounded-md text-[11px] font-medium border bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800 cursor-pointer"
                >
                  Matte Black
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards */}
        {products.map((product) => (
          <ProductQRCard
            key={product.id}
            product={product}
            baseUrl={baseUrl}
            globalColor={globalColor}
            globalColorMode={globalColorMode}
            globalMaterial={globalMaterial}
            globalTimestamp={globalTimestamp}
            batches={batches}
            onOpenRegisterModal={handleOpenRegisterModal}
          />
        ))}

        {/* Section 6: Registered Batch Traceability Registry */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <PackageCheck className="size-5 text-kharis-green-700 dark:text-kharis-gold-400" />
                <h2 className="text-base font-bold text-gray-900 dark:text-neutral-100">
                  Batch Traceability & Print Register
                </h2>
              </div>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                Each batch stores the authorized print count, packaging material, and live scan tracking.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={batchSearch}
                  onChange={(e) => setBatchSearch(e.target.value)}
                  placeholder="Search batch or product..."
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 text-xs text-gray-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-kharis-green-500 w-48 sm:w-60"
                />
              </div>
            </div>
          </div>

          {/* Traceability KPI Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800">
              <span className="text-[10px] font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider block">
                Total Batches
              </span>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                {batches.length}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800">
              <span className="text-[10px] font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider block">
                Total Printed Bags
              </span>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                {totalQuantityPrinted.toLocaleString()}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800">
              <span className="text-[10px] font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider block">
                Consumer Scans
              </span>
              <p className="text-lg font-bold text-kharis-green-700 dark:text-emerald-400 mt-0.5">
                {totalScansRecorded.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Traceability Table */}
          {loadingBatches ? (
            <div className="py-8 text-center text-xs text-gray-400">Loading batch records...</div>
          ) : filteredBatches.length === 0 ? (
            <div className="py-8 text-center rounded-xl border border-dashed border-gray-200 dark:border-neutral-800 p-6">
              <Package className="size-8 text-gray-300 dark:text-neutral-700 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600 dark:text-neutral-400">
                No registered batches found
              </p>
              <p className="text-[11px] text-gray-400 dark:text-neutral-500 mt-0.5">
                Use the "Register & Trace Print Run" button above on any product to log how many bags you are printing.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-neutral-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-neutral-800/60 border-b border-gray-200 dark:border-neutral-800 text-[11px] font-bold text-gray-500 dark:text-neutral-400">
                    <th className="py-2.5 px-3">Batch Code</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Print Run</th>
                    <th className="py-2.5 px-3">Material & Color</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-center">Scans</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                  {filteredBatches.map((b) => (
                    <tr
                      key={b.id || b.batchCode}
                      className="hover:bg-gray-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-gray-900 dark:text-neutral-100">
                        {b.batchCode}
                      </td>
                      <td className="py-2.5 px-3 text-gray-700 dark:text-neutral-300">
                        {b.productName}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {b.printQuantity.toLocaleString()} bags
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-500 dark:text-neutral-400">
                        <span className="inline-flex items-center gap-1">
                          <span
                            className="size-2 rounded-full inline-block ring-1 ring-black/20"
                            style={{ backgroundColor: b.qrColor }}
                          />
                          <span>{b.qrColorName}</span> on {b.packagingMaterial}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-500 dark:text-neutral-400">
                        {b.productionDate}
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-gray-800 dark:text-neutral-200">
                        {b.scanCount}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <a
                          href={`/product/${b.productSlug}?batch=${b.batchCode}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-kharis-green-700 dark:text-kharis-gold-400 font-semibold hover:underline"
                        >
                          Verify <ExternalLink className="size-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Register Batch Print Run */}
      {modalOpen && modalProduct && (
        <RegisterBatchModal
          product={modalProduct}
          batchCode={modalBatchCode}
          currentMaterialName={modalMaterialName}
          currentColorHex={modalColorHex}
          currentColorName={modalColorName}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={(batch) => {
            handleBatchRegistered(batch);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ProductQRCard({
  product,
  baseUrl,
  globalColor,
  globalColorMode,
  globalMaterial,
  globalTimestamp,
  batches,
  onOpenRegisterModal,
}: {
  product: (typeof products)[number];
  baseUrl: string;
  globalColor: string;
  globalColorMode: QRColorPreset;
  globalMaterial: MaterialId;
  globalTimestamp: number;
  batches: BatchRecord[];
  onOpenRegisterModal: (
    product: (typeof products)[number],
    batchCode: string,
    colorHex: string,
    colorName: string,
    materialName: string
  ) => void;
}) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<QRCodeStyling | null>(null);

  // QR Color State
  const [colorMode, setColorMode] = useState<QRColorPreset>(globalColorMode);
  const [currentColorHex, setCurrentColorHex] = useState<string>(globalColor);
  const [customHexInput, setCustomHexInput] = useState<string>("#e63946");

  // Material Simulation State
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialId>(globalMaterial);
  const [customSubstrateHex, setCustomSubstrateHex] = useState<string>("#f0ece1");
  const [glareActive, setGlareActive] = useState<boolean>(true);
  const [glarePosition, setGlarePosition] = useState<number>(0);

  // Background & Logo State
  const [bgMode, setBgMode] = useState<QRBgMode>("transparent");
  const [includeLogo, setIncludeLogo] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const [batchCode, setBatchCode] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const week = Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
    const weekStr = String(week).padStart(2, "0");
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `KF-${year}-W${weekStr}-${rand}`;
  });

  const [downloading, setDownloading] = useState(false);

  // Check if current batch code is registered in database
  const registeredBatch = useMemo(() => {
    const normalized = batchCode.trim().toUpperCase();
    return batches.find((b) => b.batchCode.toUpperCase() === normalized) || null;
  }, [batches, batchCode]);

  // Sync when user clicks global Quick Apply
  useEffect(() => {
    if (globalTimestamp > 0) {
      setColorMode(globalColorMode);
      setCurrentColorHex(globalColor);
      setSelectedMaterial(globalMaterial);
    }
  }, [globalTimestamp, globalColorMode, globalColor, globalMaterial]);

  const generateBadgeCode = () => {
    const now = new Date();
    const year = now.getFullYear();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const week = Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
    const weekStr = String(week).padStart(2, "0");
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    setBatchCode(`KF-${year}-W${weekStr}-${rand}`);
  };

  const productUrl = batchCode
    ? `${baseUrl}/product/${product.slug}?batch=${batchCode.trim()}`
    : `${baseUrl}/product/${product.slug}`;

  // Select QR color preset
  const handleSelectPreset = (preset: ColorPresetConfig) => {
    setColorMode(preset.id);
    setCurrentColorHex(preset.hex);
  };

  // Select custom QR color
  const handleCustomQRColorChange = (hex: string) => {
    setColorMode("custom");
    setCustomHexInput(hex);
    setCurrentColorHex(hex);
  };

  // Determine effective substrate material
  const activeMaterialConfig = useMemo(() => {
    if (selectedMaterial === "auto") {
      const isQrLight =
        getLuminance(
          ...(Object.values(hexToRgb(currentColorHex)) as [number, number, number])
        ) > 0.45;
      const autoId = isQrLight ? "dark-matte" : "white-sack";
      return MATERIAL_CONFIGS.find((m) => m.id === autoId) || MATERIAL_CONFIGS[0];
    }
    if (selectedMaterial === "custom-substrate") {
      return {
        id: "custom-substrate" as MaterialId,
        name: "Custom Color Substrate",
        category: "other" as const,
        categoryLabel: "Custom Color",
        badge: "Custom Color",
        approxBgHex: customSubstrateHex,
        bracketColor: "border-neutral-800",
        hasGlare: false,
        style: {
          backgroundColor: customSubstrateHex,
          boxShadow: "inset 0 0 35px rgba(0,0,0,0.15)",
        },
        description: `Custom packaging substrate color (${customSubstrateHex}).`,
      };
    }
    return (
      MATERIAL_CONFIGS.find((m) => m.id === selectedMaterial) || MATERIAL_CONFIGS[0]
    );
  }, [selectedMaterial, currentColorHex, customSubstrateHex]);

  // Contrast Calculation
  const contrastAnalysis = useMemo(() => {
    const substrateBg = activeMaterialConfig.approxBgHex;
    const ratio = getContrastRatio(currentColorHex, substrateBg);
    const rounded = Number(ratio.toFixed(1));

    let status: "pass" | "caution" | "fail" = "pass";
    let message = "";

    if (rounded >= 4.5) {
      status = "pass";
      message = "Optimal contrast! Ready for industrial printing & rapid camera scanning.";
    } else if (rounded >= 2.8) {
      status = "caution";
      message = "Moderate contrast. Scannable under good lighting; specular glare may reduce reliability.";
    } else {
      status = "fail";
      message = "Low contrast! QR code may fail on smartphone cameras. Invert color for safety.";
    }

    return {
      ratio: rounded,
      status,
      message,
    };
  }, [currentColorHex, activeMaterialConfig]);

  // Background Hex for QR generation
  const qrBgHex =
    bgMode === "solid"
      ? currentColorHex.toLowerCase() === "#ffffff"
        ? "#000000"
        : "#ffffff"
      : "transparent";

  // Re-generate QR code preview whenever parameters change
  useEffect(() => {
    if (!qrRef.current) return;
    qrRef.current.innerHTML = "";

    const qr = new QRCodeStyling({
      width: 280,
      height: 280,
      data: productUrl,
      type: "svg",
      image: includeLogo ? "/images/kharisfoods-removebg-preview.png" : undefined,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 6,
        imageSize: 0.38,
      },
      dotsOptions: {
        color: currentColorHex,
        type: "rounded",
      },
      cornersSquareOptions: {
        color: currentColorHex,
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color: currentColorHex,
        type: "dot",
      },
      backgroundOptions: {
        color: qrBgHex,
      },
    });

    qr.append(qrRef.current);
    qrInstance.current = qr;
  }, [productUrl, currentColorHex, qrBgHex, includeLogo]);

  const cleanColorSuffix =
    colorMode === "custom"
      ? currentColorHex.replace("#", "").toLowerCase()
      : colorMode;

  const downloadFilename = `qr-${product.slug}-${batchCode.trim()}-${cleanColorSuffix}${
    bgMode === "solid" ? "-solid" : ""
  }`;

  // Download SVG directly preserving all exact vector colors
  const handleDownloadSVG = () => {
    downloadExactSVG({
      qrElement: qrRef.current,
      filename: downloadFilename,
    });
  };

  // Download PNG using high-res canvas with 100% exact colors
  const handleDownloadPNG = async () => {
    try {
      setDownloading(true);
      await downloadHighResPNG({
        productUrl,
        colorHex: currentColorHex,
        bgHex: qrBgHex,
        includeLogo,
        filename: downloadFilename,
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const colorName =
    COLOR_PRESETS.find((p) => p.hex.toLowerCase() === currentColorHex.toLowerCase())
      ?.name || "Custom";

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden shadow-xs">
      <div className="p-5 sm:p-6 flex flex-col gap-5">
        {/* Card Header & Product Name */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-neutral-100">
                {product.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400">
                {product.category}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
              Slug: <code className="text-[11px] font-mono">{product.slug}</code>
            </p>
          </div>

          {/* Batch Code Generator & Traceability Button */}
          <div className="w-full sm:w-auto">
            <div className="flex items-center justify-between sm:justify-end gap-2 mb-1">
              <label className="text-[10px] font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Batch Code & Traceability
              </label>
              {registeredBatch ? (
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  {registeredBatch.printQuantity.toLocaleString()} bags registered
                </span>
              ) : (
                <span className="text-[9px] text-gray-400 dark:text-neutral-500">
                  Unregistered print run
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <input
                type="text"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                placeholder="e.g. KF-2026-W25-A7F3"
                className="w-full sm:w-44 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-kharis-green-500"
              />
              <button
                type="button"
                onClick={generateBadgeCode}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 text-xs font-semibold text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                title="Generate new weekly batch code"
              >
                <RefreshCw className="size-3" />
                New
              </button>
              <button
                type="button"
                onClick={() =>
                  onOpenRegisterModal(
                    product,
                    batchCode,
                    currentColorHex,
                    colorName,
                    activeMaterialConfig.name
                  )
                }
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  registeredBatch
                    ? "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100"
                    : "bg-kharis-green-700 border-kharis-green-700 text-white hover:bg-kharis-green-800 shadow-xs"
                }`}
                title="Specify print count and store batch"
              >
                <PackageCheck className="size-3.5" />
                {registeredBatch ? "Edit Batch Run" : "Register Batch Run"}
              </button>
            </div>
          </div>
        </div>

        {/* Section 1: QR Code Color Chooser */}
        <div className="bg-gray-50 dark:bg-neutral-950/70 rounded-xl p-4 border border-gray-200/80 dark:border-neutral-800/80 space-y-3.5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 dark:text-neutral-200 flex items-center gap-1.5">
                <Palette className="size-3.5 text-gray-500" />
                QR Code Color:
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-500 dark:text-neutral-400">
                <span
                  className="size-3 rounded-full ring-1 ring-neutral-400/80 inline-block"
                  style={{ backgroundColor: currentColorHex }}
                />
                <span className="font-semibold text-gray-800 dark:text-neutral-200">
                  {currentColorHex.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COLOR_PRESETS.map((preset) => {
                const isSelected =
                  colorMode === preset.id &&
                  currentColorHex.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white dark:bg-neutral-900 border-gray-900 dark:border-white text-gray-900 dark:text-white shadow-xs ring-1 ring-gray-900/10 dark:ring-white/20"
                        : "bg-white/70 dark:bg-neutral-900/50 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-100"
                    }`}
                  >
                    <span
                      className={`size-3.5 rounded-full ${preset.swatchBg} ring-1 ring-neutral-400/80 shrink-0`}
                    />
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Color Input */}
            <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-gray-200/60 dark:border-neutral-800/60">
              <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400 flex items-center gap-1">
                <Paintbrush className="size-3" />
                Custom Color:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentColorHex}
                  onChange={(e) => handleCustomQRColorChange(e.target.value)}
                  className="size-7 rounded-md border border-gray-200 dark:border-neutral-800 cursor-pointer p-0.5 bg-white dark:bg-neutral-900"
                  title="Pick custom QR color"
                />
                <input
                  type="text"
                  value={customHexInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomHexInput(val);
                    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                      handleCustomQRColorChange(val);
                    }
                  }}
                  placeholder="#000000"
                  className="w-20 px-2 py-1 rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 font-mono text-xs uppercase"
                />
              </div>
              <span className="text-[10px] text-gray-400 dark:text-neutral-500 hidden sm:inline">
                Exact ink color will carry to downloaded PNG & SVG files
              </span>
            </div>
          </div>

          {/* Secondary Controls: Background & Logo */}
          <div className="pt-2.5 border-t border-gray-200/60 dark:border-neutral-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Background Style Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">
                Background:
              </span>
              <div className="inline-flex rounded-lg border border-gray-200 dark:border-neutral-800 p-0.5 bg-white dark:bg-neutral-900">
                <button
                  type="button"
                  onClick={() => setBgMode("transparent")}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    bgMode === "transparent"
                      ? "bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  title="Transparent for printing directly on packaging substrate"
                >
                  Transparent (Overlay)
                </button>
                <button
                  type="button"
                  onClick={() => setBgMode("solid")}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    bgMode === "solid"
                      ? "bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  title="Solid contrasting background plate"
                >
                  Solid Plate
                </button>
              </div>
            </div>

            {/* Logo Toggle */}
            <label className="flex items-center gap-2 text-[11px] font-medium text-gray-600 dark:text-neutral-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeLogo}
                onChange={(e) => setIncludeLogo(e.target.checked)}
                className="rounded border-gray-300 text-kharis-green-600 focus:ring-kharis-green-500 size-3.5 cursor-pointer"
              />
              Include Kharis Logo
            </label>
          </div>
        </div>

        {/* Section 2: Material Simulation Studio */}
        <div className="bg-gray-50 dark:bg-neutral-950/70 rounded-xl p-4 border border-gray-200/80 dark:border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 dark:text-neutral-200 flex items-center gap-1.5">
              <Layers className="size-3.5 text-gray-500" />
              Simulated Packaging Material:
            </span>
            <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">
              Active:{" "}
              <strong className="text-gray-900 dark:text-white">
                {activeMaterialConfig.name}
              </strong>
            </span>
          </div>

          {/* Material Category Pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedMaterial("auto")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                selectedMaterial === "auto"
                  ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-neutral-900 shadow-2xs font-semibold"
                  : "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
              }`}
            >
              Auto Match
            </button>

            {MATERIAL_CONFIGS.map((mat) => {
              const isSelected = selectedMaterial === mat.id;
              return (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => setSelectedMaterial(mat.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-neutral-900 shadow-2xs font-semibold"
                      : "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-neutral-100"
                  }`}
                  title={mat.description}
                >
                  <span
                    className="size-2 rounded-full ring-1 ring-black/20 dark:ring-white/30"
                    style={{ backgroundColor: mat.approxBgHex }}
                  />
                  <span>{mat.name}</span>
                </button>
              );
            })}

            {/* Custom Substrate Button */}
            <button
              type="button"
              onClick={() => setSelectedMaterial("custom-substrate")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                selectedMaterial === "custom-substrate"
                  ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-neutral-900 shadow-2xs font-semibold"
                  : "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-100"
              }`}
            >
              🎨 Custom Color Substrate
            </button>
          </div>

          {/* Sub-tools for Shiny Objects & Custom Color */}
          <div className="pt-2 border-t border-gray-200/60 dark:border-neutral-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Shiny Glare Controls */}
            {activeMaterialConfig.hasGlare ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Sun className="size-3.5" />
                  Shiny Specular Glare:
                </span>
                <button
                  type="button"
                  onClick={() => setGlareActive(!glareActive)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer ${
                    glareActive
                      ? "bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                      : "bg-gray-100 dark:bg-neutral-800 border-gray-200 text-gray-500"
                  }`}
                >
                  {glareActive ? "Glare On" : "Glare Off"}
                </button>
                {glareActive && (
                  <button
                    type="button"
                    onClick={() => setGlarePosition((prev) => (prev + 1) % 4)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
                    title="Shift camera angle reflection"
                  >
                    Shift Light Angle
                  </button>
                )}
              </div>
            ) : selectedMaterial === "custom-substrate" ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-gray-600 dark:text-neutral-300">
                  Substrate Background Color:
                </span>
                <input
                  type="color"
                  value={customSubstrateHex}
                  onChange={(e) => setCustomSubstrateHex(e.target.value)}
                  className="size-6 rounded border border-gray-300 cursor-pointer p-0.5"
                />
                <span className="text-xs font-mono text-gray-600 dark:text-neutral-300">
                  {customSubstrateHex.toUpperCase()}
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-gray-500 dark:text-neutral-400">
                {activeMaterialConfig.description}
              </p>
            )}

            {/* Live Contrast & Scannability Meter */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-wider font-semibold">
                Contrast:
              </span>
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  contrastAnalysis.status === "pass"
                    ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                    : contrastAnalysis.status === "caution"
                    ? "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                    : "bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800"
                }`}
              >
                {contrastAnalysis.status === "pass" ? (
                  <ShieldCheck className="size-3" />
                ) : (
                  <AlertTriangle className="size-3" />
                )}
                <span>{contrastAnalysis.ratio} : 1</span>
                <span className="text-[10px] font-normal opacity-90 hidden sm:inline">
                  {contrastAnalysis.status === "pass"
                    ? "(Pass)"
                    : contrastAnalysis.status === "caution"
                    ? "(Moderate)"
                    : "(Fail)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Live Interactive Substrate Simulation Box */}
        <div className="flex flex-col items-center">
          <div
            className="w-full relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300/80 dark:border-neutral-700 py-9 px-6 transition-all duration-300 overflow-hidden"
            style={activeMaterialConfig.style}
          >
            {/* Glare specular effect for shiny foil/glossy materials */}
            {activeMaterialConfig.hasGlare && glareActive && (
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden z-10"
                aria-hidden="true"
              >
                <div
                  className="absolute -inset-full w-[300%] h-[300%] opacity-70 mix-blend-screen transition-transform duration-700 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.15) 42%, rgba(255,255,255,0.7) 48%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.7) 52%, rgba(255,255,255,0.15) 58%, transparent 65%)",
                    transform: `translate(${glarePosition * 25 - 20}%, ${
                      glarePosition * 15 - 15
                    }%) rotate(18deg)`,
                  }}
                />
              </div>
            )}

            {/* QR Code Container with Viewfinder Accents */}
            <div className="relative p-1 z-20">
              <div
                ref={qrRef}
                className="size-[195px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>canvas]:w-full [&>canvas]:h-full drop-shadow-xs"
              />

              {/* Viewfinder Corners */}
              <div
                className={`absolute top-0 left-0 size-4 rounded-tl border-t-2 border-l-2 transition-colors ${activeMaterialConfig.bracketColor}`}
              />
              <div
                className={`absolute top-0 right-0 size-4 rotate-90 rounded-tl border-t-2 border-l-2 transition-colors ${activeMaterialConfig.bracketColor}`}
              />
              <div
                className={`absolute bottom-0 left-0 size-4 -rotate-90 rounded-tl border-t-2 border-l-2 transition-colors ${activeMaterialConfig.bracketColor}`}
              />
              <div
                className={`absolute right-0 bottom-0 size-4 rotate-180 rounded-tl border-t-2 border-l-2 transition-colors ${activeMaterialConfig.bracketColor}`}
              />
            </div>

            {/* Substrate Watermark Badge */}
            <div className="mt-4 flex flex-col items-center gap-1 z-20">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide border border-white/10 shadow-xs">
                <span>
                  {activeMaterialConfig.name} ({activeMaterialConfig.badge})
                </span>
                <span className="opacity-50">·</span>
                <span className="font-mono">{currentColorHex.toUpperCase()}</span>
              </div>
              <p className="text-[10px] font-medium text-black/70 dark:text-white/70 bg-white/40 dark:bg-black/40 px-2.5 py-0.5 rounded-md backdrop-blur-xs text-center max-w-sm">
                {contrastAnalysis.message}
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Target URL */}
        <div className="flex w-full items-center justify-between rounded-xl bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 px-3.5 py-2.5">
          <span className="text-xs font-mono text-gray-700 dark:text-neutral-300 truncate mr-2">
            {productUrl}
          </span>
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 cursor-pointer"
            title="Copy URL"
          >
            {copied ? (
              <Check className="size-4 text-emerald-600" />
            ) : (
              <Copy className="size-4 text-gray-400 dark:text-neutral-400" />
            )}
          </Button>
        </div>

        {/* Section 5: High-Contrast Download Buttons */}
        <div className="flex flex-col sm:flex-row w-full gap-3">
          {/* Download SVG Button */}
          <button
            type="button"
            onClick={handleDownloadSVG}
            className="flex-1 flex items-center justify-between rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-200 group-hover:bg-kharis-green-50 group-hover:text-kharis-green-700 dark:group-hover:bg-emerald-950 dark:group-hover:text-emerald-300 transition-colors shrink-0">
                <Download className="size-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900 dark:text-neutral-100 group-hover:text-kharis-green-700 dark:group-hover:text-emerald-400 transition-colors">
                  Download SVG
                </p>
                <p className="text-[11px] font-medium text-gray-600 dark:text-neutral-400 group-hover:text-gray-900 dark:group-hover:text-neutral-200 transition-colors">
                  Vector · Print & Packaging Die Lines
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 group-hover:bg-kharis-green-100 group-hover:text-kharis-green-800 dark:group-hover:bg-neutral-700 dark:group-hover:text-white transition-colors shrink-0">
              .svg
            </span>
          </button>

          {/* Download PNG Button */}
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownloadPNG}
            className="flex-1 flex items-center justify-between rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 transition-all cursor-pointer group shadow-2xs disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-200 group-hover:bg-kharis-green-50 group-hover:text-kharis-green-700 dark:group-hover:bg-emerald-950 dark:group-hover:text-emerald-300 transition-colors shrink-0">
                <Download className="size-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900 dark:text-neutral-100 group-hover:text-kharis-green-700 dark:group-hover:text-emerald-400 transition-colors">
                  Download PNG
                </p>
                <p className="text-[11px] font-medium text-gray-600 dark:text-neutral-400 group-hover:text-gray-900 dark:group-hover:text-neutral-200 transition-colors">
                  High-Res 1200px · Carries Exact Colors
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 group-hover:bg-kharis-green-100 group-hover:text-kharis-green-800 dark:group-hover:bg-neutral-700 dark:group-hover:text-white transition-colors shrink-0">
              .png
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal for registering batch print quantity and traceability
function RegisterBatchModal({
  product,
  batchCode: initialBatchCode,
  currentMaterialName,
  currentColorHex,
  currentColorName,
  isOpen,
  onClose,
  onSuccess,
}: {
  product: (typeof products)[number];
  batchCode: string;
  currentMaterialName: string;
  currentColorHex: string;
  currentColorName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (batch: BatchRecord) => void;
}) {
  const [batchCode, setBatchCode] = useState(initialBatchCode);
  const [printQuantity, setPrintQuantity] = useState<number>(1000);
  const [productionDate, setProductionDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [expiryDate, setExpiryDate] = useState<string>(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [facility, setFacility] = useState("Kharis Packaging Facility - Line 1");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!batchCode.trim()) {
      setError("Batch code is required");
      return;
    }

    if (printQuantity <= 0) {
      setError("Please specify how many units you are printing");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchCode: batchCode.trim(),
          productSlug: product.slug,
          productName: product.name,
          printQuantity,
          qrColor: currentColorHex,
          qrColorName: currentColorName,
          packagingMaterial: currentMaterialName,
          productionDate,
          expiryDate,
          facility,
          notes,
        }),
      });

      const data = await res.json();
      if (data.ok && data.batch) {
        onSuccess(data.batch);
      } else {
        setError(data.error || "Failed to register batch");
      }
    } catch {
      setError("Network error while registering batch");
    } finally {
      setSubmitting(false);
    }
  };

  const presetQuantities = [500, 1000, 2500, 5000, 10000, 25000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <PackageCheck className="size-5 text-kharis-green-700 dark:text-kharis-gold-400" />
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-neutral-100">
                Register Batch Print Run
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-neutral-400">
                Product: <strong className="text-gray-800 dark:text-neutral-200">{product.name}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-neutral-200"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Print Quantity - Primary Question */}
          <div className="bg-kharis-green-50/50 dark:bg-neutral-800/50 p-3.5 rounded-xl border border-kharis-green-200/60 dark:border-neutral-700">
            <label className="block text-xs font-bold text-gray-900 dark:text-neutral-100 mb-1">
              How many bags / packages are you printing for this batch? *
            </label>
            <p className="text-[11px] text-gray-500 dark:text-neutral-400 mb-2.5">
              This count is permanently stored in the database so each package is traceable on scan.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                step="1"
                required
                value={printQuantity || ""}
                onChange={(e) => setPrintQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kharis-green-500"
              />
              <span className="font-semibold text-gray-600 dark:text-neutral-300 shrink-0">
                units / bags
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className="text-[10px] text-gray-400 dark:text-neutral-500 self-center mr-1">
                Presets:
              </span>
              {presetQuantities.map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setPrintQuantity(qty)}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition-all cursor-pointer ${
                    printQuantity === qty
                      ? "bg-kharis-green-700 text-white border-kharis-green-700 shadow-2xs"
                      : "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-100"
                  }`}
                >
                  {qty.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Batch Code Field */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-neutral-300 mb-1">
              Batch Code *
            </label>
            <input
              type="text"
              required
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 font-mono text-xs text-gray-900 dark:text-white"
            />
          </div>

          {/* Material & Color Summary */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 text-[11px]">
            <div>
              <span className="text-gray-400 dark:text-neutral-500 block">Packaging Substrate:</span>
              <strong className="text-gray-800 dark:text-neutral-200">{currentMaterialName}</strong>
            </div>
            <div>
              <span className="text-gray-400 dark:text-neutral-500 block">QR Code Ink Color:</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-gray-800 dark:text-neutral-200">
                <span
                  className="size-2 rounded-full ring-1 ring-black/20"
                  style={{ backgroundColor: currentColorHex }}
                />
                {currentColorName} ({currentColorHex.toUpperCase()})
              </span>
            </div>
          </div>

          {/* Dates & Line info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-neutral-300 mb-1">
                Production Date
              </label>
              <input
                type="date"
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-neutral-300 mb-1">
                Best Before / Expiry
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-neutral-300 mb-1">
              Facility / Packaging Line
            </label>
            <input
              type="text"
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              placeholder="e.g. Main Milling Facility - Line 1"
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-kharis-green-700 text-white font-bold hover:bg-kharis-green-800 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Saving & Registering..." : "Save & Register Print Run"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
