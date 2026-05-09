"use client";

import { SuspenseQuery } from "@suspensive/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "../ui/button";
import { Pill } from "../ui/pill";
import { Quantity } from "../ui/quantity";
import { ProductCard } from "./ProductCard";
import { ProductProvider, useProduct } from "./ProductContext";
import {
  productByHandleQueryOptions,
  relatedProductsByHandleQueryOptions,
} from "@/lib/queries/product.query";
import { cn } from "@/lib/utils";

type ProductDetailProps = {
  handle: string;
};

export function ProductDetail({ handle }: ProductDetailProps) {
  return (
    <SuspenseQuery {...productByHandleQueryOptions(handle)}>
      {({ data }) => (
        <ProductProvider product={data.product}>
          <div className="mx-auto p-4 lg:w-3/4 xl:w-1/2 xl:p-6">
            <div className="flex flex-col gap-12 md:grid md:grid-cols-2">
              <ProductImageSlider />

              <ProductInfo />
            </div>

            <SuspenseQuery {...relatedProductsByHandleQueryOptions(handle)}>
              {({ data }) => (
                <div className="mt-12">
                  <h2 className="mb-4 text-xl font-bold">관련 상품</h2>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {data.products.map((relatedProduct) => (
                      <ProductCard key={relatedProduct.id} product={relatedProduct} />
                    ))}
                  </div>
                </div>
              )}
            </SuspenseQuery>
          </div>
        </ProductProvider>
      )}
    </SuspenseQuery>
  );
}

export function ProductImageSlider() {
  const { product, selectedImageIndex, setSelectedImageIndex } = useProduct();
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (thumbRefs.current[selectedImageIndex]) {
      thumbRefs.current[selectedImageIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [selectedImageIndex]);

  const handleScroll = (direction: "left" | "right") => {
    if (!thumbContainerRef.current) return;

    const container = thumbContainerRef.current;
    const scrollAmount = container.clientWidth;

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col">
      <img
        src={product.images[selectedImageIndex]}
        alt={`Product image ${selectedImageIndex + 1}`}
        className="h-auto w-full object-cover"
      />

      <div className="flex py-6">
        <button className="cursor-pointer p-4" onClick={() => handleScroll("left")}>
          <ChevronLeftIcon className="size-5 text-gray-600" />
        </button>

        <div
          ref={thumbContainerRef}
          className="no-scrollbar flex min-w-0 snap-x snap-proximity gap-4 overflow-x-auto"
        >
          {product.images.map((image, index) => (
            <button
              key={index}
              ref={(el) => {
                thumbRefs.current[index] = el;
              }}
              className={cn(
                "size-16 shrink-0 cursor-pointer snap-start",
                index === selectedImageIndex ? "border-2 border-black" : "",
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="size-full object-cover"
                onClick={() => setSelectedImageIndex(index)}
              />
            </button>
          ))}
        </div>

        <button className="cursor-pointer p-4" onClick={() => handleScroll("right")}>
          <ChevronRightIcon className="size-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

export function ProductInfo() {
  const { product, quantity, setQuantity, selectedVariant } = useProduct();

  return (
    <div className="flex flex-col items-start">
      <h1 className="mb-4 text-2xl font-bold">{product.title}</h1>
      <ProductVariant />
      <p className="py-4 text-xl font-light">
        {(selectedVariant.price / 100).toLocaleString("ko-KR", {
          style: "currency",
          currency: "KRW",
        })}
      </p>
      <p className="text-sm">
        세금이 포함됩니다. <span className="underline">배송료는</span> 결제 시 계산됩니다.
      </p>

      <div className="flex items-center gap-1 py-4">
        <div className="size-4 rounded-full border-4 border-green-200 bg-green-400" />
        재고 있음
      </div>

      <Quantity value={quantity} onChange={setQuantity} />

      <Button size="lg" className="mt-6 w-full">
        카트에 추가
      </Button>

      <p
        className="mt-6 w-full whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: product.content }}
      />
    </div>
  );
}

export function ProductVariant() {
  const { product, selectedVariant, setSelectedVariantIndex, setSelectedImageIndex } = useProduct();

  const options = product.options;
  const option1 = Array.from(new Set(product.variants.map((variant) => variant.option1)));
  const option2 = Array.from(new Set(product.variants.map((variant) => variant.option2)));
  const option3 = Array.from(new Set(product.variants.map((variant) => variant.option3)));
  const finalOption = [option1, option2, option3].filter((option) => option.length > 0);

  const handleVariantChange = (optionIndex: number, optionValue: string | null) => {
    const variant = product.variants.find((variant) => {
      if (optionIndex === 0) return variant.option1 === optionValue;
      if (optionIndex === 1) return variant.option2 === optionValue;
      if (optionIndex === 2) return variant.option3 === optionValue;
      return false;
    });

    if (variant) {
      // Update the selected variant index based on the found variant
      const newIndex = product.variants.findIndex((v) => v.id === variant.id);
      setSelectedVariantIndex(newIndex);

      const featuredImageIndex = product.images.findIndex(
        (image) => image === variant.featuredImage,
      );
      if (featuredImageIndex !== -1) {
        setSelectedImageIndex(featuredImageIndex);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {options.map((option, index) => (
        <div key={option}>
          <h2 className="mb-2 text-sm text-gray-600">{option}</h2>
          <ul className="flex flex-wrap gap-2">
            {finalOption[index]?.map((option) => (
              <li key={option}>
                <button
                  className="cursor-pointer"
                  onClick={() => handleVariantChange(index, option)}
                >
                  <Pill active={selectedVariant.options[index] === option}>{option}</Pill>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
