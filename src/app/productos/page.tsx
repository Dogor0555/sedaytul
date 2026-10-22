import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, ProductCard } from "@/components/public/content";
import { PublicShell } from "@/components/public/site-chrome";
import { getPublicCategories, getPublicProducts } from "@/server/repositories/public-catalog";

export const metadata: Metadata = { title: "Accesorios | Seda y Tul", description: "Peinetas, tocados, diademas, coronas y lazos artesanales en El Salvador." };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const [categories, products] = await Promise.all([getPublicCategories(), getPublicProducts()]);
  const selected = categories.find((item) => item.slug === categoria);
  const visibleProducts = selected ? products.filter((product) => product.category === selected.name) : products;
  return <PublicShell><PageIntro eyebrow="Creaciones artesanales" title={selected ? selected.name : "Detalles para recordar"} text={selected?.description ?? "Una selección de peinetas, tocados, diademas, coronas y lazos para acompañar ocasiones significativas."} /><div className="mx-auto flex max-w-[1400px] flex-wrap justify-center gap-x-7 gap-y-3 px-5 pb-14 text-[10px] uppercase tracking-[0.22em]"><Link href="/productos" className={!selected ? "border-b border-[#423A36] pb-2" : "pb-2 text-[#857268]"}>Todos</Link>{categories.map((category) => <Link key={category.slug} href={`/productos?categoria=${category.slug}`} className={selected?.slug === category.slug ? "border-b border-[#423A36] pb-2" : "pb-2 text-[#857268]"}>{category.name}</Link>)}</div>{visibleProducts.length ? <section className="mx-auto grid max-w-[1400px] gap-x-8 gap-y-14 px-5 pb-28 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-12">{visibleProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</section> : <section className="mx-auto max-w-3xl px-5 pb-28 text-center"><div className="border border-[#C7AD8C]/45 bg-white/45 px-6 py-14"><p className="text-3xl">Todavía no hay piezas publicadas</p><p className="mt-3 font-sans text-sm leading-7 text-[#685B54]">El catálogo se actualizará desde el panel administrativo.</p></div></section>}</PublicShell>;
}
