import type { Category as PublicCategory, PricingMode, Product as PublicProduct, ProductType } from "@/config/demo-content";
import { categories as fallbackCategories, products as fallbackProducts } from "@/config/demo-content";
import { db } from "@/lib/db";

const fallbackImage = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=85";

export async function getPublicCategories(): Promise<PublicCategory[]> {
  try {
    const categories = await db.category.findMany({
      where: { active: true },
      include: { coverImage: true },
      orderBy: { sortOrder: "asc" },
    });

    if (!categories.length) return fallbackCategories;

    return categories.map((category, index) => ({
      slug: category.slug,
      name: category.name,
      eyebrow: fallbackCategories.find((item) => item.slug === category.slug)?.eyebrow ?? `Colección ${String(index + 1).padStart(2, "0")}`,
      description: category.description ?? "Accesorios y regalos artesanales creados para acompañar momentos especiales.",
      image: category.coverImage?.url ?? null,
    }));
  } catch {
    return fallbackCategories;
  }
}

export async function getPublicProducts(
  options: { featured?: boolean; productType?: ProductType } = {},
): Promise<PublicProduct[]> {
  const products = await db.product.findMany({
    where: {
      status: "PUBLISHED",
      ...(options.featured ? { featured: true } : {}),
      ...(options.productType ? { productType: options.productType } : {}),
    },
    include: { category: true, media: { include: { media: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return products.map((product) => {
    const fallback = fallbackProducts.find((item) => item.slug === product.slug);
    const images = product.media.map((item) => item.media.url);
    const availability = product.availability === "MADE_TO_ORDER" ? "Elaboración por encargo" : product.availability === "UNAVAILABLE" ? "No disponible" : "Disponible";
    const productType = product.productType === "GIFT" ? "GIFT" : "ACCESSORY";
    const priceValue = product.price === null ? null : Number(product.price);
    const pricingMode: PricingMode = product.pricingMode === "FIXED" && priceValue !== null && priceValue > 0 ? "FIXED" : "QUOTE";

    return {
      slug: product.slug,
      name: product.name,
      category: product.category.name,
      kind: productType === "GIFT" ? "Regalo" : fallback?.kind ?? "Accesorio",
      productType,
      pricingMode,
      priceValue: pricingMode === "FIXED" ? priceValue : null,
      description: product.shortDescription ?? fallback?.description ?? "Una pieza artesanal de Seda y Tul.",
      detail: product.description ?? fallback?.detail ?? product.shortDescription ?? "Creada artesanalmente con atención a cada detalle.",
      personalization: product.personalization ?? fallback?.personalization,
      presentation: product.presentation ?? fallback?.presentation,
      price: product.showPrice && priceValue !== null ? new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" }).format(priceValue) : undefined,
      image: images[0] ?? fallback?.image ?? fallbackImage,
      images: images.length ? images : fallback?.images ?? [fallbackImage],
      materials: fallback?.materials ?? ["Elaboración artesanal", availability],
      featured: product.featured,
    };
  });
}

export async function getPublicProduct(slug: string) {
  const products = await getPublicProducts();
  return products.find((product) => product.slug === slug);
}
