/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

type BrandMarkProps = {
  light?: boolean;
  logoUrl?: string | null;
  businessName?: string;
};

export function BrandMark({ light = false, logoUrl, businessName = "Seda y Tul" }: BrandMarkProps) {
  const markStyle = light
    ? "border-white/25 bg-white/10 text-[#F9F6F1]"
    : "border-[#DED5D0] bg-[#FAF9F6] text-[#423A36]";

  return (
    <Link href="/" className={`group inline-flex flex-col items-center leading-none ${light ? "text-[#F9F6F1]" : "text-[#423A36]"}`} aria-label={`${businessName}, inicio`}>
      <span className={`grid size-10 place-items-center overflow-hidden rounded-full border sm:size-11 ${markStyle}`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={businessName}
            className="h-full w-full rounded-full object-contain p-1"
        />
      ) : (
          <span className="font-serif text-[11px] font-semibold tracking-[-0.08em]">S&amp;T</span>
      )}
      </span>
      <span className="mt-1 text-base tracking-[0.06em] sm:text-lg">{businessName}</span>
      <span className="mt-0.5 text-[6px] uppercase tracking-[0.32em] opacity-70 sm:text-[7px]">Accesorios artesanales</span>
    </Link>
  );
}
