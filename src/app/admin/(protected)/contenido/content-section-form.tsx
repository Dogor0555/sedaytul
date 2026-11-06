"use client";

import { useActionState } from "react";
import { Eye, EyeOff, FileText, Save } from "lucide-react";
import { Panel, inputClass, labelClass, primaryButton } from "@/components/admin/admin-ui";
import { SingleImageUpload, type UploadedImage } from "@/components/admin/single-image-upload";
import { saveContentSection, type ContentActionState } from "./actions";

export type ContentSection = {
  key: "hero" | "accesorios" | "regalos" | "personalizados" | "corporativos" | "historia" | "tips" | "pagos" | "contacto";
  label: string;
  description: string;
  title: string;
  subtitle: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  backgroundColor: string;
  image: UploadedImage | null;
  visible: boolean;
  sortOrder: number;
};

const initialState: ContentActionState = { status: "idle" };

function ErrorMessage({ error }: { error?: string }) {
  return error ? <span className="mt-1.5 block text-xs text-red-700">{error}</span> : null;
}

function ColorField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const safeColor = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#FFFFFF";

  return (
    <div className="sm:col-span-2">
      <span className={labelClass}>Color de fondo de la sección</span>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="color"
          value={safeColor}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="size-11 cursor-pointer rounded-xl border border-[#ddd4cf] bg-white p-1"
          aria-label="Elegir color de fondo"
        />
        <input
          name="backgroundColor"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={7}
          placeholder="#FFFFFF"
          className={`${inputClass} max-w-36 uppercase`}
        />
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-xl border border-[#ddd4cf] px-3 py-2.5 text-xs font-semibold text-[#7a6d68] hover:bg-[#faf7f5]"
        >
          Color automático
        </button>
        <span className="text-[11px] text-[#978a85]">Elegí tonos claros para conservar la legibilidad.</span>
      </div>
      <ErrorMessage error={error} />
    </div>
  );
}

export function ContentSectionForm({ section, onChange }: { section: ContentSection; onChange: (values: Partial<ContentSection>) => void }) {
  const [state, formAction, pending] = useActionState(saveContentSection, initialState);

  return (
    <Panel className="overflow-hidden">
      <form action={formAction}>
        <input type="hidden" name="sectionKey" value={section.key} />
        <div className="flex items-start gap-3 border-b border-[#ece5e1] p-5 sm:items-center sm:px-6">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#f2e6e0] text-[#8e615c]"><FileText className="size-[18px]" /></span>
          <div className="min-w-0 flex-1"><h2 className="font-serif text-xl text-[#3e312f]">{section.label}</h2><p className="mt-1 text-xs leading-5 text-[#8d807c]">{section.description}</p></div>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <label><span className={labelClass}>Título</span><input name="title" maxLength={200} className={inputClass} value={section.title} onChange={(event) => onChange({ title: event.target.value })} /><ErrorMessage error={state.errors?.title} /></label>
          <label><span className={labelClass}>Subtítulo</span><input name="subtitle" maxLength={300} className={inputClass} value={section.subtitle} onChange={(event) => onChange({ subtitle: event.target.value })} /><ErrorMessage error={state.errors?.subtitle} /></label>
          <label className="sm:col-span-2"><span className={labelClass}>Contenido</span><textarea name="body" maxLength={5000} className={`${inputClass} min-h-32 py-3 leading-6`} value={section.body} onChange={(event) => onChange({ body: event.target.value })} /><ErrorMessage error={state.errors?.body} /></label>
          <label><span className={labelClass}>Texto del botón</span><input name="ctaLabel" maxLength={80} className={inputClass} value={section.ctaLabel} onChange={(event) => onChange({ ctaLabel: event.target.value })} placeholder="Ej. Explorar accesorios" /><ErrorMessage error={state.errors?.ctaLabel} /></label>
          <label><span className={labelClass}>Enlace del botón</span><input name="ctaUrl" maxLength={500} className={inputClass} value={section.ctaUrl} onChange={(event) => onChange({ ctaUrl: event.target.value })} placeholder="/productos o whatsapp" /><span className="mt-1.5 block text-[11px] text-[#978a85]">Usa <strong>whatsapp</strong> para abrir una conversación.</span><ErrorMessage error={state.errors?.ctaUrl} /></label>
          <ColorField value={section.backgroundColor} onChange={(backgroundColor) => onChange({ backgroundColor })} error={state.errors?.backgroundColor} />
          <div className="sm:col-span-2">
            <SingleImageUpload
              name="mediaId"
              label="Imagen de la sección (opcional)"
              current={section.image}
              onChange={(image) => onChange({ image })}
            />
          </div>
          <label><span className={labelClass}>Orden</span><input name="sortOrder" type="number" min={0} max={999} step={1} required className={inputClass} value={section.sortOrder} onChange={(event) => onChange({ sortOrder: event.target.valueAsNumber || 0 })} /><ErrorMessage error={state.errors?.sortOrder} /></label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 self-end rounded-xl border border-[#ddd4cf] px-3.5 text-sm font-semibold text-[#4d403d]">
            <input name="visible" type="checkbox" checked={section.visible} onChange={(event) => onChange({ visible: event.target.checked })} className="size-4 accent-[#956762]" />
            <span className="flex items-center gap-2">{section.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />} Visible en el sitio</span>
          </label>
        </div>
        <div className="flex flex-col gap-3 border-t border-[#ece5e1] bg-[#fcfaf8] p-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          {state.message && <p role="status" className={`flex-1 text-sm ${state.status === "error" ? "text-red-700" : "text-[#52664e]"}`}>{state.message}</p>}
          <button type="submit" disabled={pending} className={`${primaryButton} w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto`}><Save className="size-4" />{pending ? "Guardando..." : "Guardar sección"}</button>
        </div>
      </form>
    </Panel>
  );
}
