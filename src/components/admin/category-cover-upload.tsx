"use client";

/* eslint-disable @next/next/no-img-element */

import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { useState } from "react";

type Cover = { id: string; url: string };

export function CategoryCoverUpload({ current }: { current?: Cover | null }) {
  const [cover, setCover] = useState<Cover | null>(current ?? null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    setUploading(true);
    const body = new FormData();
    body.append("files", files[0]);

    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "No fue posible subir la imagen.");
      }
      const media = result.media?.[0];
      if (!media) throw new Error("No fue posible subir la imagen.");
      setCover({ id: media.id, url: media.url });
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "No fue posible subir la imagen.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="hidden" name="coverImageId" value={cover?.id ?? ""} />
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f827d]">
        Imagen de portada
      </span>
      <div className="flex flex-wrap items-center gap-3">
        {cover ? (
          <div className="relative overflow-hidden rounded-xl border border-[#e5dbd6]">
            <img
              src={cover.url}
              alt="Portada de la categoría"
              className="size-24 object-cover"
            />
            <button
              type="button"
              onClick={() => setCover(null)}
              className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-white/90 text-[#7c5a55]"
              aria-label="Quitar portada"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : null}
        <label className="flex min-h-24 min-w-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#d8cbc4] bg-[#fcfaf8] px-5 text-center hover:bg-[#faf5f1]">
          {uploading ? (
            <LoaderCircle className="mb-2 size-5 animate-spin text-[#9a6b68]" />
          ) : (
            <ImagePlus className="mb-2 size-5 text-[#9a6b68]" />
          )}
          <span className="text-xs font-medium text-[#4e403d]">
            {uploading ? "Optimizando..." : cover ? "Cambiar imagen" : "Subir portada"}
          </span>
          <span className="mt-1 text-[10px] text-[#948783]">
            JPG, PNG o WebP · 4 MB
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => upload(event.target.files)}
          />
        </label>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
