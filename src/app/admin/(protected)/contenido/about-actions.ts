"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";

const aboutSchema = z.object({
  heroEyebrow: z.string().trim().min(1).max(120),
  heroTitle: z.string().trim().min(1).max(200),
  heroBody: z.string().trim().min(1).max(2000),
  heroImageId: z.preprocess(
    (value) => value == null || typeof value === "string" && value.trim() === "" ? null : value,
    z.string().trim().min(1).nullable(),
  ),
  storyEyebrow: z.string().trim().min(1).max(120),
  storyBody: z.string().trim().min(1).max(2000),
  valuesTitle: z.string().trim().min(1).max(200),
  value1Title: z.string().trim().min(1).max(80),
  value1Text: z.string().trim().min(1).max(500),
  value2Title: z.string().trim().min(1).max(80),
  value2Text: z.string().trim().min(1).max(500),
  value3Title: z.string().trim().min(1).max(80),
  value3Text: z.string().trim().min(1).max(500),
});

export type AboutActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

export async function saveAboutPageContent(
  _previousState: AboutActionState,
  formData: FormData,
): Promise<AboutActionState> {
  const user = await requireUser();
  const parsed = aboutSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !errors[field]) errors[field] = issue.message;
    }
    return { status: "error", message: "Revisa los campos marcados.", errors };
  }

  const valuesBody = JSON.stringify([
    { title: parsed.data.value1Title, text: parsed.data.value1Text },
    { title: parsed.data.value2Title, text: parsed.data.value2Text },
    { title: parsed.data.value3Title, text: parsed.data.value3Text },
  ]);

  await db.$transaction(async (tx) => {
    const sections = [
      {
        sectionKey: "hero",
        sortOrder: 0,
        data: {
          title: parsed.data.heroTitle,
          subtitle: parsed.data.heroEyebrow,
          body: parsed.data.heroBody,
          mediaId: parsed.data.heroImageId,
        },
      },
      {
        sectionKey: "story",
        sortOrder: 1,
        data: {
          subtitle: parsed.data.storyEyebrow,
          body: parsed.data.storyBody,
        },
      },
      {
        sectionKey: "values",
        sortOrder: 2,
        data: {
          title: parsed.data.valuesTitle,
          body: valuesBody,
        },
      },
    ];

    for (const section of sections) {
      await tx.pageContent.upsert({
        where: { pageKey_sectionKey: { pageKey: "about", sectionKey: section.sectionKey } },
        update: { ...section.data, deletedAt: null },
        create: {
          pageKey: "about",
          sectionKey: section.sectionKey,
          sortOrder: section.sortOrder,
          ...section.data,
        },
      });
    }

    await tx.activityLog.create({
      data: {
        userId: user.id,
        action: "UPDATE",
        entityType: "PageContent",
        metadata: { pageKey: "about", sections: ["hero", "story", "values"] },
      },
    });
  });

  revalidatePath("/nosotros");
  revalidatePath("/admin/contenido");
  return { status: "success", message: "La página Conócenos se guardó correctamente." };
}
