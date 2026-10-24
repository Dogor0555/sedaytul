/* eslint-disable @next/next/no-img-element */
import { FolderPlus, Pencil, Save, Trash2 } from "lucide-react";
import { PageHeader, Panel, inputClass, labelClass, primaryButton, secondaryButton } from "@/components/admin/admin-ui";
import { SingleImageUpload } from "@/components/admin/single-image-upload";
import { db } from "@/lib/db";
import { createCategory, deleteCategory, updateCategory } from "../actions";

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, categories] = await Promise.all([
    searchParams,
    db.category.findMany({ include: { _count: { select: { products: true } }, coverImage: { select: { id: true, url: true } } }, orderBy: { sortOrder: "asc" } }),
  ]);

  return <div className="space-y-7">
    <PageHeader eyebrow="Organización" title="Categorías" description="Agrupa las piezas para facilitar la navegación del catálogo." />
    {error === "products" && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">No se puede eliminar la categoría porque tiene productos asociados. Mueve o elimina esos productos primero.</div>}
    <Panel className="p-5">
      <form action={createCategory} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-[1fr_1.5fr_auto]">
          <input name="name" required minLength={2} maxLength={80} className={inputClass} placeholder="Nombre de la categoría" />
          <input name="description" maxLength={300} className={inputClass} placeholder="Descripción breve (opcional)" />
          <div className="flex flex-wrap items-center gap-3"><label className="flex items-center gap-2 text-sm font-semibold text-[#594946]"><input name="active" type="checkbox" defaultChecked className="size-4 accent-[#92635e]" />Activa</label><button className={primaryButton}><FolderPlus className="size-4" />Crear categoría</button></div>
        </div>
        <SingleImageUpload name="coverImageId" label="Imagen de portada" />
        <p className="text-xs text-[#8f827d]">Si no subes una portada, la categoría se mostrará sin imagen; no se asignará una fotografía automática.</p>
      </form>
    </Panel>
    <Panel className="overflow-hidden">
      <div className="border-b border-[#ece5e1] px-5 py-4"><p className="text-xs text-[#8e817d]">Edita la información y visibilidad de cada categoría.</p></div>
      <div className="divide-y divide-[#eee8e4]">
        {categories.map((category) => <article key={category.id} className="p-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {category.coverImage ? <img src={category.coverImage.url} alt={`Portada de ${category.name}`} className="size-12 shrink-0 rounded-2xl border-4 border-white object-cover shadow-sm" /> : <span className="size-12 shrink-0 rounded-2xl border-4 border-white bg-[#e8d6cf] shadow-sm" />}
            <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="font-serif text-lg text-[#473936]">{category.name}</h2>{!category.active && <span className="rounded-full bg-[#f1ece7] px-2 py-0.5 text-[10px] font-bold text-[#88776f]">Oculta</span>}</div><p className="mt-1 text-xs text-[#8f827d]">{category.description || "Sin descripción"}</p><p className="mt-1 text-xs text-[#766965]"><strong className="text-[#4b3e3b]">{category._count.products}</strong> productos</p></div>
            <details className="group sm:text-right">
              <summary className={`${secondaryButton} cursor-pointer list-none`}><Pencil className="size-4" />Editar</summary>
              <div className="mt-4 rounded-2xl border border-[#e9e1dd] bg-[#fcfaf8] p-4 text-left sm:min-w-[520px]">
                <form action={updateCategory.bind(null, category.id)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2"><label><span className={labelClass}>Nombre</span><input name="name" required minLength={2} maxLength={80} defaultValue={category.name} className={inputClass} /></label><label><span className={labelClass}>Descripción</span><input name="description" maxLength={300} defaultValue={category.description ?? ""} className={inputClass} /></label></div>
                  <SingleImageUpload name="coverImageId" label="Imagen de portada" current={category.coverImage} />
                  <div className="flex flex-wrap items-center justify-between gap-3"><label className="flex items-center gap-2 text-sm font-semibold text-[#594946]"><input name="active" type="checkbox" defaultChecked={category.active} className="size-4 accent-[#92635e]" />Categoría activa</label><button className={primaryButton}><Save className="size-4" />Guardar cambios</button></div>
                </form>
                <div className="mt-4 border-t border-[#eadfda] pt-4">
                  {category._count.products > 0 ? <p className="text-xs text-[#8f625d]">No se puede eliminar mientras tenga productos asociados.</p> : <details><summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-xs font-semibold text-red-700 hover:underline"><Trash2 className="size-3.5" />Eliminar categoría</summary><form action={deleteCategory.bind(null, category.id)} className="mt-3 flex flex-wrap items-center gap-3"><p className="text-xs text-red-800">Esta acción no se puede deshacer.</p><button className="rounded-lg bg-red-700 px-3 py-2 text-xs font-semibold text-white hover:bg-red-800">Confirmar eliminación</button></form></details>}
                </div>
              </div>
            </details>
          </div>
        </article>)}
        {categories.length === 0 && <p className="px-5 py-12 text-center text-sm text-[#8f827d]">Todavía no hay categorías.</p>}
      </div>
    </Panel>
  </div>;
}
