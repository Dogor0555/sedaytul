"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";

const contentSchema = z.object({
  sectionKey: z.enum(["hero", "artesanal", "historia", "contacto"]),
  title: z.string().trim().max(200).optional(),
  subtitle: z.string().trim().max(300).optional(),
  body: z.string().trim().max(5000).optional(),
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
