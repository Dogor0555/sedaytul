/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public/site-chrome";
import { getPublicProduct } from "@/server/repositories/public-catalog";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  return product ? { title: `${product.name} | Seda y Tul`, description: product.description } : {};
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  if (!product) notFound();
  return <PublicShell><div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-12"><Link href="/productos" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#857268]"><ArrowLeft size={14} /> Volver a accesorios</Link></div><section className="mx-auto grid max-w-[1500px] gap-12 px-5 pb-24 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16 lg:px-12"><div className="grid gap-3 sm:grid-cols-2">{product.images.map((image, index) => <img key={image} src={image} alt={`${product.kind} ${product.name}, vista ${index + 1}`} className={`w-full object-cover ${index === 0 ? "aspect-[3/4] sm:row-span-2 sm:h-full" : "aspect-[3/4]"}`} />)}</div><div className="self-start lg:sticky lg:top-10 lg:py-12"><p className="text-[10px] uppercase tracking-[0.34em] text-[#9B7654]">{product.kind} · {product.category}</p><h1 className="mt-4 text-6xl sm:text-7xl">{product.name}</h1>{product.price ? <p className="mt-4 text-sm uppercase tracking-[0.12em] text-[#857268]">{product.price}</p> : null}<div className="my-8 h-px bg-[#C7AD8C]/50" /><p className="text-base leading-8 text-[#685B54]">{product.detail}</p><div className="mt-8"><p className="mb-4 text-[10px] uppercase tracking-[0.25em]">Detalles</p><ul className="space-y-2 text-sm text-[#685B54]">{product.materials.map((material) => <li key={material} className="flex items-center gap-3"><span className="h-1 w-1 rounded-full bg-[#C7AD8C]" />{material}</li>)}</ul></div><a href={`/contactar/${product.slug}`} target="_blank" rel="noreferrer" className="mt-10 flex w-full items-center justify-center gap-3 bg-[#423A36] px-7 py-4 text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#857268]"><MessageCircle size={16} /> Consultar por esta pieza</a><p className="mt-4 text-center text-xs leading-5 text-[#857268]">Disponibilidad, opciones y entrega se confirman personalmente por WhatsApp.</p></div></section></PublicShell>;
}
