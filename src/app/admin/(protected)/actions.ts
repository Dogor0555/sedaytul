"use server";

import { Availability, Prisma, ProductStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signOut } from "@/auth";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";

const idSchema = z.string().trim().min(1);
const optionalText = (max: number) => z.preprocess(
  (value) => typeof value === "string" && value.trim() === "" ? null : value,
  z.string().trim().max(max).nullable(),
);

const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  categoryId: idSchema,
  referenceCode: optionalText(50),
  shortDescription: optionalText(300),
  description: optionalText(5000),
  price: z.preprocess(
    (value) => value === null || value === "" ? null : value,
    z.coerce.number().finite().min(0).max(9_999_999_999.99).nullable(),
  ),
  status: z.enum(ProductStatus),
  availability: z.enum(Availability),
  showPrice: z.boolean(),
  featured: z.boolean(),
  mediaIds: z.array(idSchema).max(20),
});

const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: optionalText(300),
  active: z.boolean(),
  coverImageId: z.preprocess(
    (value) => typeof value === "string" && value.trim() === "" ? null : value,
    z.string().trim().min(1).nullable(),
  ),
});

function productInput(formData: FormData) {
  return productSchema.parse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    referenceCode: formData.get("referenceCode"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    price: formData.get("price"),
    status: formData.get("status"),
    availability: formData.get("availability"),
    showPrice: formData.get("showPrice") === "on",
    featured: formData.get("featured") === "on",
    mediaIds: [...new Set(formData.getAll("mediaIds").map(String).filter(Boolean))],
  });
}

function categoryInput(formData: FormData) {
  return categorySchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    active: formData.get("active") === "on",
    coverImageId: formData.get("coverImageId"),
  });
}

async function uniqueSlug(model: "product" | "category", name: string, excludeId?: string) {
  const base = slugify(name) || "elemento";
  let slug = base;
  let suffix = 2;

  while (await (model === "product"
    ? db.product.findFirst({ where: { slug, id: excludeId ? { not: excludeId } : undefined }, select: { id: true } })
    : db.category.findFirst({ where: { slug, id: excludeId ? { not: excludeId } : undefined }, select: { id: true } }))) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

function revalidateCatalog(productSlugs: string[] = []) {
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/colecciones");
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath("/admin/categorias");
  productSlugs.forEach((slug) => revalidatePath(`/productos/${slug}`));
}

export async function logout() {
  await requireUser();
  await signOut({ redirectTo: "/admin/iniciar-sesion" });
}

export async function createProduct(formData: FormData) {
  const user = await requireUser();
  const parsed = productInput(formData);
  const { mediaIds, ...data } = parsed;
  const slug = await uniqueSlug("product", parsed.name);

  await db.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        ...data,
        slug,
        media: {
          create: mediaIds.map((mediaId, sortOrder) => ({ mediaId, sortOrder, isPrimary: sortOrder === 0 })),
        },
      },
    });
    await tx.activityLog.create({
      data: { userId: user.id, action: "CREATE", entityType: "Product", entityId: product.id },
    });
  });

  revalidateCatalog([slug]);
  redirect("/admin/productos");
}

export async function updateProduct(productId: string, formData: FormData) {
  const user = await requireUser();
  const id = idSchema.parse(productId);
  const parsed = productInput(formData);
  const { mediaIds, ...data } = parsed;
  const current = await db.product.findUniqueOrThrow({ where: { id }, select: { slug: true } });
  const slug = await uniqueSlug("product", parsed.name, id);

  await db.$transaction(async (tx) => {
    await tx.product.update({ where: { id }, data: { ...data, slug } });
    await tx.productMedia.deleteMany({ where: { productId: id } });
    if (mediaIds.length) {
      await tx.productMedia.createMany({
        data: mediaIds.map((mediaId, sortOrder) => ({ productId: id, mediaId, sortOrder, isPrimary: sortOrder === 0 })),
      });
    }
    await tx.activityLog.create({
      data: { userId: user.id, action: "UPDATE", entityType: "Product", entityId: id },
    });
  });

  revalidateCatalog([current.slug, slug]);
  redirect("/admin/productos");
}

export async function deleteProduct(productId: string) {
  const user = await requireUser();
  const id = idSchema.parse(productId);
  const product = await db.product.findUniqueOrThrow({ where: { id }, select: { slug: true } });

  await db.$transaction(async (tx) => {
    await tx.product.delete({ where: { id } });
    await tx.activityLog.create({
      data: { userId: user.id, action: "DELETE", entityType: "Product", entityId: id },
    });
  });

  revalidateCatalog([product.slug]);
}

export async function createCategory(formData: FormData) {
  const user = await requireUser();
  const parsed = categoryInput(formData);
  const last = await db.category.aggregate({ _max: { sortOrder: true } });
  const slug = await uniqueSlug("category", parsed.name);

  await db.$transaction(async (tx) => {
    const category = await tx.category.create({
      data: { ...parsed, slug, sortOrder: (last._max.sortOrder ?? -1) + 1 },
    });
    await tx.activityLog.create({
      data: { userId: user.id, action: "CREATE", entityType: "Category", entityId: category.id },
    });
  });

  revalidateCatalog();
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const user = await requireUser();
  const id = idSchema.parse(categoryId);
  const parsed = categoryInput(formData);
  const slug = await uniqueSlug("category", parsed.name, id);

  await db.$transaction(async (tx) => {
    await tx.category.update({ where: { id }, data: { ...parsed, slug } });
    await tx.activityLog.create({
      data: { userId: user.id, action: "UPDATE", entityType: "Category", entityId: id },
    });
  });

  revalidateCatalog();
}

export async function deleteCategory(categoryId: string) {
  const user = await requireUser();
  const id = idSchema.parse(categoryId);
  const products = await db.product.count({ where: { categoryId: id } });
  if (products > 0) {
    redirect("/admin/categorias?error=products");
  }

  try {
    await db.$transaction(async (tx) => {
      await tx.category.delete({ where: { id } });
      await tx.activityLog.create({
        data: { userId: user.id, action: "DELETE", entityType: "Category", entityId: id },
      });
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      redirect("/admin/categorias?error=products");
    }
    throw error;
  }

  revalidateCatalog();
}
