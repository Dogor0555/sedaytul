"use client";

/* eslint-disable @next/next/no-img-element */

import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { useState } from "react";

export type UploadedImage = { id: string; url: string };

type SingleImageUploadProps = {
  name: string;
  label: string;
  current?: UploadedImage | null;
  onChange?: (image: UploadedImage | null) => void;
  allowRemove?: boolean;
};

export function SingleImageUpload({
  name,
  label,
  current,
  onChange,
  allowRemove = true,
}: SingleImageUploadProps) {
  const [image, setImage] = useState<UploadedImage | null>(current ?? null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function updateImage(nextImage: UploadedImage | null) {
    setImage(nextImage);
    onChange?.(nextImage);
  }

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    setUploading(true);
    const body = new FormData();
    body.append("files", files[0]);

    try {
      const response = await fetch("/api/admin/media", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No fue posible subir la imagen.");
      const media = result.media?.[0];
      if (!media) throw new Error("No fue posible subir la imagen.");
      updateImage({ id: media.id, url: media.url });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No fue posible subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={image?.id ?? ""} />
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f827d]">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-3">
        {image ? (
          <div className="relative overflow-hidden rounded-xl border border-[#e5dbd6] bg-[#f1e8e3]">
            <img src={image.url} alt={label} className="h-32 w-40 object-cover" />
            {allowRemove ? (
              <button
                type="button"
                onClick={() => updateImage(null)}
                className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-white/90 text-[#7c5a55] shadow-sm"
                aria-label={`Quitar ${label.toLowerCase()}`}
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
        ) : null}
        <label className="flex min-h-32 min-w-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#d8cbc4] bg-[#fcfaf8] px-5 text-center hover:bg-[#faf5f1]">
          {uploading ? <LoaderCircle className="mb-2 size-5 animate-spin text-[#9a6b68]" /> : <ImagePlus className="mb-2 size-5 text-[#9a6b68]" />}
          <span className="text-xs font-medium text-[#4e403d]">
            {uploading ? "Optimizando..." : image ? "Cambiar imagen" : "Subir imagen"}
          </span>
          <span className="mt-1 text-[10px] text-[#948783]">JPG, PNG o WebP · 4 MB</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => upload(event.target.files)}
          />
        </label>
      </div>
      {error ? <p role="alert" className="mt-2 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
