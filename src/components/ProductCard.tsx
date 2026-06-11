import { ProductCardData } from "@/types";
import { InteractiveTravelCard } from "@/components/InteractiveTravelCard";

interface ProductCardProps {
  product: ProductCardData;
  index: number;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <InteractiveTravelCard
      title={product.name}
      subtitle={product.tagline || product.category}
      imageUrl={product.image}
      actionText="View Product"
      href={`/product/${product.slug}`}
    />
  );
}
