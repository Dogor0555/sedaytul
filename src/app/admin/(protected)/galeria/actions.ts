"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";

export type GalleryActionResult = { ok: boolean; message: string };

const galleryItemSchema = z.object({
  mediaId: z.string().min(1),
  title: z.string().trim().max(160),
  categoryId: z.string().min(1).nullable(),
  visible: z.boolean(),
  featured: z.boolean(),
  sortOrder: z.number().int().min(-100_000).max(100_000),
});

const galleryItemsSchema = z.array(galleryItemSchema).min(1).max(10).refine(
  (items) => new Set(items.map(({ mediaId }) => mediaId)).size === items.length,
  "No se puede asociar la misma imagen más de una vez.",
);

function failure(error: unknown): GalleryActionResult {
  if (error instanceof z.ZodError) return { ok: false, message: error.issues[0]?.message ?? "Datos inválidos." };
  return { ok: false, message: error instanceof Error ? error.message : "No fue posible guardar los cambios." };
}

export async function createGalleryItems(input: unknown): Promise<GalleryActionResult> {
  const user = await requireUser();
  try {
    const items = galleryItemsSchema.parse(input);
    const mediaIds = items.map(({ mediaId }) => mediaId);
    const existingMedia = await db.media.count({ where: { id: { in: mediaIds } } });
    if (existingMedia !== mediaIds.length) return { ok: false, message: "Una o más imágenes ya no están disponibles." };

    await db.$transaction(async (tx) => {
      const created = await Promise.all(items.map((item) => tx.galleryItem.create({
        data: { ...item, title: item.title || null },
        select: { id: true },
      })));
      await tx.activityLog.create({
        data: {
          userId: user.id,
          action: "CREATE",
          entityType: "GalleryItem",
          metadata: { ids: created.map(({ id }) => id), count: created.length },
        },
      });
    });
    revalidatePath("/admin/galeria");
    return { ok: true, message: items.length === 1 ? "Imagen añadida a la galería." : `${items.length} imágenes añadidas a la galería.` };
  } catch (error) {
    return failure(error);
  }
}

const updateSchema = galleryItemSchema.omit({ mediaId: true }).extend({ id: z.string().min(1) });

export async function updateGalleryItem(input: unknown): Promise<GalleryActionResult> {
  const user = await requireUser();
  try {
    const item = updateSchema.parse(input);
    const { id, ...data } = item;
    await db.$transaction(async (tx) => {
      await tx.galleryItem.update({ where: { id }, data: { ...data, title: data.title || null } });
      await tx.activityLog.create({
        data: { userId: user.id, action: "UPDATE", entityType: "GalleryItem", entityId: id, metadata: { visible: data.visible, featured: data.featured } },
      });
    });
    revalidatePath("/admin/galeria");
    return { ok: true, message: "Datos de la imagen actualizados." };
  } catch (error) {
    return failure(error);
  }
}

export async function hideGalleryItem(id: string): Promise<GalleryActionResult> {
  const user = await requireUser();
  try {
    const itemId = z.string().min(1).parse(id);
    await db.$transaction(async (tx) => {
      await tx.galleryItem.update({ where: { id: itemId }, data: { visible: false } });
      await tx.activityLog.create({ data: { userId: user.id, action: "HIDE", entityType: "GalleryItem", entityId: itemId } });
    });
    revalidatePath("/admin/galeria");
    return { ok: true, message: "Imagen ocultada." };
  } catch (error) {
    return failure(error);
  }
}

export async function deleteGalleryItem(id: string): Promise<GalleryActionResult> {
  const user = await requireUser();
  try {
    const itemId = z.string().min(1).parse(id);
    await db.$transaction(async (tx) => {
      const item = await tx.galleryItem.delete({ where: { id: itemId }, select: { mediaId: true } });
      await tx.activityLog.create({
        data: { userId: user.id, action: "DELETE", entityType: "GalleryItem", entityId: itemId, metadata: { mediaId: item.mediaId, mediaPreserved: true } },
      });
    });
    revalidatePath("/admin/galeria");
    return { ok: true, message: "Elemento eliminado. El archivo original se conservó." };
  } catch (error) {
    return failure(error);
  }
}
