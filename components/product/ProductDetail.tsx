"use client";

import { SuspenseQuery } from "@suspensive/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

import { productByHandleQueryOptions } from "@/lib/queries/product.query";
import { cn } from "@/lib/utils";

type ProductDetailProps = {
  handle: string;
};

export function ProductDetail({ handle }: ProductDetailProps) {
  return (
    <SuspenseQuery {...productByHandleQueryOptions(handle)}>
      {({ data }) => (
        <div className="mx-auto p-4 md:w-1/2 md:p-6">
          <div className="flex flex-col gap-12 md:grid md:grid-cols-2">
            <ProductImageSlider images={data.product.images} />

            <div>
              <h1 className="mb-4 text-2xl font-bold">{data.product.title}</h1>
              <p className="mb-4 text-lg">
                {(data.product.price / 100).toLocaleString("ko-KR", {
                  style: "currency",
                  currency: "KRW",
                })}
              </p>
              <p>{data.product.description}</p>
            </div>
          </div>
        </div>
      )}
    </SuspenseQuery>
  );
}

export function ProductImageSlider({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex flex-col">
      <img
        src={images[currentIndex]}
        alt={`Product image ${currentIndex + 1}`}
        className="h-auto w-full object-cover"
      />

      <div className="flex py-6">
        <button className="cursor-pointer p-4">
          <ChevronLeftIcon className="size-5 text-gray-600" />
        </button>

        <div className="no-scrollbar flex min-w-0 snap-x snap-proximity gap-4 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "size-16 shrink-0 cursor-pointer snap-start",
                index === currentIndex ? "border-2 border-black" : "",
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="size-full object-cover"
                onClick={() => setCurrentIndex(index)}
              />
            </button>
          ))}
        </div>

        <button className="cursor-pointer p-4">
          <ChevronRightIcon className="size-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
