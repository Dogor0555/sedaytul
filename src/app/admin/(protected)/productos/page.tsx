import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductCatalog } from "@/components/admin/product-catalog";
import { PageHeader, primaryButton } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";

const statusLabel = { DRAFT: "Borrador", PUBLISHED: "Publicado", HIDDEN: "Oculto" } as const;
const availabilityLabel = { AVAILABLE: "Disponible", MADE_TO_ORDER: "Por encargo", UNAVAILABLE: "No disponible" } as const;

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    db.product.findMany({ include: { category: true }, orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] }),
    db.category.findMany({ orderBy: { sortOrder: "asc" }, select: { name: true } }),
  ]);
  return <div className="space-y-7">
    <PageHeader eyebrow="Catálogo" title="Productos" description="Administra accesorios artesanales, disponibilidad, encargos y visibilidad del catálogo." actions={<Link href="/admin/productos/nuevo" className={primaryButton}><Plus className="size-4" />Nuevo producto</Link>} />
    <ProductCatalog products={products.map((product) => ({ id: product.id, name: product.name, category: product.category.name, status: statusLabel[product.status], availability: availabilityLabel[product.availability], price: product.price ? Number(product.price) : null, showPrice: product.showPrice }))} categories={categories.map(({ name }) => name)} />
  </div>;
}
