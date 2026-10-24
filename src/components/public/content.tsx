/* eslint-disable @next/next/no-img-element */
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Category, Product } from "@/config/demo-content";

export function Eyebrow({ children, light = false, previewField }: { children: React.ReactNode; light?: boolean; previewField?: string }) {
  return <p data-preview-field={previewField} className={`mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] ${light ? "text-[#E8D6CF]" : "text-[#9B7654]"}`}><span className="h-px w-8 bg-current" />{children}</p>;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <Link href={`/productos/${product.slug}`} className="block overflow-hidden bg-[#E8D6CF]">
        <img src={product.image} alt={`${product.kind} ${product.name}`} className="aspect-[3/4] h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
      </Link>
      <div className="flex items-start justify-between gap-4 border-b border-[#C7AD8C]/45 py-5">
        <div><p className="text-[9px] uppercase tracking-[0.3em] text-[#857268]">{product.kind} · {product.category}</p><h2 className="mt-1 text-2xl">{product.name}</h2>{product.price ? <p className="mt-1 font-sans text-xs font-semibold text-[#857268]">{product.price}</p> : null}</div>
        <Link href={`/productos/${product.slug}`} aria-label={`Ver ${product.kind.toLowerCase()} ${product.name}`} className="mt-2 transition-transform group-hover:translate-x-1"><ArrowRight size={18} /></Link>
      </div>
    </article>
  );
}

export function CollectionCard({ collection, index }: { collection: Category; index: number }) {
  return (
    <article className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-20 ${index % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
      <div className="overflow-hidden bg-[#E8D6CF]"><img src={collection.image} alt={`Accesorios para ${collection.name.toLowerCase()}`} className="aspect-[4/5] w-full object-cover transition duration-700 hover:scale-[1.02]" /></div>
      <div className="px-3 py-4 sm:px-10"><p className="text-[10px] uppercase tracking-[0.34em] text-[#9B7654]">{collection.eyebrow}</p><h2 className="mt-5 text-5xl italic sm:text-6xl">{collection.name}</h2><p className="mt-6 max-w-md text-base leading-8 text-[#685B54]">{collection.description}</p><Link href={`/productos?categoria=${collection.slug}`} className="mt-8 inline-flex items-center gap-3 border-b border-[#857268] pb-2 text-[10px] uppercase tracking-[0.25em]">Descubrir piezas <ArrowRight size={14} /></Link></div>
    </article>
  );
}

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <section className="px-5 py-20 text-center sm:px-8 sm:py-28"><Eyebrow>{eyebrow}</Eyebrow><h1 className="mx-auto max-w-4xl text-5xl leading-[1.05] sm:text-7xl">{title}</h1><p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#685B54]">{text}</p></section>;
}
