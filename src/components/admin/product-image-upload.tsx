"use client";

/* eslint-disable @next/next/no-img-element */

import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { useState } from "react";

type UploadedMedia = { id: string; url: string; name: string };

export function ProductImageUpload() {
  const [items, setItems] = useState<UploadedMedia[]>([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    setUploading(true);
    const body = new FormData();
    Array.from(files).forEach((file) => body.append("files", file));

    try {
      const response = await fetch("/api/admin/media", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No fue posible subir las imágenes.");
      setItems((current) => [...current, ...result.media]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No fue posible subir las imágenes.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {items.map((item) => <input key={item.id} type="hidden" name="mediaIds" value={item.id} />)}
      <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8cbc4] bg-[#fcfaf8] px-5 text-center hover:bg-[#faf5f1]">
        {uploading ? <LoaderCircle className="mb-3 size-6 animate-spin text-[#9a6b68]" /> : <ImagePlus className="mb-3 size-6 text-[#9a6b68]" />}
        <span className="text-sm font-medium text-[#4e403d]">{uploading ? "Optimizando imágenes..." : "Seleccionar fotografías"}</span>
        <span className="mt-1 text-xs text-[#948783]">JPG, PNG o WebP, máximo 4 MB. Hasta 10 por carga.</span>
        <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(event) => upload(event.target.files)} />
      </label>
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      {items.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{items.map((item, index) => <div key={item.id} className="relative overflow-hidden rounded-xl bg-[#f1e8e3]"><img src={item.url} alt={item.name} className="aspect-square w-full object-cover" /><span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold">{index === 0 ? "Principal" : index + 1}</span><button type="button" onClick={() => setItems((current) => current.filter(({ id }) => id !== item.id))} className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-white/90" aria-label={`Quitar ${item.name}`}><X className="size-3.5" /></button></div>)}</div>}
    </div>
  );
}
