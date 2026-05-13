"use client";

import { HeartIcon } from "lucide-react";
import Link from "next/link";

import { useFavorite } from "@/hooks/useFavorite";
import { Product, Variant } from "@/lib/generated/prisma/client";
import { cn, parsePrice } from "@/lib/utils";

type ProductItem = Product & { variants: Variant[] };

type ProductCardProps = {
  product: ProductItem;
};

export function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorite(product);

  return (
    <div className="w-full">
      <Link
        href={`/products/${product.handle}`}
        className="group relative block min-h-[400px] w-full overflow-hidden bg-gray-200"
      >
        <img
          className="h-full w-full max-w-full object-cover opacity-100 transition-opacity duration-300 group-hover:opacity-50"
          src={product.featuredImage}
          alt={product.title}
        />
        <img
          className="absolute top-0 left-0 h-full w-full max-w-full object-cover opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
          src={product.variants[0]?.featuredImage ?? product.images?.[1] ?? product.featuredImage}
          alt={product.title}
        />
        <LikeButton isFavorited={isFavorite} onToggle={toggleFavorite} />
      </Link>
      <div className="py-[17px]">
        <Link
          href={`/products/${product.handle}`}
          className="text-[14px] leading-0.5 hover:underline"
        >
          {product.title}
        </Link>
        <p className="mt-1 text-base">
          {parsePrice(product.price)}
          {product.variants.length > 1 && "부터"}
        </p>
      </div>
    </div>
  );
}

function LikeButton({
  isFavorited,
  onToggle,
}: {
  isFavorited: boolean;
  onToggle: (e: React.MouseEvent) => void;
}) {
  return (
    // eslint-disable-next-line
    <div
      onClick={onToggle}
      className="absolute top-2 right-2 flex size-12 cursor-pointer items-center justify-center rounded-full bg-white p-2.5 opacity-90 shadow-lg transition-all hover:scale-105 hover:opacity-100"
    >
      <HeartIcon className={cn("size-5", isFavorited ? "fill-red-500 text-red-500" : "")} />
    </div>
  );
}
