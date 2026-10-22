"use client";

/* eslint-disable @next/next/no-img-element */

import { ImagePlus, LoaderCircle, Save, Trash2, EyeOff } from "lucide-react";
import { FormEvent, startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { inputClass, labelClass, Panel, primaryButton, secondaryButton } from "@/components/admin/admin-ui";
import { createGalleryItems, deleteGalleryItem, hideGalleryItem, updateGalleryItem, type GalleryActionResult } from "./actions";

type Category = { id: string; name: string; active: boolean };
type GalleryItem = {
  id: string;
  title: string | null;
  visible: boolean;
  featured: boolean;
  sortOrder: number;
  media: { url: string; altText: string | null; width: number | null; height: number | null };
  categoryId: string | null;
};
type PendingMedia = { id: string; url: string; name: string; title: string; categoryId: string; featured: boolean };

export function GalleryManager({ items, categories, nextSortOrder }: { items: GalleryItem[]; categories: Category[]; nextSortOrder: number }) {
  const router = useRouter();
  const [pendingMedia, setPendingMedia] = useState<PendingMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<GalleryActionResult | null>(null);

  function finish(result: GalleryActionResult) {
    setNotice(result);
    setSaving(false);
    if (result.ok) router.refresh();
  }

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setNotice(null);
    setUploading(true);
    const body = new FormData();
    Array.from(files).forEach((file) => body.append("files", file));
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No fue posible subir las imágenes.");
      setPendingMedia((current) => [...current, ...result.media.map((media: { id: string; url: string; name: string }) => ({
        ...media,
        title: media.name.replace(/\.[^.]+$/, ""),
        categoryId: "",
        featured: false,
      }))]);
      setNotice({ ok: true, message: "Carga terminada. Revisa los datos y añade las imágenes a la galería." });
    } catch (error) {
      setNotice({ ok: false, message: error instanceof Error ? error.message : "No fue posible subir las imágenes." });
    } finally {
      setUploading(false);
    }
  }

  function associateUploaded() {
    if (!pendingMedia.length) return;
    setSaving(true);
    setNotice(null);
    startTransition(async () => {
      const result = await createGalleryItems(pendingMedia.map((media, index) => ({
        mediaId: media.id,
        title: media.title,
        categoryId: media.categoryId || null,
        visible: true,
        featured: media.featured,
        sortOrder: nextSortOrder + index,
      })));
      if (result.ok) setPendingMedia([]);
      finish(result);
    });
  }

  function submitEdit(event: FormEvent<HTMLFormElement>, item: GalleryItem) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaving(true);
    startTransition(async () => finish(await updateGalleryItem({
      id: item.id,
      title: String(data.get("title") ?? ""),
      categoryId: String(data.get("categoryId") ?? "") || null,
      visible: data.get("visible") === "on",
      featured: data.get("featured") === "on",
      sortOrder: Number(data.get("sortOrder")),
    })));
  }

  function runConfirmed(message: string, action: () => Promise<GalleryActionResult>) {
    if (!window.confirm(message)) return;
    setSaving(true);
    startTransition(async () => finish(await action()));
  }

  return <div className="space-y-6">
    <Panel className="p-5">
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8cbc4] bg-[#fcfaf8] px-5 text-center hover:bg-[#faf5f1]">
          {uploading ? <LoaderCircle className="mb-3 size-7 animate-spin text-[#9a6b68]" /> : <ImagePlus className="mb-3 size-7 text-[#9a6b68]" />}
          <span className="text-sm font-semibold text-[#4e403d]">{uploading ? "Optimizando imágenes..." : "Seleccionar imágenes"}</span>
          <span className="mt-1 text-xs leading-5 text-[#948783]">JPG, PNG o WebP, máximo 4 MB. Hasta 10 por carga.</span>
          <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading || saving} onChange={(event) => { upload(event.target.files); event.target.value = ""; }} />
        </label>
        <div>
          <h2 className="font-serif text-xl text-[#413432]">Imágenes recién subidas</h2>
          <p className="mt-1 text-xs text-[#887b77]">La carga crea el archivo; confirma aquí cuáles formarán parte de la galería.</p>
          {!pendingMedia.length && <p className="mt-6 rounded-xl bg-[#faf7f5] p-4 text-sm text-[#8e817d]">No hay imágenes pendientes de asociar.</p>}
          {pendingMedia.length > 0 && <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {pendingMedia.map((media, index) => <div key={media.id} className="grid grid-cols-[72px_1fr] gap-3 rounded-xl border border-[#e9e1dd] p-3">
              <img src={media.url} alt="" className="size-[72px] rounded-lg object-cover" />
              <div className="min-w-0 space-y-2">
                <input aria-label={`Título de ${media.name}`} className={inputClass} value={media.title} maxLength={160} onChange={(event) => setPendingMedia((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, title: event.target.value } : entry))} />
                <select aria-label={`Categoría de ${media.name}`} className={inputClass} value={media.categoryId} onChange={(event) => setPendingMedia((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, categoryId: event.target.value } : entry))}>
                  <option value="">Sin categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.active ? "" : " (inactiva)"}</option>)}
                </select>
                <div className="flex items-center justify-between gap-2 text-xs text-[#70635f]"><label className="flex items-center gap-2"><input type="checkbox" checked={media.featured} onChange={(event) => setPendingMedia((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, featured: event.target.checked } : entry))} />Destacada</label><button type="button" className="text-red-700 hover:underline" onClick={() => setPendingMedia((current) => current.filter(({ id }) => id !== media.id))}>Quitar</button></div>
              </div>
            </div>)}
          </div>}
          {pendingMedia.length > 0 && <button type="button" className={`${primaryButton} mt-4`} disabled={saving} onClick={associateUploaded}>{saving && <LoaderCircle className="size-4 animate-spin" />}Añadir {pendingMedia.length} a la galería</button>}
        </div>
      </div>
    </Panel>

    {notice && <p role="status" className={`rounded-xl border px-4 py-3 text-sm ${notice.ok ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>{notice.message}</p>}

    {!items.length ? <Panel className="p-10 text-center text-sm text-[#8e817d]">La galería todavía no tiene elementos.</Panel> : <div className="grid gap-5 lg:grid-cols-2">
      {items.map((item) => <Panel key={item.id} className="overflow-hidden">
        <div className="grid sm:grid-cols-[190px_1fr]">
          <div className="relative min-h-48 bg-[#f3ece8]"><img src={item.media.url} alt={item.media.altText ?? item.title ?? "Imagen de galería"} className="absolute inset-0 size-full object-cover" />{!item.visible && <span className="absolute left-3 top-3 rounded-full bg-[#3f302e]/90 px-2.5 py-1 text-[10px] font-bold text-white">Oculta</span>}</div>
          <form onSubmit={(event) => submitEdit(event, item)} className="space-y-3 p-4">
            <div><label className={labelClass}>Título</label><input name="title" defaultValue={item.title ?? ""} maxLength={160} className={inputClass} placeholder="Título opcional" /></div>
            <div className="grid grid-cols-[1fr_90px] gap-2"><div><label className={labelClass}>Categoría</label><select name="categoryId" defaultValue={item.categoryId ?? ""} className={inputClass}><option value="">Sin categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.active ? "" : " (inactiva)"}</option>)}</select></div><div><label className={labelClass}>Orden</label><input name="sortOrder" type="number" min={-100000} max={100000} defaultValue={item.sortOrder} className={inputClass} /></div></div>
            <div className="flex flex-wrap gap-4 text-sm text-[#5f514e]"><label className="flex items-center gap-2"><input name="visible" type="checkbox" defaultChecked={item.visible} />Visible</label><label className="flex items-center gap-2"><input name="featured" type="checkbox" defaultChecked={item.featured} />Destacada</label></div>
            <div className="flex flex-wrap gap-2 pt-1"><button disabled={saving} className={primaryButton}><Save className="size-4" />Guardar</button>{item.visible && <button type="button" disabled={saving} className={secondaryButton} onClick={() => runConfirmed("¿Ocultar esta imagen de la galería?", () => hideGalleryItem(item.id))}><EyeOff className="size-4" />Ocultar</button>}<button type="button" disabled={saving} className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-red-700 hover:bg-red-50" onClick={() => runConfirmed("¿Eliminar este elemento de la galería? El archivo original se conservará.", () => deleteGalleryItem(item.id))}><Trash2 className="size-4" />Eliminar</button></div>
          </form>
        </div>
      </Panel>)}
    </div>}
  </div>;
}
