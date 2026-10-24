import { PageHeader } from "@/components/admin/admin-ui";
import { requireUser } from "@/lib/auth/require-user";
import { getPublicHomeContent } from "@/server/repositories/public-settings";
import { ContentEditor } from "./content-editor";

const sections = [
  { key: "hero", label: "Portada", description: "Mensaje principal que recibe a los visitantes." },
  { key: "artesanal", label: "Trabajo artesanal", description: "Presentación del proceso y cuidado de cada pieza." },
  { key: "historia", label: "Nuestra historia", description: "Origen, propósito y trayectoria de la marca." },
  { key: "contacto", label: "Contacto", description: "Invitación final para conversar con la marca." },
] as const;

export default async function ContentPage() {
  const user = await requireUser();
  const storedSections = await getPublicHomeContent();

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Página de inicio"
        title="Contenido"
        description={`Edita los textos y el orden de las secciones de inicio. Sesión de ${user.name ?? user.email ?? "administrador"}.`}
      />
      <ContentEditor
        initialSections={sections.map((section, index) => {
          const content = storedSections.find((item) => item.key === section.key);
          return {
            ...section,
            title: content?.title ?? "",
            subtitle: content?.eyebrow ?? "",
            body: content?.body ?? "",
            visible: content?.visible ?? true,
            sortOrder: content?.sortOrder ?? index,
          };
        })}
      />
    </div>
  );
}
