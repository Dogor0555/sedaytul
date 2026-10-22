import { PageHeader } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { GalleryManager } from "./gallery-manager";

export default async function GalleryPage() {
  const [items, categories, order] = await Promise.all([
    db.galleryItem.findMany({
      include: { media: { select: { url: true, altText: true, width: true, height: true } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    db.category.findMany({ select: { id: true, name: true, active: true }, orderBy: { name: "asc" } }),
    db.galleryItem.aggregate({ _max: { sortOrder: true } }),
  ]);
  return <div className="space-y-7">
    <PageHeader eyebrow="Recursos" title="Galería" description="Carga imágenes y controla sus metadatos, orden y visibilidad." />
    <GalleryManager items={items} categories={categories} nextSortOrder={(order._max.sortOrder ?? -1) + 1} />
  </div>;
}
