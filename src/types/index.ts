export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  images: string[];
  usageGuide: UsageStep[];
  specs?: Record<string, string>;
  category: string;
  sections?: RichSection[];
}

export type RichSectionType =
  | "paragraph"
  | "steps"
  | "list"
  | "columns"
  | "table";

export interface RichSection {
  title: string;
  type: RichSectionType;
  body?: string;
  steps?: { title: string; description: string }[];
  items?: string[];
  columns?: {
    heading: string;
    items: string[];
  }[];
  rows?: { label: string; value: string }[];
}

export interface UsageStep {
  step: number;
  title: string;
  description: string;
  icon?: string;
}

export interface ProductCardData {
  slug: string;
  name: string;
  tagline?: string;
  image: string;
  category: string;
}
