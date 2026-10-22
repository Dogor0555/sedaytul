"use client";

import { useActionState } from "react";
import { AtSign, MapPin, Save, Search, Store } from "lucide-react";
import { Panel, inputClass, labelClass, primaryButton } from "@/components/admin/admin-ui";
import { saveSettings, type SettingsActionState } from "./actions";

type Settings = {
  businessName: string;
  whatsappNumber: string;
  facebookUrl: string;
  instagramUrl: string;
  address: string;
  businessHours: string;
  businessDescription: string;
  footerText: string;
  seoTitle: string;
  seoDescription: string;
};

const initialState: SettingsActionState = { status: "idle" };

function ErrorMessage({ error }: { error?: string }) {
  return error ? <span className="mt-1.5 block text-xs text-red-700">{error}</span> : null;
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState(saveSettings, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <Panel className="p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#f1e5df] text-[#89605b]"><Store className="size-[18px]" /></span>
          <div><h2 className="font-serif text-xl text-[#3e312f]">Información de la marca</h2><p className="text-xs text-[#8e817d]">Datos visibles en el sitio y el pie de página.</p></div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label><span className={labelClass}>Nombre comercial</span><input name="businessName" required maxLength={120} className={inputClass} defaultValue={settings.businessName} /><ErrorMessage error={state.errors?.businessName} /></label>
          <label><span className={labelClass}>WhatsApp internacional</span><input name="whatsappNumber" inputMode="numeric" autoComplete="tel" maxLength={15} placeholder="50370000000" className={inputClass} defaultValue={settings.whatsappNumber} /><span className="mt-1.5 block text-[11px] text-[#978a85]">Código de país y número, solo dígitos.</span><ErrorMessage error={state.errors?.whatsappNumber} /></label>
          <label className="sm:col-span-2"><span className={labelClass}>Descripción del negocio</span><textarea name="businessDescription" maxLength={1000} className={`${inputClass} min-h-28 py-3`} defaultValue={settings.businessDescription} /><ErrorMessage error={state.errors?.businessDescription} /></label>
          <label><span className={labelClass}>Dirección</span><span className="relative block"><MapPin className="absolute left-3.5 top-3.5 size-4 text-[#9b8d88]" /><textarea name="address" maxLength={300} className={`${inputClass} min-h-24 py-3 pl-10`} defaultValue={settings.address} /></span><ErrorMessage error={state.errors?.address} /></label>
          <label><span className={labelClass}>Horario de atención</span><textarea name="businessHours" maxLength={300} className={`${inputClass} min-h-24 py-3`} placeholder="Lunes a viernes, 9:00 a 17:00" defaultValue={settings.businessHours} /><ErrorMessage error={state.errors?.businessHours} /></label>
          <label className="sm:col-span-2"><span className={labelClass}>Texto del pie de página</span><input name="footerText" maxLength={300} className={inputClass} defaultValue={settings.footerText} /><ErrorMessage error={state.errors?.footerText} /></label>
        </div>
      </Panel>

      <Panel className="p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#eee9df] text-[#76674c]"><AtSign className="size-[18px]" /></span><div><h2 className="font-serif text-xl text-[#3e312f]">Redes sociales</h2><p className="text-xs text-[#8e817d]">Deja vacío cualquier canal que no utilices.</p></div></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label><span className={labelClass}>URL de Facebook</span><input name="facebookUrl" type="url" placeholder="https://facebook.com/..." className={inputClass} defaultValue={settings.facebookUrl} /><ErrorMessage error={state.errors?.facebookUrl} /></label>
          <label><span className={labelClass}>URL de Instagram</span><input name="instagramUrl" type="url" placeholder="https://instagram.com/..." className={inputClass} defaultValue={settings.instagramUrl} /><ErrorMessage error={state.errors?.instagramUrl} /></label>
        </div>
      </Panel>

      <Panel className="p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e8eee7] text-[#586a55]"><Search className="size-[18px]" /></span><div><h2 className="font-serif text-xl text-[#3e312f]">Posicionamiento</h2><p className="text-xs text-[#8e817d]">Título y descripción para buscadores.</p></div></div>
        <div className="grid gap-5">
          <label><span className={labelClass}>Título SEO</span><input name="seoTitle" maxLength={120} className={inputClass} defaultValue={settings.seoTitle} /><ErrorMessage error={state.errors?.seoTitle} /></label>
          <label><span className={labelClass}>Descripción SEO</span><textarea name="seoDescription" maxLength={300} className={`${inputClass} min-h-24 py-3`} defaultValue={settings.seoDescription} /><ErrorMessage error={state.errors?.seoDescription} /></label>
        </div>
      </Panel>

      <div className="sticky bottom-3 z-10 flex flex-col-reverse items-stretch gap-3 rounded-2xl border border-[#e4dcd7] bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-end">
        {state.message && <p role="status" className={`flex-1 text-sm ${state.status === "error" ? "text-red-700" : "text-[#52664e]"}`}>{state.message}</p>}
        <button type="submit" disabled={pending} className={`${primaryButton} disabled:cursor-wait disabled:opacity-60`}><Save className="size-4" />{pending ? "Guardando..." : "Guardar configuración"}</button>
      </div>
    </form>
  );
}
