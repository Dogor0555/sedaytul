"use client";

import { ExternalLink, Eye, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type LivePreviewSection = {
  key: "hero" | "artesanal" | "historia" | "contacto";
  title: string;
  subtitle: string;
  body: string;
  visible: boolean;
  sortOrder: number;
};

function PreviewFrame({ sections }: { sections: LivePreviewSection[] }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    frameRef.current?.contentWindow?.postMessage(
      { type: "sedaytul:content-preview", sections },
      window.location.origin,
    );
  }, [loaded, sections]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[#ded5d0] bg-white shadow-[0_18px_45px_rgba(57,41,37,0.12)]">
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-[#e8e1dd] bg-[#faf8f6] px-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#d5a09a]" />
          <span className="size-2.5 rounded-full bg-[#d9c79d]" />
          <span className="size-2.5 rounded-full bg-[#aebfa9]" />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border border-[#e4dcd7] bg-white px-3 py-1.5 text-[10px] font-medium text-[#857873]">
          <Eye className="size-3 text-[#9a6b68]" />
          <span className="truncate">Vista previa del inicio</span>
        </div>
        <Link href="/" target="_blank" title="Abrir sitio" className="text-[#756762] hover:text-[#3f302e]">
          <ExternalLink className="size-4" />
        </Link>
      </div>
      <div className="relative min-h-0 flex-1 bg-[#eee9e5]">
        {!loaded ? <div className="absolute inset-0 grid place-items-center text-xs text-[#8d807c]">Cargando vista previa...</div> : null}
        <iframe
          ref={frameRef}
          src="/"
          title="Vista previa en vivo del sitio"
          onLoad={() => {
            setLoaded(true);
            frameRef.current?.contentWindow?.postMessage(
              { type: "sedaytul:content-preview", sections },
              window.location.origin,
            );
          }}
          className={`h-full w-full bg-[#F9F6F1] transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  );
}

export function LiveSitePreview({ sections }: { sections: LivePreviewSection[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] xl:block">
        <PreviewFrame sections={sections} />
      </aside>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-24 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#423A36] px-5 py-3 text-xs font-semibold text-white shadow-xl xl:hidden"
      >
        <Eye className="size-4" /> Vista previa en vivo
      </button>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[70] flex flex-col bg-[#f8f6f3] p-3 sm:p-5 xl:hidden">
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a6b68]">En tiempo real</p>
              <p className="font-serif text-xl text-[#3e312f]">Vista previa</p>
            </div>
            <button type="button" onClick={() => setMobileOpen(false)} className="grid size-10 place-items-center rounded-xl border border-[#ded5d0] bg-white" aria-label="Cerrar vista previa">
              <X className="size-5" />
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <PreviewFrame sections={sections} />
          </div>
        </div>
      ) : null}
    </>
  );
}
