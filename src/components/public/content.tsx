/* eslint-disable @next/next/no-img-element */
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Category } from "@/config/demo-content";

export { ProductCard } from "@/components/public/product-card";

export function Eyebrow({ children, light = false, previewField }: { children: React.ReactNode; light?: boolean; previewField?: string }) {
  return <p data-preview-field={previewField} className={`mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] ${light ? "text-[#E8E0D5]" : "text-[#9B7654]"}`}><span className="h-px w-8 bg-current" />{children}</p>;
}

export function CollectionCard({ collection, index }: { collection: Category; index: number }) {
  return (
    <article className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-20 ${index % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
      <div className="overflow-hidden bg-[#F5F2EC]">{collection.image ? <img src={collection.image} alt={`Accesorios para ${collection.name.toLowerCase()}`} className="aspect-[4/5] w-full object-cover transition duration-700 hover:scale-[1.02]" /> : <div className="grid aspect-[4/5] place-items-center px-8 text-center text-[10px] uppercase tracking-[0.25em] text-[#8b756a]">Imagen pendiente</div>}</div>
      <div className="px-3 py-4 sm:px-10"><p className="text-[10px] uppercase tracking-[0.34em] text-[#9B7654]">{collection.eyebrow}</p><h2 className="mt-5 text-5xl italic sm:text-6xl">{collection.name}</h2><p className="mt-6 max-w-md text-base leading-8 text-[#685B54]">{collection.description}</p><Link href={`/productos?categoria=${collection.slug}`} className="mt-8 inline-flex items-center gap-3 border-b border-[#857268] pb-2 text-[10px] uppercase tracking-[0.25em]">Descubrir piezas <ArrowRight size={14} /></Link></div>
    </article>
  );
}

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <section className="px-5 py-20 text-center sm:px-8 sm:py-28"><Eyebrow>{eyebrow}</Eyebrow><h1 className="mx-auto max-w-4xl text-5xl leading-[1.05] sm:text-7xl">{title}</h1><p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#685B54]">{text}</p></section>;
}
