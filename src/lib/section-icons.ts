import { type LucideIcon, FileText, Image, BookOpen, List, Info, Heart, TriangleAlert, Lightbulb, Package, UtensilsCrossed, Droplets, CookingPot, ShieldCheck, ChefHat } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  description: FileText,
  gallery: Image,
  "how to use": BookOpen,
  specifications: List,
  "more information": Info,
  storage: Package,
  nutrition: Heart,
  safety: TriangleAlert,
  hygiene: ShieldCheck,
  tips: Lightbulb,
  uses: Info,
  serving: UtensilsCrossed,
  wash: Droplets,
  preparation: ChefHat,
  cook: CookingPot,
  boil: CookingPot,
  mix: CookingPot,
};

export function getSectionIcon(title: string): LucideIcon {
  const lower = title.toLowerCase();
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (lower.includes(keyword)) return icon;
  }
  return Info;
}
