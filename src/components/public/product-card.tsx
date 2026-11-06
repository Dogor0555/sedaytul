"use client";

/* eslint-disable @next/next/no-img-element */

import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/config/demo-content";
import { AddToInquiryButton, useInquiryCart } from "@/components/public/inquiry-cart";

function buildWhatsAppLink(number: string, product: Product) {
  const message = `Hola Seda y Tul, quisiera consultar por "${product.name}" (${product.category}).`;
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function ProductCard({ product }: { product: Product }) {
  const { whatsappNumber } = useInquiryCart();
  const isFixed = product.pricingMode === "FIXED" && product.priceValue != null;

  return (
    <article className="group flex h-full flex-col">
      <Link href={`/productos/${product.slug}`} className="block overflow-hidden bg-[#F5F2EC]">
        <img
          src={product.image}
          alt={`${product.kind} ${product.name}`}
          className="aspect-[3/4] h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col border-b border-[#E2DCD4] py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.28em] text-[#857268]">{product.kind} · {product.category}</p>
            <h2 className="mt-1 text-2xl">
              <Link href={`/productos/${product.slug}`} className="hover:text-[#9B7654]">{product.name}</Link>
            </h2>
            <p className="mt-1 font-sans text-xs font-semibold text-[#857268]">
              {isFixed ? product.price : "Precio a cotización"}
            </p>
          </div>
          <Link href={`/productos/${product.slug}`} aria-label={`Ver ${product.name}`} className="mt-2 shrink-0 transition-transform group-hover:translate-x-1">
            <ArrowRight size={18} />
          </Link>
        </div>
        <p className="mt-3 line-clamp-2 font-sans text-sm leading-6 text-[#685B54]">{product.description}</p>
        {product.personalization ? (
          <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.1em] text-[#9B7654]">Personalizable: {product.personalization}</p>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          <a href={buildWhatsAppLink(whatsappNumber, product)} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#423A36] px-3.5 text-[10px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#655C57]">
            <MessageCircle size={13} /> Consultar
          </a>
          <AddToInquiryButton
            compact
            item={{
              slug: product.slug,
              name: product.name,
              image: product.image,
              category: product.category,
              kind: product.kind,
              pricingMode: isFixed ? "FIXED" : "QUOTE",
              unitPrice: isFixed ? product.priceValue ?? null : null,
              quantity: 1,
            }}
          />
        </div>
      </div>
    </article>
  );
}
