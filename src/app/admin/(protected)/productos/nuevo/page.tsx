import { db } from "@/lib/db";
import { createProduct } from "../../actions";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

  return <ProductForm action={createProduct} categories={categories} />;
}
