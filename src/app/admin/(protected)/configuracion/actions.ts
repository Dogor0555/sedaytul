"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";

const optionalText = (max: number) => z.string().trim().max(max).optional();
const optionalUrl = z.union([z.literal(""), z.string().trim().url("Ingresa una URL válida.")]);

const settingsSchema = z.object({
  businessName: z.string().trim().min(2, "Ingresa el nombre comercial.").max(120),
  whatsappNumber: z.union([
    z.literal(""),
    z.string().trim().regex(/^\d{7,15}$/, "Usa entre 7 y 15 dígitos, incluido el código de país, sin + ni espacios."),
  ]),
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  address: optionalText(300),
  businessHours: optionalText(300),
  businessDescription: optionalText(1000),
  footerText: optionalText(300),
  seoTitle: optionalText(120),
  seoDescription: optionalText(300),
});

export type SettingsActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

export async function saveSettings(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const user = await requireUser();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !errors[field]) errors[field] = issue.message;
    }
    return { status: "error", message: "Revisa los campos marcados.", errors };
  }

  const emptyToNull = (value: string | undefined) => value || null;
  const data = {
    businessName: parsed.data.businessName,
    whatsappNumber: emptyToNull(parsed.data.whatsappNumber),
    facebookUrl: emptyToNull(parsed.data.facebookUrl),
    instagramUrl: emptyToNull(parsed.data.instagramUrl),
    address: emptyToNull(parsed.data.address),
    businessHours: emptyToNull(parsed.data.businessHours),
    businessDescription: emptyToNull(parsed.data.businessDescription),
    footerText: emptyToNull(parsed.data.footerText),
    seoTitle: emptyToNull(parsed.data.seoTitle),
    seoDescription: emptyToNull(parsed.data.seoDescription),
  };

  await db.$transaction(async (tx) => {
    await tx.siteSettings.upsert({
      where: { id: "main" },
      update: data,
      create: { id: "main", ...data },
    });
    await tx.activityLog.create({
      data: {
        userId: user.id,
        action: "UPDATE",
        entityType: "SiteSettings",
        entityId: "main",
        metadata: { fields: Object.keys(data) },
      },
    });
  });

  for (const path of ["/", "/nosotros", "/contacto", "/productos", "/colecciones", "/admin/configuracion"]) {
    revalidatePath(path);
  }
  return { status: "success", message: "La configuración se guardó correctamente." };
}
