import { ProductCardData } from "@/types";
import Link from "next/link";

interface ProductCardProps {
  product: ProductCardData;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block bg-white rounded-xl border border-kharis-green-100 overflow-hidden
        active:scale-[0.98] transition-transform duration-200"
    >
      <div className="aspect-[4/3] bg-kharis-green-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading={index < 3 ? "eager" : "lazy"}
        />
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-kharis-green-600 uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="mt-1 text-lg font-bold text-kharis-green-900 leading-tight">
          {product.name}
        </h3>
        {product.tagline && (
          <p className="mt-1 text-sm text-kharis-green-600 line-clamp-2">
            {product.tagline}
          </p>
        )}
        <div className="mt-3 flex items-center gap-1 text-kharis-gold-600 text-sm font-semibold">
          <span>View product</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
