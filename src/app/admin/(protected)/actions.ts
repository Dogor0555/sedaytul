"use server";

import { Availability, ProductStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signOut } from "@/auth";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function logout() {
  await signOut({ redirectTo: "/admin/iniciar-sesion" });
}

const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  categoryId: z.string().min(1),
  referenceCode: z.string().trim().max(50).optional(),
  shortDescription: z.string().trim().max(300).optional(),
  description: z.string().trim().max(5000).optional(),
  price: z.string().trim().optional(),
  status: z.enum(ProductStatus),
  availability: z.enum(Availability),
  showPrice: z.boolean(),
  featured: z.boolean(),
});

const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(300).optional(),
});

async function uniqueSlug(model: "product" | "category", name: string) {
  const base = slugify(name) || "elemento";
  let slug = base;
  let suffix = 2;

  while (await (model === "product" ? db.product.findUnique({ where: { slug } }) : db.category.findUnique({ where: { slug } }))) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

export async function createProduct(formData: FormData) {
  const user = await requireUser();
  const mediaIds = formData.getAll("mediaIds").map(String).filter(Boolean).slice(0, 20);
  const parsed = productSchema.parse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    referenceCode: formData.get("referenceCode") || undefined,
    shortDescription: formData.get("shortDescription") || undefined,
    description: formData.get("description") || undefined,
    price: formData.get("price") || undefined,
    status: formData.get("status"),
    availability: formData.get("availability"),
    showPrice: formData.get("showPrice") === "on",
    featured: formData.get("featured") === "on",
  });

  const price = parsed.price ? Number(parsed.price) : null;
  if (price !== null && (!Number.isFinite(price) || price < 0)) throw new Error("Precio inválido.");

  const product = await db.product.create({
    data: {
      ...parsed,
      price,
      referenceCode: parsed.referenceCode || null,
      shortDescription: parsed.shortDescription || null,
      description: parsed.description || null,
      slug: await uniqueSlug("product", parsed.name),
      media: {
        create: mediaIds.map((mediaId, sortOrder) => ({ mediaId, sortOrder, isPrimary: sortOrder === 0 })),
      },
    },
  });

  await db.activityLog.create({
    data: { userId: user.id, action: "CREATE", entityType: "Product", entityId: product.id },
  });
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin");
  redirect("/admin/productos");
}

export async function createCategory(formData: FormData) {
  const user = await requireUser();
  const parsed = categorySchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
  const last = await db.category.aggregate({ _max: { sortOrder: true } });
  const category = await db.category.create({
    data: {
      ...parsed,
      description: parsed.description || null,
      slug: await uniqueSlug("category", parsed.name),
      sortOrder: (last._max.sortOrder ?? -1) + 1,
    },
  });
  await db.activityLog.create({
    data: { userId: user.id, action: "CREATE", entityType: "Category", entityId: category.id },
  });
  revalidatePath("/admin/categorias");
  revalidatePath("/colecciones");
}
