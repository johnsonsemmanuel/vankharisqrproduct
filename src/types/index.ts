export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  images: string[];
  usageGuide: UsageStep[];
  specs: Record<string, string>;
  category: string;
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
  tagline: string;
  image: string;
  category: string;
}
