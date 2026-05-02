-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vendor" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tags" TEXT[],
    "price" INTEGER NOT NULL,
    "priceMin" INTEGER NOT NULL,
    "priceMax" INTEGER NOT NULL,
    "images" TEXT[],
    "featuredImage" TEXT NOT NULL,
    "options" TEXT[],
    "content" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "option1" TEXT,
    "option2" TEXT,
    "option3" TEXT,
    "sku" TEXT NOT NULL,
    "featuredImage" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "options" TEXT[],
    "price" INTEGER NOT NULL,
    "productId" TEXT,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
