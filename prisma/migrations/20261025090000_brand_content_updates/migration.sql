-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('ACCESSORY', 'GIFT');

-- AlterTable
ALTER TABLE "Product"
ADD COLUMN "productType" "ProductType" NOT NULL DEFAULT 'ACCESSORY',
ADD COLUMN "personalization" TEXT,
ADD COLUMN "presentation" TEXT;

-- AlterTable
ALTER TABLE "SiteSettings"
ADD COLUMN "tagline" TEXT,
ADD COLUMN "paymentMethods" TEXT,
ADD COLUMN "paymentInstructions" TEXT;

-- AlterTable
ALTER TABLE "PageContent"
ADD COLUMN "ctaLabel" TEXT,
ADD COLUMN "ctaUrl" TEXT;

-- Default categories from the brand proposal
UPDATE "Category" SET "name" = 'Primera Comunión' WHERE "slug" = 'primeras-comuniones';
UPDATE "Category" SET "sortOrder" = 5 WHERE "slug" = 'ocasiones-especiales';

INSERT INTO "Category" ("id", "name", "slug", "description", "sortOrder", "active", "createdAt", "updatedAt")
VALUES
  ('seed_cat_xv_anos', 'XV Años', 'xv-anos', 'Detalles delicados para acompañar una de las celebraciones más especiales.', 3, true, NOW(), NOW()),
  ('seed_cat_regalos_distancia', 'Regalos a distancia', 'regalos-a-distancia', 'Regalos personalizados que llegan a cualquier parte del mundo.', 4, true, NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;
