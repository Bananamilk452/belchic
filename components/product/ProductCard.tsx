import { HeartIcon } from "lucide-react";
import Link from "next/link";

import { GetProductsResult } from "@/lib/models/product.model";

type ProductCardProps = {
  product: GetProductsResult["products"][number];
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="w-full">
      <Link href="#" className="group relative block w-full overflow-hidden">
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
        <LikeButton />
      </Link>
      <div className="py-[17px]">
        <Link href="#" className="text-[13px] leading-0.5 hover:underline">
          {product.title}
        </Link>
        <p className="mt-1 text-base">
          {(product.price / 100).toLocaleString("ko-KR", { style: "currency", currency: "KRW" })}
          부터
        </p>
      </div>
    </div>
  );
}

function LikeButton() {
  return (
    // Link 안의 Button이라 div로 만듬
    <div className="absolute top-2 right-2 flex size-12 cursor-pointer items-center justify-center rounded-full bg-white p-2.5 opacity-90 shadow-lg transition-all hover:scale-105 hover:opacity-100">
      <HeartIcon className="size-5" />
    </div>
  );
}
