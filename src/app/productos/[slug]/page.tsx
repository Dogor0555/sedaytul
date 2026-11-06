/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToInquiryButton } from "@/components/public/inquiry-cart";
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

  const isGift = product.productType === "GIFT";

  return (
    <PublicShell>
      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-12">
        <Link href={isGift ? "/productos?tipo=regalos" : "/productos?tipo=accesorios"} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#857268]">
          <ArrowLeft size={14} /> Volver a {isGift ? "regalos" : "accesorios"}
        </Link>
      </div>
      <section className="mx-auto grid max-w-[1500px] gap-12 px-5 pb-24 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16 lg:px-12">
        <div className="grid gap-3 sm:grid-cols-2">
          {product.images.map((image, index) => (
            <img key={image} src={image} alt={`${product.kind} ${product.name}, vista ${index + 1}`} className={`w-full object-cover ${index === 0 ? "aspect-[3/4] sm:row-span-2 sm:h-full" : "aspect-[3/4]"}`} />
          ))}
        </div>
        <div className="self-start lg:sticky lg:top-10 lg:py-12">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[#9B7654]">{product.kind} · {product.category}</p>
          <h1 className="mt-4 text-6xl sm:text-7xl">{product.name}</h1>
          <p className="mt-4 text-sm uppercase tracking-[0.12em] text-[#857268]">
            {product.pricingMode === "FIXED" && product.price ? product.price : "Precio a cotización"}
          </p>
          <div className="my-8 h-px bg-[#E2DCD4]" />
          <p className="text-base leading-8 text-[#685B54]">{product.detail}</p>

          <div className="mt-8">
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em]">Detalles</p>
            <ul className="space-y-2 text-sm text-[#685B54]">
              {product.materials.map((material) => <li key={material} className="flex items-center gap-3"><span className="h-1 w-1 rounded-full bg-[#C7AD8C]" />{material}</li>)}
            </ul>
          </div>

          {product.personalization ? (
            <div className="mt-6 rounded-2xl border border-[#E2DCD4] bg-[#FAF9F6] p-4">
              <p className="text-[9px] uppercase tracking-[0.24em] text-[#9B7654]">Personalización</p>
              <p className="mt-2 text-sm leading-6 text-[#685B54]">{product.personalization}</p>
            </div>
          ) : null}

          {product.presentation ? (
            <div className="mt-3 rounded-2xl border border-[#E2DCD4] bg-white p-4">
              <p className="text-[9px] uppercase tracking-[0.24em] text-[#9B7654]">Presentación</p>
              <p className="mt-2 text-sm leading-6 text-[#685B54]">{product.presentation}</p>
            </div>
          ) : null}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={`/contactar/${product.slug}`} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-3 bg-[#423A36] px-7 py-4 text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#655C57]">
              <MessageCircle size={16} /> Consultar por WhatsApp
            </a>
            <AddToInquiryButton
              item={{
                slug: product.slug,
                name: product.name,
                image: product.image,
                category: product.category,
                kind: product.kind,
                pricingMode: product.pricingMode ?? "QUOTE",
                unitPrice: product.priceValue ?? null,
                quantity: 1,
              }}
            />
          </div>
          <p className="mt-4 text-center text-xs leading-5 text-[#857268]">
            {product.pricingMode === "FIXED"
              ? "Añadí la pieza al carrito y completá tus datos. El pago con PayPal o transferencia se coordina por WhatsApp."
              : "Esta pieza se cotiza según tus detalles. Añadila al carrito y envianos tu solicitud por WhatsApp."}
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
