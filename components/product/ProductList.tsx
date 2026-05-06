"use client";

import { SuspenseQuery } from "@suspensive/react-query";

import { ProductCard } from "./ProductCard";
import { productsQueryOptions } from "@/lib/queries/product.query";

export function ProductList() {
  return (
    <SuspenseQuery {...productsQueryOptions()}>
      {({ data }) => (
        <div className="grid grid-cols-4 gap-4">
          {data.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </SuspenseQuery>
  );
}
