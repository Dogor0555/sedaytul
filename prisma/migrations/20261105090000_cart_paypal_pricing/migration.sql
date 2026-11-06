-- CreateEnum
CREATE TYPE "PricingMode" AS ENUM ('FIXED', 'QUOTE');

-- AlterTable
ALTER TABLE "Product"
ADD COLUMN "pricingMode" "PricingMode" NOT NULL DEFAULT 'QUOTE';

-- Existing products with a price keep their fixed pricing behavior.
UPDATE "Product" SET "pricingMode" = 'FIXED' WHERE "price" IS NOT NULL;
