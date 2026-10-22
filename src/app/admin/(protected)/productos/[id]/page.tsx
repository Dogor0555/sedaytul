import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateProduct } from "../../actions";
import { ProductForm } from "../product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: { media: { orderBy: { sortOrder: "asc" }, include: { media: true } } },
    }),
    db.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  return (
    <ProductForm
      action={updateProduct.bind(null, product.id)}
      categories={categories}
      product={{
        name: product.name,
        categoryId: product.categoryId,
        referenceCode: product.referenceCode,
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price?.toString() ?? null,
        status: product.status,
        availability: product.availability,
        showPrice: product.showPrice,
        featured: product.featured,
        media: product.media.map(({ media }) => ({ id: media.id, url: media.url, altText: media.altText })),
      }}
    />
  );
}
