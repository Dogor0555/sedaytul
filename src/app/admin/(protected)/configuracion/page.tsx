import { PageHeader } from "@/components/admin/admin-ui";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const user = await requireUser();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Preferencias"
        title="Configuración"
        description={`Información pública de la marca y sus canales de contacto. Sesión de ${user.name ?? user.email ?? "administrador"}.`}
      />
      <SettingsForm
        settings={{
          businessName: settings?.businessName ?? "Seda y Tul",
          whatsappNumber: settings?.whatsappNumber ?? "",
          facebookUrl: settings?.facebookUrl ?? "",
          instagramUrl: settings?.instagramUrl ?? "",
          address: settings?.address ?? "",
          businessHours: settings?.businessHours ?? "",
          businessDescription: settings?.businessDescription ?? "",
          footerText: settings?.footerText ?? "",
          seoTitle: settings?.seoTitle ?? "",
          seoDescription: settings?.seoDescription ?? "",
        }}
      />
    </div>
  );
}
