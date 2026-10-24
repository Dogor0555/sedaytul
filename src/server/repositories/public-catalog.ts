import type { Category as PublicCategory, Product as PublicProduct } from "@/config/demo-content";
import { categories as fallbackCategories, products as fallbackProducts } from "@/config/demo-content";
import { db } from "@/lib/db";

const fallbackImage = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=85";

export async function getPublicCategories(): Promise<PublicCategory[]> {
  const categories = await db.category.findMany({
    where: { active: true },
    include: { coverImage: true },
    orderBy: { sortOrder: "asc" },
  });

  return categories.map((category, index) => ({
    slug: category.slug,
    name: category.name,
    eyebrow: fallbackCategories.find((item) => item.slug === category.slug)?.eyebrow ?? `Colección ${String(index + 1).padStart(2, "0")}`,
    description: category.description ?? "Accesorios artesanales creados para acompañar momentos especiales.",
    image: category.coverImage?.url ?? null,
  }));
}

export async function getPublicProducts(options: { featured?: boolean } = {}): Promise<PublicProduct[]> {
  const products = await db.product.findMany({
    where: { status: "PUBLISHED", ...(options.featured ? { featured: true } : {}) },
    include: { category: true, media: { include: { media: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return products.map((product) => {
    const fallback = fallbackProducts.find((item) => item.slug === product.slug);
    const images = product.media.map((item) => item.media.url);
    const availability = product.availability === "MADE_TO_ORDER" ? "Elaboración por encargo" : product.availability === "UNAVAILABLE" ? "No disponible" : "Disponible";

    return {
      slug: product.slug,
      name: product.name,
      category: product.category.name,
      kind: fallback?.kind ?? "Accesorio",
      description: product.shortDescription ?? fallback?.description ?? "Una pieza artesanal de Seda y Tul.",
      detail: product.description ?? fallback?.detail ?? product.shortDescription ?? "Creada artesanalmente con atención a cada detalle.",
      price: product.showPrice && product.price ? new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" }).format(Number(product.price)) : undefined,
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
