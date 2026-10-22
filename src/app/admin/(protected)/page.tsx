import Link from "next/link";
import { ArrowRight, EyeOff, FolderOpen, ImagePlus, MessageCircle, Package, PackageCheck, PackagePlus, PencilLine, Sparkles } from "lucide-react";
import { PageHeader, Panel, ProductVisual, StatusBadge, primaryButton } from "@/components/admin/admin-ui";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";

const statusLabel = { DRAFT: "Borrador", PUBLISHED: "Publicado", HIDDEN: "Oculto" } as const;

export default async function DashboardPage() {
  const user = await requireUser();
  const [total, published, hidden, categoryCount, featured, contactCount, products, activity] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { status: "PUBLISHED" } }),
    db.product.count({ where: { status: { in: ["DRAFT", "HIDDEN"] } } }),
    db.category.count({ where: { active: true } }),
    db.product.count({ where: { featured: true, status: "PUBLISHED" } }),
    db.contactEvent.count(),
    db.product.findMany({ include: { category: true }, orderBy: { updatedAt: "desc" }, take: 4 }),
    db.activityLog.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 4 }),
  ]);

  const stats = [
    { label: "Productos", value: total, icon: Package, tone: "bg-[#f1dfdb] text-[#8b5d58]" },
    { label: "Publicados", value: published, icon: PackageCheck, tone: "bg-[#e1e9df] text-[#566b52]" },
    { label: "Borradores u ocultos", value: hidden, icon: EyeOff, tone: "bg-[#eee7d9] text-[#756349]" },
    { label: "Categorías", value: categoryCount, icon: FolderOpen, tone: "bg-[#e9e2eb] text-[#705f77]" },
    { label: "Destacados", value: featured, icon: Sparkles, tone: "bg-[#f1dfdb] text-[#8b5d58]" },
    { label: "Clics hacia WhatsApp", value: contactCount, icon: MessageCircle, tone: "bg-[#e1e9df] text-[#566b52]" },
  ];

  return (
    <div className="space-y-7">
      <PageHeader eyebrow="Panel de control" title={`Hola, ${user.name?.split(" ")[0] ?? "Administradora"}`} description="Este es el estado actual del catálogo. Los clics de WhatsApp son consultas, no ventas confirmadas." actions={<Link href="/admin/productos/nuevo" className={primaryButton}><PackagePlus className="size-4" />Nuevo producto</Link>} />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, tone }) => <Panel key={label} className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-[#847773]">{label}</p><p className="mt-2 font-serif text-3xl text-[#3b302e]">{value}</p></div><span className={`grid size-9 place-items-center rounded-xl ${tone}`}><Icon className="size-4" /></span></div></Panel>)}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <Panel>
          <div className="flex items-center justify-between border-b border-[#eee8e4] p-5 sm:p-6"><div><h2 className="font-serif text-xl text-[#3d312f]">Catálogo reciente</h2><p className="mt-1 text-xs text-[#8a7d79]">Últimos productos modificados</p></div><Link href="/admin/productos" className="flex items-center gap-1 text-xs font-bold text-[#8a5e59]">Ver todos <ArrowRight className="size-3.5" /></Link></div>
          <div className="divide-y divide-[#f0eae7]">{products.length ? products.map((product, index) => <div key={product.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6"><ProductVisual color={index % 2 ? "#c7ad8c" : "#d5b6ae"} accent="#f5ebe6" className="size-12 shrink-0 rounded-xl" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#493b38]">{product.name}</p><p className="mt-0.5 text-[11px] text-[#948681]">{product.category.name}</p></div><StatusBadge status={statusLabel[product.status]} /></div>) : <p className="p-8 text-center text-sm text-[#8a7d79]">Todavía no hay productos.</p>}</div>
        </Panel>

        <Panel>
          <div className="border-b border-[#eee8e4] p-5 sm:p-6"><h2 className="font-serif text-xl text-[#3d312f]">Actividad reciente</h2><p className="mt-1 text-xs text-[#8a7d79]">Cambios registrados por el equipo</p></div>
          <div className="p-5 sm:p-6">{activity.length ? activity.map((item) => <div key={item.id} className="flex gap-3 border-b border-[#eee8e4] py-3 first:pt-0 last:border-0 last:pb-0"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#eee2dd] text-[9px] font-bold text-[#805954]">{item.user?.name.slice(0, 2).toUpperCase() ?? "ST"}</span><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-[#4a3d3a]">{item.action} · {item.entityType}</p><p className="mt-0.5 text-[11px] text-[#91837e]">{item.createdAt.toLocaleString("es-SV")}</p></div></div>) : <p className="text-sm text-[#8a7d79]">Sin cambios registrados.</p>}</div>
        </Panel>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">{[
        { title: "Añadir producto", text: "Crea una pieza del catálogo", icon: PackagePlus, href: "/admin/productos/nuevo" },
        { title: "Subir imágenes", text: "Organiza los recursos de la marca", icon: ImagePlus, href: "/admin/galeria" },
        { title: "Editar portada", text: "Actualiza el mensaje principal", icon: PencilLine, href: "/admin/contenido" },
      ].map(({ title, text, icon: Icon, href }) => <Link href={href} key={title} className="group flex items-center gap-4 rounded-[20px] border border-[#e8e0dc] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"><span className="grid size-11 place-items-center rounded-2xl bg-[#f3e7e1] text-[#90645f]"><Icon className="size-[18px]" /></span><span className="min-w-0 flex-1"><strong className="block text-sm text-[#493b38]">{title}</strong><span className="mt-0.5 block text-xs text-[#8e817c]">{text}</span></span><ArrowRight className="size-4 text-[#b0a29d]" /></Link>)}</section>
    </div>
  );
}
