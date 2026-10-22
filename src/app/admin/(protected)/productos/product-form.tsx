import Link from "next/link";
import { ChevronDown, Save } from "lucide-react";
import { PageHeader, Panel, inputClass, labelClass, primaryButton } from "@/components/admin/admin-ui";
import { ProductImageManager } from "@/components/admin/product-image-manager";

type CategoryOption = { id: string; name: string };
type ExistingMedia = { id: string; url: string; altText: string | null };
type ProductValues = {
  name: string;
  categoryId: string;
  referenceCode: string | null;
  shortDescription: string | null;
  description: string | null;
  price: string | null;
  status: "DRAFT" | "PUBLISHED" | "HIDDEN";
  availability: "AVAILABLE" | "MADE_TO_ORDER" | "UNAVAILABLE";
  showPrice: boolean;
  featured: boolean;
  media: ExistingMedia[];
};

export function ProductForm({
  action,
  categories,
  product,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: CategoryOption[];
  product?: ProductValues;
}) {
  const editing = Boolean(product);

  return (
    <div className="space-y-7">
      <Link href="/admin/productos" className="inline-flex items-center gap-2 text-sm font-semibold text-[#796965] hover:text-[#4c3c39]">&larr; Volver a productos</Link>
      <PageHeader
        eyebrow={editing ? "Catálogo / Editar" : "Catálogo / Nuevo"}
        title={editing ? "Editar producto" : "Crear producto"}
        description={editing ? "Actualiza la información, visibilidad y disponibilidad de la pieza." : "Completa la información de la pieza y elige si se publica de inmediato."}
      />

      <form action={action} className="grid items-start gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Panel className="p-5 sm:p-6">
            <div className="mb-6"><h2 className="font-serif text-xl text-[#3e312f]">Información principal</h2><p className="mt-1 text-xs text-[#8d807c]">Datos que verá el cliente en el catálogo.</p></div>
            <div className="space-y-5">
              <label><span className={labelClass}>Nombre del producto</span><input name="name" required minLength={2} maxLength={120} className={inputClass} defaultValue={product?.name} placeholder="Ej. Peineta Flor de Nácar" /></label>
              <label><span className={labelClass}>Descripción corta</span><input name="shortDescription" className={inputClass} maxLength={300} defaultValue={product?.shortDescription ?? ""} placeholder="Resumen para las tarjetas del catálogo" /></label>
              <label><span className={labelClass}>Descripción completa</span><textarea name="description" maxLength={5000} className={`${inputClass} min-h-32 resize-y py-3`} defaultValue={product?.description ?? ""} placeholder="Describe materiales, elaboración artesanal y detalles especiales..." /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label><span className={labelClass}>Categoría</span><span className="relative block"><select name="categoryId" required className={`${inputClass} appearance-none pr-9`} defaultValue={product?.categoryId ?? ""}><option value="" disabled>Selecciona una categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9b8d88]" /></span></label>
                <label><span className={labelClass}>Código de referencia</span><input name="referenceCode" maxLength={50} className={inputClass} defaultValue={product?.referenceCode ?? ""} placeholder="ST-025" /></label>
              </div>
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <div className="mb-6"><h2 className="font-serif text-xl text-[#3e312f]">Imágenes</h2><p className="mt-1 text-xs text-[#8d807c]">Añade, quita o elige la fotografía principal. El orden se guarda con el producto.</p></div>
            <ProductImageManager existing={product?.media ?? []} />
          </Panel>
        </div>

        <div className="space-y-5 xl:sticky xl:top-24">
          <Panel className="p-5">
            <h2 className="font-serif text-lg text-[#3e312f]">Precio y disponibilidad</h2>
            <div className="mt-5 space-y-4">
              <label><span className={labelClass}>Precio <span className="font-normal text-[#978a85]">(opcional)</span></span><div className="relative"><span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8e817c]">$</span><input name="price" type="number" min="0" max="9999999999.99" step="0.01" className={`${inputClass} pl-8`} defaultValue={product?.price ?? ""} placeholder="0.00" /><span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#9b8d88]">USD</span></div></label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#faf7f5] p-3"><input name="showPrice" type="checkbox" defaultChecked={product?.showPrice} className="mt-0.5 size-4 accent-[#92635e]" /><span><strong className="block text-xs text-[#50423f]">Mostrar precio en el catálogo</strong><span className="mt-1 block text-[11px] leading-4 text-[#8f827d]">Solo se mostrará cuando exista un precio.</span></span></label>
              <label><span className={labelClass}>Disponibilidad</span><select name="availability" className={`${inputClass} appearance-none`} defaultValue={product?.availability ?? "AVAILABLE"}><option value="AVAILABLE">Disponible</option><option value="MADE_TO_ORDER">Por encargo</option><option value="UNAVAILABLE">No disponible</option></select></label>
              <label><span className={labelClass}>Estado</span><select name="status" className={`${inputClass} appearance-none`} defaultValue={product?.status ?? "DRAFT"}><option value="DRAFT">Borrador</option><option value="PUBLISHED">Publicado</option><option value="HIDDEN">Oculto</option></select></label>
            </div>
          </Panel>
          <Panel className="p-5"><h2 className="font-serif text-lg text-[#3e312f]">Visibilidad</h2><label className="mt-4 flex cursor-pointer items-start gap-3"><input name="featured" type="checkbox" defaultChecked={product?.featured} className="mt-0.5 size-4 accent-[#92635e]" /><span><strong className="block text-sm text-[#50423f]">Producto destacado</strong><span className="mt-1 block text-xs leading-5 text-[#8f827d]">Mostrar esta pieza en la selección de inicio.</span></span></label><button type="submit" className={`${primaryButton} mt-6 w-full`}><Save className="size-4" />{editing ? "Guardar cambios" : "Guardar producto"}</button></Panel>
        </div>
      </form>
    </div>
  );
}
