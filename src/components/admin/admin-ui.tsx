import type { ReactNode } from "react";
import { Info, Sparkles } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#9a6b68]">{eyebrow}</p>}
        <h1 className="font-serif text-3xl leading-tight text-[#302725] sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-[#746966]">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function DemoNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl border border-[#e7d8cf] bg-[#fffaf6] text-[#755c52] ${compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"}`}>
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p><strong className="font-semibold">Modo demostración.</strong> Los cambios y acciones de esta interfaz no se guardan todavía.</p>
    </div>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`rounded-[22px] border border-[#e9e3df] bg-white shadow-[0_1px_2px_rgba(50,39,37,0.03)] ${className}`}>{children}</section>;
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status === "Publicado" || status === "Activo"
    ? "bg-[#eaf2e8] text-[#52664e]"
    : status === "Por encargo"
      ? "bg-[#f4e7e5] text-[#965f5b]"
      : "bg-[#f3eee5] text-[#826b4c]";

  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}`}>{status}</span>;
}

export function ProductVisual({ color, accent, className = "" }: { color: string; accent: string; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-[#f4efeb] ${className}`}
      style={{ background: `linear-gradient(145deg, ${accent}, #fbf8f5 70%)` }}
      aria-hidden="true"
    >
      <div
        className="absolute left-1/2 top-1/2 h-[58%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-[5px] border-b-transparent shadow-[0_10px_24px_rgba(70,48,43,0.12)]"
        style={{ borderColor: color, borderBottomColor: "transparent" }}
      />
      <div className="absolute left-[28%] top-[42%] size-[12%] rounded-full border-2 border-white/70" style={{ backgroundColor: color }} />
      <div className="absolute left-[45%] top-[25%] size-[16%] rounded-full border-2 border-white/70" style={{ backgroundColor: color }} />
      <div className="absolute right-[22%] top-[46%] size-[10%] rounded-full border-2 border-white/70" style={{ backgroundColor: color }} />
    </div>
  );
}

export function EmptyUpload({ label = "Arrastra archivos aquí o explora tu equipo" }: { label?: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8cbc4] bg-[#fcfaf8] px-5 text-center">
      <span className="mb-3 grid size-10 place-items-center rounded-full bg-[#f2e5df] text-[#9a6b68]"><Sparkles className="size-4" /></span>
      <p className="text-sm font-medium text-[#4e403d]">{label}</p>
      <p className="mt-1 text-xs text-[#948783]">JPG, PNG o WebP, máximo 8 MB</p>
    </div>
  );
}

export const primaryButton = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#3f302e] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#59423f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a6b68]";
export const secondaryButton = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#ded5d0] bg-white px-4 py-2 text-sm font-semibold text-[#4e403d] transition hover:border-[#c6b6ae] hover:bg-[#fcfaf8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a6b68]";
export const inputClass = "min-h-11 w-full rounded-xl border border-[#ddd4cf] bg-white px-3.5 text-sm text-[#3f3532] outline-none placeholder:text-[#aaa09c] focus:border-[#9a6b68] focus:ring-2 focus:ring-[#ead8d3]";
export const labelClass = "mb-2 block text-sm font-semibold text-[#4d403d]";
