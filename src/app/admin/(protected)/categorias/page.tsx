import { FolderPlus, GripVertical } from "lucide-react";
import { PageHeader, Panel, inputClass, primaryButton } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { createCategory } from "../actions";

export default async function CategoriesPage() {
  const categories = await db.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { sortOrder: "asc" } });
  return <div className="space-y-7">
    <PageHeader eyebrow="Organización" title="Categorías" description="Agrupa las piezas para facilitar la navegación del catálogo." />
    <Panel className="p-5"><form action={createCategory} className="grid gap-3 md:grid-cols-[1fr_1.5fr_auto]"><input name="name" required className={inputClass} placeholder="Nombre de la categoría" /><input name="description" className={inputClass} placeholder="Descripción breve (opcional)" /><button className={primaryButton}><FolderPlus className="size-4" />Crear categoría</button></form></Panel>
    <Panel className="overflow-hidden">
      <div className="border-b border-[#ece5e1] px-5 py-4"><p className="text-xs text-[#8e817d]">Arrastra para cambiar el orden de aparición.</p></div>
      <div className="divide-y divide-[#eee8e4]">
        {categories.map((category) => <article key={category.name} className="flex items-center gap-3 p-4 sm:gap-5 sm:px-6">
          <GripVertical className="hidden size-5 cursor-grab text-[#b2a7a2] sm:block" />
          <span className="size-12 shrink-0 rounded-2xl border-4 border-white bg-[#e8d6cf] shadow-sm" />
          <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="font-serif text-lg text-[#473936]">{category.name}</h2>{!category.active && <span className="rounded-full bg-[#f1ece7] px-2 py-0.5 text-[10px] font-bold text-[#88776f]">Oculta</span>}</div><p className="mt-1 truncate text-xs text-[#8f827d]">{category.description}</p></div>
          <p className="hidden text-sm text-[#766965] sm:block"><strong className="text-[#4b3e3b]">{category._count.products}</strong> productos</p>
        </article>)}
      </div>
    </Panel>
  </div>;
}
