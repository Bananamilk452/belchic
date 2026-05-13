"use client";

import { SuspenseQuery } from "@suspensive/react-query";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { ProductCard } from "../product/ProductCard";
import { FavoriteProduct } from "@/lib/models/favorite.model";
import { favoriteQueryOptions } from "@/lib/queries/favorite.query";

export function Favorite() {
  return (
    <SuspenseQuery {...favoriteQueryOptions()}>
      {({ data }) => <FavoriteGrid initialItems={data.items} />}
    </SuspenseQuery>
  );
}

function FavoriteGrid({ initialItems }: { initialItems: FavoriteProduct[] }) {
  const { data } = useQuery({ ...favoriteQueryOptions() });
  const [gridProducts, setGridProducts] = useState<FavoriteProduct[] | undefined>();

  if (data && !gridProducts) {
    setGridProducts(data.items);
  }

  const items = gridProducts ?? initialItems;

  return (
    <div className="mx-auto w-full max-w-7xl px-[50px] py-[36px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="mb-6 font-serif text-[40px]">관심 상품</h1>

        <Link href="/" className="text-lg text-gray-600 underline">
          쇼핑 계속하기
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="py-12 text-center text-gray-500">관심 상품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 items-start justify-center gap-4 md:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="col-span-1 w-full">
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
