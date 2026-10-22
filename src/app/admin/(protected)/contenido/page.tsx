import { ArrowUpRight, Eye, FileText, GripVertical, PencilLine } from "lucide-react";
import { contentSections } from "@/config/admin-demo";
import { DemoNotice, PageHeader, Panel, StatusBadge, secondaryButton } from "@/components/admin/admin-ui";

export default function ContentPage() {
  return <div className="space-y-7">
    <PageHeader eyebrow="Sitio web" title="Contenido" description="Edita los mensajes y secciones editoriales visibles en la tienda." actions={<button className={secondaryButton}><Eye className="size-4" />Vista previa del sitio</button>} />
    <DemoNotice compact />
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <Panel className="overflow-hidden">
        <div className="border-b border-[#ece5e1] p-5 sm:p-6"><h2 className="font-serif text-xl text-[#3e312f]">Secciones del sitio</h2><p className="mt-1 text-xs text-[#8d807c]">Contenido editable de las páginas públicas.</p></div>
        <div className="divide-y divide-[#eee8e4]">
          {contentSections.map((section) => <article key={section.title} className="flex items-center gap-3 p-4 sm:gap-4 sm:px-6 sm:py-5">
            <GripVertical className="hidden size-5 text-[#b2a7a2] sm:block" />
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#f2e6e0] text-[#8e615c]"><FileText className="size-[18px]" /></span>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-[#4a3c39]">{section.title}</h3><StatusBadge status={section.status} /></div><p className="mt-1 truncate text-xs text-[#8f827d]">{section.description}</p><p className="mt-1 text-[10px] text-[#aa9e99]">Actualizado: {section.updated}</p></div>
            <button className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-[#ded5d0] px-3 text-xs font-semibold text-[#675753] hover:bg-[#faf7f5]"><PencilLine className="size-3.5" /><span className="hidden sm:inline">Editar</span></button>
          </article>)}
        </div>
      </Panel>
      <div className="space-y-5">
        <Panel className="overflow-hidden">
          <div className="h-36 bg-[linear-gradient(145deg,#d7aaa3,#f0ded3_60%,#a5ac98)] p-5"><span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#785651]">En portada</span></div>
          <div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b8c87]">Mensaje principal</p><h2 className="mt-2 font-serif text-2xl leading-tight text-[#3d302e]">Detalles hechos para momentos inolvidables</h2><p className="mt-2 text-xs leading-5 text-[#887b77]">Accesorios artesanales para novias, bautizos, primeras comuniones y ocasiones especiales.</p><button className="mt-4 flex items-center gap-1 text-xs font-bold text-[#8b5f5a]">Editar portada <ArrowUpRight className="size-3.5" /></button></div>
        </Panel>
        <Panel className="p-5"><h2 className="font-serif text-lg text-[#3e312f]">Estado editorial</h2><div className="mt-4 space-y-3 text-xs"><div className="flex justify-between text-[#80736f]"><span>Secciones publicadas</span><strong className="text-[#4a3c39]">3</strong></div><div className="flex justify-between text-[#80736f]"><span>Borradores</span><strong className="text-[#946a54]">1</strong></div><div className="h-1.5 overflow-hidden rounded-full bg-[#eee7e3]"><div className="h-full w-3/4 rounded-full bg-[#a87a73]" /></div></div></Panel>
      </div>
    </div>
  </div>;
}
