import { PageHeader } from "@/components/admin/admin-ui";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";
import { getPublicAboutContent, getPublicHomeContent } from "@/server/repositories/public-settings";
import { AboutPageForm } from "./about-page-form";
import { ContentEditor } from "./content-editor";

const sections = [
  { key: "hero", label: "Portada / bienvenida", description: "Mensaje principal, imagen y botón de bienvenida." },
  { key: "accesorios", label: "Catálogo de accesorios", description: "Título, descripción y enlace del catálogo de accesorios." },
  { key: "regalos", label: "Catálogo de regalos", description: "Título, descripción e imagen de la sección de regalos." },
  { key: "personalizados", label: "Productos personalizados", description: "Texto e imagen para solicitar piezas a medida." },
  { key: "corporativos", label: "Regalos corporativos", description: "Texto e imagen para cotizaciones empresariales." },
  { key: "historia", label: "Conócenos", description: "Origen, propósito y trayectoria de la marca." },
  { key: "tips", label: "Tips y cuidados", description: "Escribe un consejo por línea; cada línea se muestra como tarjeta." },
  { key: "pagos", label: "Formas de pago", description: "Introducción a los métodos de pago y cómo realizar un pedido." },
  { key: "contacto", label: "Contacto", description: "Invitación final para conversar con la marca." },
] as const;

export default async function ContentPage() {
  const user = await requireUser();
  const [storedSections, aboutContent, persistedSections] = await Promise.all([
    getPublicHomeContent(),
    getPublicAboutContent(),
    db.pageContent.findMany({
      where: { pageKey: { in: ["home", "about"] } },
      include: { media: { select: { id: true, url: true } } },
    }),
  ]);
  const deletedSections = persistedSections.flatMap((row) => {
    if (row.pageKey !== "home" || !row.deletedAt) return [];
    const definition = sections.find((section) => section.key === row.sectionKey);
    return definition ? [{ key: definition.key, label: definition.label }] : [];
  });

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Página de inicio"
        title="Contenido"
        description={`Edita los textos, imágenes y orden de las secciones de inicio. Sesión de ${user.name ?? user.email ?? "administrador"}.`}
      />
      <ContentEditor
        initialDeletedSections={deletedSections}
        initialSections={sections.map((section, index) => {
          const content = storedSections.find((item) => item.key === section.key);
          const persisted = persistedSections.find((item) => item.pageKey === "home" && item.sectionKey === section.key);
          return {
            ...section,
            title: content?.title ?? "",
            subtitle: content?.eyebrow ?? "",
            body: content?.body ?? "",
            ctaLabel: content?.ctaLabel ?? "",
            ctaUrl: content?.ctaUrl ?? "",
            backgroundColor: content?.backgroundColor ?? "",
            image: content?.image ? {
              id: persisted?.media?.id ?? "",
              url: content.image,
            } : null,
            visible: content?.visible ?? true,
            sortOrder: content?.sortOrder ?? index,
          };
        })}
      />
      <AboutPageForm
        content={{
          heroEyebrow: aboutContent.hero.eyebrow,
          heroTitle: aboutContent.hero.title,
          heroBody: aboutContent.hero.body,
          heroImage: aboutContent.hero.image ? {
            id: persistedSections.find((item) => item.pageKey === "about" && item.sectionKey === "hero")?.media?.id ?? "",
            url: aboutContent.hero.image,
          } : null,
          storyEyebrow: aboutContent.story.eyebrow,
          storyBody: aboutContent.story.body,
          valuesTitle: aboutContent.values.title,
          values: aboutContent.values.items,
        }}
      />
    </div>
  );
}
