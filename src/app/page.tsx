/* eslint-disable @next/next/no-img-element */
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Eyebrow, ProductCard } from "@/components/public/content";
import { PublicShell } from "@/components/public/site-chrome";
import { processSteps, whatsappUrl } from "@/config/demo-content";
import { getPublicProducts } from "@/server/repositories/public-catalog";

export default async function Home() {
  const featured = await getPublicProducts({ featured: true });

  return (
    <PublicShell>
      <section className="grid min-h-[calc(100vh-6rem)] bg-[#E8D6CF] lg:grid-cols-[42%_58%]">
        <div className="relative flex flex-col justify-center px-7 py-20 sm:px-14 lg:px-[10%]">
          <div className="absolute left-8 top-10 h-24 w-24 rounded-full border border-[#C7AD8C]/60 sm:left-auto sm:right-10" />
          <Eyebrow>Accesorios artesanales</Eyebrow>
          <h1 className="relative z-10 text-[clamp(3.5rem,7vw,7.4rem)] leading-[0.88] tracking-[-0.04em]">Pequeños detalles,<br /><i className="ml-[12%] font-normal">grandes recuerdos</i></h1>
          <p className="mt-9 max-w-md text-sm leading-7 text-[#685B54] sm:text-base">Peinetas, tocados, diademas, coronas y lazos hechos en El Salvador para acompañar celebraciones inolvidables.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/colecciones" className="inline-flex items-center gap-4 bg-[#423A36] px-7 py-4 text-[10px] uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#857268]">Explorar categorías <ArrowRight size={15} /></Link>
            <Link href="/contacto" className="inline-flex items-center border-b border-[#857268] px-3 text-[10px] uppercase tracking-[0.24em]">Hacer una consulta</Link>
          </div>
        </div>
        <div className="relative min-h-[65vh] overflow-hidden"><img src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1800&q=90" alt="Detalle de accesorios delicados en tonos dorados" className="absolute inset-0 h-full w-full object-cover object-center" /><div className="absolute inset-0 bg-gradient-to-t from-[#423A36]/25 to-transparent" /><span className="absolute bottom-8 right-8 flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-white"><ArrowDown size={14} /> Descubrir</span></div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="mb-14 grid gap-8 md:grid-cols-2 md:items-end"><div><Eyebrow>Piezas elegidas</Eyebrow><h2 className="text-5xl sm:text-6xl">Una belleza <i className="font-normal">íntima</i></h2></div><p className="max-w-md text-sm leading-7 text-[#685B54] md:justify-self-end">Diseños delicados que celebran la identidad de cada persona y la emoción de cada ocasión.</p></div>
        {featured.length ? <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">{featured.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <div className="border border-[#C7AD8C]/45 bg-white/45 px-6 py-14 text-center"><p className="text-3xl">Nuevas piezas muy pronto</p><p className="mx-auto mt-3 max-w-lg font-sans text-sm leading-7 text-[#685B54]">Estamos preparando el catálogo. Mientras tanto, podés escribirnos y contarnos qué accesorio estás buscando.</p></div>}
        <div className="mt-12 text-center"><Link href="/productos" className="inline-flex items-center gap-3 border-b border-[#857268] pb-2 text-[10px] uppercase tracking-[0.25em]">Ver todos los accesorios <ArrowRight size={14} /></Link></div>
      </section>

      <section className="grid bg-[#423A36] text-[#F9F6F1] lg:grid-cols-2">
        <div className="min-h-[560px] overflow-hidden"><img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=85" alt="Detalle de una pieza artesanal con pequeños cristales" className="h-full w-full object-cover opacity-90" /></div>
        <div className="flex items-center px-7 py-20 sm:px-16 lg:px-[12%]"><div><Eyebrow light>Hecho con intención</Eyebrow><Sparkles className="mb-7 text-[#C7AD8C]" strokeWidth={1} /><h2 className="text-5xl leading-tight sm:text-6xl">El valor de hacer<br /><i className="font-normal">las cosas despacio</i></h2><p className="mt-7 max-w-lg text-sm leading-8 text-white/65">Cada flor, perla y lazo encuentra su lugar a través de un proceso manual, atento a las proporciones, el color y los pequeños acabados.</p><Link href="/nosotros" className="mt-9 inline-flex items-center gap-3 border-b border-[#C7AD8C] pb-2 text-[10px] uppercase tracking-[0.25em]">Nuestra historia <ArrowRight size={14} /></Link></div></div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32"><div className="text-center"><Eyebrow>Cómo elegir</Eyebrow><h2 className="text-5xl">Tu accesorio, <i className="font-normal">paso a paso</i></h2></div><div className="mt-16 grid gap-px bg-[#C7AD8C]/40 md:grid-cols-3">{processSteps.map((step) => <article key={step.number} className="bg-[#F9F6F1] p-8 sm:p-11"><span className="text-4xl italic text-[#C7AD8C]">{step.number}</span><h3 className="mt-10 text-2xl">{step.title}</h3><p className="mt-4 text-sm leading-7 text-[#685B54]">{step.text}</p></article>)}</div></section>

      <section className="relative overflow-hidden bg-[#E8D6CF] px-5 py-24 text-center sm:px-8"><div className="absolute -left-16 -top-24 h-72 w-72 rounded-full border border-[#C7AD8C]" /><div className="relative"><p className="text-[10px] uppercase tracking-[0.35em] text-[#857268]">¿Buscás algo especial?</p><h2 className="mx-auto mt-6 max-w-3xl text-5xl leading-tight sm:text-6xl">Encontremos el detalle para <i className="font-normal">tu celebración</i></h2><a href={whatsappUrl("Hola Seda y Tul, quisiera consultar por un accesorio para una celebración.")} target="_blank" rel="noreferrer" className="mt-9 inline-flex items-center gap-4 bg-[#423A36] px-8 py-4 text-[10px] uppercase tracking-[0.24em] text-white">Escribir por WhatsApp <ArrowRight size={15} /></a></div></section>
    </PublicShell>
  );
}
