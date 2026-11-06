/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

type BrandMarkProps = {
  light?: boolean;
  logoUrl?: string | null;
  businessName?: string;
};

export function BrandMark({ light = false, logoUrl, businessName = "Seda y Tul" }: BrandMarkProps) {
  return (
    <Link href="/" className={`group inline-flex flex-col items-center leading-none ${light ? "text-[#F9F6F1]" : "text-[#423A36]"}`} aria-label={`${businessName}, inicio`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={businessName}
          className="h-14 w-auto max-w-[220px] object-contain sm:h-16"
        />
      ) : (
        <>
          <span className="text-2xl tracking-[0.08em]">Seda <i className="font-normal">y</i> Tul</span>
          <span className="mt-1 text-[8px] uppercase tracking-[0.42em] opacity-70">Accesorios artesanales</span>
        </>
      )}
    </Link>
  );
}
