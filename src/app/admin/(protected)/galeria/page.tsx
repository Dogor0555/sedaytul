import { Check, ImagePlus, MoreHorizontal, Search, Upload } from "lucide-react";
import { galleryItems } from "@/config/admin-demo";
import { DemoNotice, PageHeader, Panel, inputClass, primaryButton, secondaryButton } from "@/components/admin/admin-ui";

export default function GalleryPage() {
  return <div className="space-y-7">
    <PageHeader eyebrow="Recursos" title="Galería" description="Centraliza fotografías de producto, editoriales y recursos de la marca." actions={<><button className={secondaryButton}><ImagePlus className="size-4" />Nueva carpeta</button><button className={primaryButton}><Upload className="size-4" />Subir imágenes demo</button></>} />
    <DemoNotice compact />
    <Panel className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[#ece5e1] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <label className="relative w-full sm:max-w-sm"><span className="sr-only">Buscar archivos</span><Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9c8f8a]" /><input className={`${inputClass} pl-10`} placeholder="Buscar archivos..." /></label>
        <p className="text-xs text-[#8e817d]">8 archivos · 12.7 MB</p>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:gap-4 sm:p-5 xl:grid-cols-4">
        {galleryItems.map((item, index) => <article key={item.id} className="group overflow-hidden rounded-2xl border border-[#e9e1dd] bg-white">
          <div className="relative aspect-[4/3] overflow-hidden" style={{ background: `linear-gradient(145deg, ${item.accent}, ${item.color})` }}>
            <div className="absolute -bottom-[20%] left-[18%] h-[90%] w-[65%] rotate-[-8deg] rounded-[50%_50%_25%_25%] bg-white/20 shadow-2xl" />
            <div className="absolute right-2 top-2 flex gap-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100"><button className="grid size-8 place-items-center rounded-lg bg-white/90 text-[#5b4945] shadow" aria-label={`Seleccionar ${item.name}`}>{index === 0 ? <Check className="size-4" /> : <span className="size-3.5 rounded border border-[#aa9b96]" />}</button><button className="grid size-8 place-items-center rounded-lg bg-white/90 text-[#5b4945] shadow" aria-label={`Opciones de ${item.name}`}><MoreHorizontal className="size-4" /></button></div>
          </div>
          <div className="p-3"><p className="truncate text-xs font-semibold text-[#50413e]">{item.name}</p><p className="mt-1 text-[10px] text-[#998c87]">{item.size} · JPG</p></div>
        </article>)}
      </div>
    </Panel>
  </div>;
}
