import Link from "next/link";
import { ArrowLeft, ChevronDown, Save } from "lucide-react";
import { PageHeader, Panel, inputClass, labelClass, primaryButton } from "@/components/admin/admin-ui";
import { ProductImageUpload } from "@/components/admin/product-image-upload";
import { db } from "@/lib/db";
import { createProduct } from "../../actions";

export default async function NewProductPage() {
  const categories = await db.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-7">
      <Link href="/admin/productos" className="inline-flex items-center gap-2 text-sm font-semibold text-[#796965] hover:text-[#4c3c39]"><ArrowLeft className="size-4" />Volver a productos</Link>
      <PageHeader eyebrow="Catálogo / Nuevo" title="Crear producto" description="Completa la información de la pieza y elige si se publica de inmediato." />

      <form action={createProduct} className="grid items-start gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Panel className="p-5 sm:p-6">
            <div className="mb-6"><h2 className="font-serif text-xl text-[#3e312f]">Información principal</h2><p className="mt-1 text-xs text-[#8d807c]">Datos que verá el cliente en el catálogo.</p></div>
            <div className="space-y-5">
              <label><span className={labelClass}>Nombre del producto</span><input name="name" required className={inputClass} placeholder="Ej. Peineta Flor de Nácar" /></label>
              <label><span className={labelClass}>Descripción corta</span><input name="shortDescription" className={inputClass} maxLength={300} placeholder="Resumen para las tarjetas del catálogo" /></label>
              <label><span className={labelClass}>Descripción completa</span><textarea name="description" className={`${inputClass} min-h-32 resize-y py-3`} placeholder="Describe materiales, elaboración artesanal y detalles especiales..." /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label><span className={labelClass}>Categoría</span><span className="relative block"><select name="categoryId" required className={`${inputClass} appearance-none pr-9`} defaultValue=""><option value="" disabled>Selecciona una categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9b8d88]" /></span></label>
                <label><span className={labelClass}>Código de referencia</span><input name="referenceCode" className={inputClass} placeholder="ST-025" /></label>
              </div>
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <div className="mb-6"><h2 className="font-serif text-xl text-[#3e312f]">Imágenes</h2><p className="mt-1 text-xs text-[#8d807c]">La primera imagen será la portada del producto.</p></div>
            <ProductImageUpload />
          </Panel>

          <Panel className="p-5 sm:p-6">
            <div className="mb-6"><h2 className="font-serif text-xl text-[#3e312f]">Detalles artesanales</h2><p className="mt-1 text-xs text-[#8d807c]">Indica la ocasión y el acabado principal de la pieza.</p></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label><span className={labelClass}>Ocasión</span><select className={`${inputClass} appearance-none`} defaultValue=""><option value="" disabled>Selecciona una ocasión</option><option>Novia</option><option>Bautizo</option><option>Primera comunión</option><option>Ocasión especial</option></select></label>
              <label><span className={labelClass}>Color o acabado</span><div className="flex gap-2"><input type="color" defaultValue="#f1e5df" className="h-11 w-14 cursor-pointer rounded-xl border border-[#ddd4cf] bg-white p-1.5" /><input className={inputClass} placeholder="Ej. Perla y dorado" /></div></label>
            </div>
          </Panel>
        </div>

        <div className="space-y-5 xl:sticky xl:top-24">
          <Panel className="p-5">
            <h2 className="font-serif text-lg text-[#3e312f]">Precio y disponibilidad</h2>
            <div className="mt-5 space-y-4">
              <label><span className={labelClass}>Precio <span className="font-normal text-[#978a85]">(opcional)</span></span><div className="relative"><span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8e817c]">$</span><input name="price" type="number" min="0" step="0.01" className={`${inputClass} pl-8`} placeholder="0.00" /><span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#9b8d88]">USD</span></div><span className="mt-1.5 block text-[11px] leading-4 text-[#978a85]">Puedes dejarlo vacío para cotizar por mensaje.</span></label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#faf7f5] p-3"><input name="showPrice" type="checkbox" className="mt-0.5 size-4 accent-[#92635e]" /><span><strong className="block text-xs text-[#50423f]">Mostrar precio en el catálogo</strong><span className="mt-1 block text-[11px] leading-4 text-[#8f827d]">Desactivado por defecto.</span></span></label>
              <label><span className={labelClass}>Disponibilidad</span><select name="availability" className={`${inputClass} appearance-none`} defaultValue="AVAILABLE"><option value="AVAILABLE">Disponible</option><option value="MADE_TO_ORDER">Por encargo</option><option value="UNAVAILABLE">No disponible</option></select></label>
              <label><span className={labelClass}>Estado</span><select name="status" className={`${inputClass} appearance-none`} defaultValue="DRAFT"><option value="DRAFT">Borrador</option><option value="PUBLISHED">Publicado</option><option value="HIDDEN">Oculto</option></select></label>
            </div>
          </Panel>
          <Panel className="p-5"><h2 className="font-serif text-lg text-[#3e312f]">Visibilidad</h2><label className="mt-4 flex cursor-pointer items-start gap-3"><input name="featured" type="checkbox" className="mt-0.5 size-4 accent-[#92635e]" /><span><strong className="block text-sm text-[#50423f]">Producto destacado</strong><span className="mt-1 block text-xs leading-5 text-[#8f827d]">Mostrar esta pieza en la selección de inicio.</span></span></label><button type="submit" className={`${primaryButton} mt-6 w-full`}><Save className="size-4" />Guardar producto</button></Panel>
        </div>
      </form>
    </div>
  );
}
