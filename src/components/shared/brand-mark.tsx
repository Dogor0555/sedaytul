import Link from "next/link";

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex flex-col items-center leading-none ${light ? "text-[#F9F6F1]" : "text-[#423A36]"}`} aria-label="Seda y Tul, inicio">
      <span className="text-2xl tracking-[0.08em]">Seda <i className="font-normal">y</i> Tul</span>
      <span className="mt-1 text-[8px] uppercase tracking-[0.42em] opacity-70">Accesorios artesanales</span>
    </Link>
  );
}
