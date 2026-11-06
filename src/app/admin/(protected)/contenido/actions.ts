"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";

const sectionKeySchema = z.enum(["hero", "accesorios", "regalos", "personalizados", "corporativos", "historia", "tips", "pagos", "contacto"]);

const contentSchema = z.object({
  sectionKey: sectionKeySchema,
  title: z.string().trim().max(200).optional(),
  subtitle: z.string().trim().max(300).optional(),
  body: z.string().trim().max(5000).optional(),
  ctaLabel: z.string().trim().max(80).optional(),
  ctaUrl: z.string().trim().max(500).optional(),
  backgroundColor: z.union([
    z.literal(""),
    z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Usa un color HEX de 6 dígitos, por ejemplo #FFFFFF."),
  ]),
  mediaId: z.preprocess(
    (value) => value == null || typeof value === "string" && value.trim() === "" ? null : value,
    z.string().trim().min(1).nullable(),
  ),
  visible: z.boolean(),
  sortOrder: z.coerce.number().int("El orden debe ser un número entero.").min(0, "El orden no puede ser negativo.").max(999),
});

export type ContentActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

export async function saveContentSection(
  _previousState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const user = await requireUser();
  const parsed = contentSchema.safeParse({
    sectionKey: formData.get("sectionKey"),
    title: formData.get("title") || undefined,
    subtitle: formData.get("subtitle") || undefined,
    body: formData.get("body") || undefined,
    ctaLabel: formData.get("ctaLabel") || undefined,
    ctaUrl: formData.get("ctaUrl") || undefined,
    backgroundColor: formData.get("backgroundColor") || "",
    mediaId: formData.get("mediaId"),
    visible: formData.get("visible") === "on",
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !errors[field]) errors[field] = issue.message;
    }
    return { status: "error", message: "Revisa los campos marcados.", errors };
  }

  const { sectionKey, ...values } = parsed.data;
  const data = {
    ...values,
    title: values.title || null,
    subtitle: values.subtitle || null,
    body: values.body || null,
    ctaLabel: values.ctaLabel || null,
    ctaUrl: values.ctaUrl || null,
    backgroundColor: values.backgroundColor || null,
  };

  await db.$transaction(async (tx) => {
    const content = await tx.pageContent.upsert({
      where: { pageKey_sectionKey: { pageKey: "home", sectionKey } },
      update: data,
      create: { pageKey: "home", sectionKey, ...data },
    });
    await tx.activityLog.create({
      data: {
        userId: user.id,
        action: "UPSERT",
        entityType: "PageContent",
        entityId: content.id,
        metadata: { pageKey: "home", sectionKey },
      },
    });
  });

  revalidatePath("/");
  revalidatePath("/admin/contenido");
  return { status: "success", message: "Sección guardada correctamente." };
}

export async function deleteContentSection(sectionKey: string): Promise<ContentActionState> {
  const parsed = sectionKeySchema.safeParse(sectionKey);
  if (!parsed.success) return { status: "error", message: "Sección inválida." };

  const user = await requireUser();
  const key = parsed.data;
  const deletedAt = new Date();

  await db.$transaction(async (tx) => {
    const content = await tx.pageContent.upsert({
      where: { pageKey_sectionKey: { pageKey: "home", sectionKey: key } },
      update: { deletedAt },
      create: { pageKey: "home", sectionKey: key, deletedAt },
    });
    await tx.activityLog.create({
      data: {
        userId: user.id,
        action: "DELETE",
        entityType: "PageContent",
        entityId: content.id,
        metadata: { pageKey: "home", sectionKey: key, deletedAt: deletedAt.toISOString() },
      },
    });
  });

  revalidatePath("/");
  revalidatePath("/admin/contenido");
  return { status: "success", message: "Sección eliminada del sitio." };
}

export async function restoreContentSection(sectionKey: string): Promise<ContentActionState> {
  const parsed = sectionKeySchema.safeParse(sectionKey);
  if (!parsed.success) return { status: "error", message: "Sección inválida." };

  const user = await requireUser();
  const key = parsed.data;
  const restored = await db.pageContent.updateMany({
    where: { pageKey: "home", sectionKey: key, deletedAt: { not: null } },
    data: { deletedAt: null },
  });

  if (restored.count) {
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "RESTORE",
        entityType: "PageContent",
        metadata: { pageKey: "home", sectionKey: key },
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/contenido");
  return { status: "success", message: "Sección restaurada." };
}
