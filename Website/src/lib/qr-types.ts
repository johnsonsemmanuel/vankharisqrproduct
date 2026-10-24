export const BASE_URL = "https://kharisfoods.vankharis.com";

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

export interface MaterialConfig {
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

export const MATERIAL_CONFIGS: MaterialConfig[] = [
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
      backgroundColor: "#f5f5f7",
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
    bracketColor: "border-brand-300 dark:border-brand-700",
    hasGlare: false,
    style: {
      backgroundColor: "#103c15",
      backgroundImage:
        "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(135deg, #1a5a1f 0%, #0d3b0f 100%)",
      backgroundSize: "5px 5px, 100% 100%",
      boxShadow: "inset 0 0 45px rgba(0,0,0,0.75)",
    },
    description: "Kharis brand green woven sack - the default packaging substrate.",
  },
  {
    id: "shiny-silver",
    name: "Metallic Silver Foil",
    category: "shiny",
    categoryLabel: "Premium Foil",
    badge: "Silver Foil",
    approxBgHex: "#c0c5ce",
    bracketColor: "border-slate-700 dark:border-slate-300",
    hasGlare: true,
    style: {
      backgroundColor: "#c0c5ce",
      backgroundImage:
        "linear-gradient(135deg, #e8ecf0 0%, #a8adb8 50%, #c0c5ce 100%), radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.6) 0%, transparent 50%)",
      backgroundSize: "100% 100%, 200% 200%",
      boxShadow: "inset 0 0 60px rgba(255,255,255,0.4)",
    },
    description: "High-gloss metallic silver foil with specular highlight simulation.",
  },
  {
    id: "shiny-gold",
    name: "Metallic Gold Foil",
    category: "shiny",
    categoryLabel: "Premium Foil",
    badge: "Gold Foil",
    approxBgHex: "#d4a843",
    bracketColor: "border-accent-700 dark:border-accent-400",
    hasGlare: true,
    style: {
      backgroundColor: "#d4a843",
      backgroundImage:
        "linear-gradient(135deg, #f5e0a0 0%, #d4a843 50%, #b8860b 100%), radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.5) 0%, transparent 50%)",
      backgroundSize: "100% 100%, 200% 200%",
      boxShadow: "inset 0 0 60px rgba(255,255,255,0.3)",
    },
    description: "Premium metallic gold foil for luxury packaging lines.",
  },
  {
    id: "glossy-laminate",
    name: "Glossy Laminate Film",
    category: "shiny",
    categoryLabel: "Premium Foil",
    badge: "Gloss Laminate",
    approxBgHex: "#f0f0f0",
    bracketColor: "border-gray-700 dark:border-gray-300",
    hasGlare: true,
    style: {
      backgroundColor: "#f0f0f0",
      backgroundImage:
        "linear-gradient(180deg, #ffffff 0%, #e0e0e0 50%, #f0f0f0 100%), radial-gradient(ellipse at 25% 25%, rgba(255,255,255,0.8) 0%, transparent 40%)",
      backgroundSize: "100% 100%, 300% 300%",
      boxShadow: "inset 0 0 40px rgba(255,255,255,0.6)",
    },
    description: "High-gloss clear laminate over printed substrate with strong specular reflection.",
  },
  {
    id: "rubber-matte",
    name: "Rubberized Matte Coating",
    category: "rubber",
    categoryLabel: "Specialty Coatings",
    badge: "Rubber Matte",
    approxBgHex: "#2a2a2a",
    bracketColor: "border-gray-200 dark:border-gray-700",
    hasGlare: false,
    style: {
      backgroundColor: "#2a2a2a",
      backgroundImage:
        "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(180deg, #333 0%, #222 100%)",
      backgroundSize: "8px 8px, 100% 100%",
      boxShadow: "inset 0 0 30px rgba(0,0,0,0.6)",
    },
    description: "Soft-touch rubberized matte coating for premium feel and grip.",
  },
  {
    id: "rubber-silicone",
    name: "Silicone-Texture Sleeve",
    category: "rubber",
    categoryLabel: "Specialty Coatings",
    badge: "Silicone Grip",
    approxBgHex: "#1f1f1f",
    bracketColor: "border-white/60",
    hasGlare: false,
    style: {
      backgroundColor: "#1f1f1f",
      backgroundImage:
        "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 2px, transparent 2px), repeating-linear-gradient(45deg, #252525 0, #252525 2px, #1f1f1f 2px, #1f1f1f 4px)",
      backgroundSize: "12px 12px, 8px 8px",
      boxShadow: "inset 0 0 50px rgba(0,0,0,0.9)",
    },
    description: "Textured silicone sleeve with micro-grip pattern for industrial packaging.",
  },
  {
    id: "clear-film",
    name: "Clear Polymer Film",
    category: "other",
    categoryLabel: "Specialty Films",
    badge: "Clear Film",
    approxBgHex: "#ffffff",
    bracketColor: "border-gray-400 dark:border-gray-600",
    hasGlare: true,
    style: {
      backgroundColor: "#ffffff",
      backgroundImage:
        "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%), radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.9) 0%, transparent 60%)",
      backgroundSize: "100% 100%, 400% 400%",
      boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)",
    },
    description: "Transparent polymer film for windowed packaging - QR printed on reverse.",
  },
  {
    id: "custom-substrate",
    name: "Custom Color Substrate",
    category: "other",
    categoryLabel: "Custom",
    badge: "Custom",
    approxBgHex: "#ffffff",
    bracketColor: "border-brand-500",
    hasGlare: false,
    style: {
      backgroundColor: "#ffffff",
    },
    description: "Define a custom background color for your specific packaging material.",
  },
];

export const COLOR_PRESETS = [
  { id: "black", name: "Black", hex: "#000000", swatchBg: "bg-black" },
  { id: "white", name: "White", hex: "#ffffff", swatchBg: "bg-white ring-1 ring-neutral-300" },
  { id: "green", name: "Brand Green", hex: "#1b5e20", swatchBg: "bg-brand-800" },
  { id: "gold", name: "Brand Gold", hex: "#c8a951", swatchBg: "bg-amber-600" },
] as const;

export const PRESET_QUANTITIES = [500, 1000, 2500, 5000, 10000, 25000] as const;