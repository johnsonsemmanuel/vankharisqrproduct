import { products as staticProducts } from "@/data/products";
import { isSupabaseConfigured, supabaseQuery } from "./supabase";
import type { Product } from "@/types";

export async function getAllProducts(): Promise<Product[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabaseQuery<any[]>("products?select=*&order=slug.asc");
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((p) => {
          const staticProd = staticProducts.find((sp) => sp.slug === p.slug);
          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            gtin: p.gtin || staticProd?.gtin,
            sku: p.sku || staticProd?.sku,
            tagline: staticProd?.tagline || p.name,
            description: staticProd?.description || "",
            images: staticProd?.images || p.images || [],
            usageGuide: staticProd?.usageGuide || [],
            category: p.category,
            sections: staticProd?.sections,
            recipes: staticProd?.recipes,
            translations: staticProd?.translations,
            specs: staticProd?.specs,
            blurDataUrl: staticProd?.blurDataUrl,
          } as Product;
        });
      }
    } catch (e) {
      console.error("Supabase getAllProducts error:", e);
    }
  }
  return staticProducts;
}

export async function getProductByGtin(gtin: string): Promise<Product | null> {
  const cleanGtin = gtin.replace(/\D/g, "");
  
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabaseQuery<any[]>(
        `products?gtin=eq.${encodeURIComponent(cleanGtin)}&select=*`
      );
      if (!error && Array.isArray(data) && data.length > 0) {
        const p = data[0];
        const staticProd = staticProducts.find((sp) => sp.slug === p.slug);
        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          gtin: p.gtin,
          sku: p.sku,
          tagline: staticProd?.tagline || p.name,
          description: staticProd?.description || "",
          images: staticProd?.images || [],
          usageGuide: staticProd?.usageGuide || [],
          category: p.category,
          sections: staticProd?.sections,
          recipes: staticProd?.recipes,
        } as Product;
      }
    } catch (e) {
      console.error("Supabase getProductByGtin error:", e);
    }
  }
  return staticProducts.find((p) => p.gtin === cleanGtin) || null;
}

export async function updateProductGtin(slug: string, gtin: string): Promise<boolean> {
  const cleanGtin = gtin.replace(/\D/g, "");
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabaseQuery(`products?slug=eq.${encodeURIComponent(slug)}`, {
        method: "PATCH",
        body: { gtin: cleanGtin },
      });
      return !error;
    } catch (e) {
      console.error("Supabase updateProductGtin error:", e);
    }
  }
  return false;
}
