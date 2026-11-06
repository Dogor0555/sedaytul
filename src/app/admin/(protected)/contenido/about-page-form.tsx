"use client";

import { useActionState } from "react";
import { BookOpen, Save } from "lucide-react";
import { Panel, inputClass, labelClass, primaryButton } from "@/components/admin/admin-ui";
import { SingleImageUpload, type UploadedImage } from "@/components/admin/single-image-upload";
import { saveAboutPageContent, type AboutActionState } from "./about-actions";

type AboutFormValues = {
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  heroImage: UploadedImage | null;
  storyEyebrow: string;
  storyBody: string;
  valuesTitle: string;
  values: { title: string; text: string }[];
};

const initialState: AboutActionState = { status: "idle" };

function ErrorMessage({ error }: { error?: string }) {
  return error ? <span className="mt-1.5 block text-xs text-red-700">{error}</span> : null;
}

export function AboutPageForm({ content }: { content: AboutFormValues }) {
  const [state, formAction, pending] = useActionState(saveAboutPageContent, initialState);
  const value = (index: number) => content.values[index] ?? { title: "", text: "" };

  return (
    <Panel className="overflow-hidden">
      <form action={formAction}>
        <div className="flex items-start gap-3 border-b border-[#ece5e1] p-5 sm:items-center sm:px-6">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#f2e6e0] text-[#8e615c]"><BookOpen className="size-[18px]" /></span>
          <div>
            <h2 className="font-serif text-xl text-[#3e312f]">Página Conócenos</h2>
            <p className="mt-1 text-xs leading-5 text-[#8d807c]">Edita los textos, la imagen principal y los valores que aparecen en /nosotros.</p>
          </div>
        </div>

        <div className="space-y-8 p-5 sm:p-6">
          <section className="space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a6b68]">Portada</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <label><span className={labelClass}>Antetítulo</span><input name="heroEyebrow" maxLength={120} required className={inputClass} defaultValue={content.heroEyebrow} /><ErrorMessage error={state.errors?.heroEyebrow} /></label>
              <label><span className={labelClass}>Título</span><textarea name="heroTitle" maxLength={200} required className={`${inputClass} min-h-20 py-3`} defaultValue={content.heroTitle} /><ErrorMessage error={state.errors?.heroTitle} /></label>
              <label className="sm:col-span-2"><span className={labelClass}>Texto de presentación</span><textarea name="heroBody" maxLength={2000} required className={`${inputClass} min-h-24 py-3 leading-6`} defaultValue={content.heroBody} /><ErrorMessage error={state.errors?.heroBody} /></label>
              <div className="sm:col-span-2">
                <SingleImageUpload name="heroImageId" label="Imagen principal" current={content.heroImage} />
                <ErrorMessage error={state.errors?.heroImageId} />
              </div>
            </div>
          </section>

          <section className="space-y-5 border-t border-[#ece5e1] pt-7">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a6b68]">Nuestra historia</h3>
            <div className="grid gap-5">
              <label><span className={labelClass}>Antetítulo</span><input name="storyEyebrow" maxLength={120} required className={inputClass} defaultValue={content.storyEyebrow} /><ErrorMessage error={state.errors?.storyEyebrow} /></label>
              <label><span className={labelClass}>Texto</span><textarea name="storyBody" maxLength={2000} required className={`${inputClass} min-h-28 py-3 leading-6`} defaultValue={content.storyBody} /><ErrorMessage error={state.errors?.storyBody} /></label>
            </div>
          </section>

          <section className="space-y-5 border-t border-[#ece5e1] pt-7">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a6b68]">Valores</h3>
            <label><span className={labelClass}>Título de la sección</span><input name="valuesTitle" maxLength={200} required className={inputClass} defaultValue={content.valuesTitle} /><ErrorMessage error={state.errors?.valuesTitle} /></label>
            <div className="grid gap-5 md:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-4 rounded-xl border border-[#ece5e1] bg-[#fcfaf8] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9a6b68]">Valor {index + 1}</p>
                  <label><span className={labelClass}>Nombre</span><input name={`value${index + 1}Title`} maxLength={80} required className={inputClass} defaultValue={value(index).title} /><ErrorMessage error={state.errors?.[`value${index + 1}Title`]} /></label>
                  <label><span className={labelClass}>Descripción</span><textarea name={`value${index + 1}Text`} maxLength={500} required className={`${inputClass} min-h-24 py-3`} defaultValue={value(index).text} /><ErrorMessage error={state.errors?.[`value${index + 1}Text`]} /></label>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#ece5e1] bg-[#fcfaf8] p-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          {state.message ? <p role="status" className={`flex-1 text-sm ${state.status === "error" ? "text-red-700" : "text-[#52664e]"}`}>{state.message}</p> : null}
          <button type="submit" disabled={pending} className={`${primaryButton} w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto`}><Save className="size-4" />{pending ? "Guardando..." : "Guardar página Conócenos"}</button>
        </div>
      </form>
    </Panel>
  );
}
