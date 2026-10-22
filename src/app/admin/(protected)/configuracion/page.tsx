import { AtSign, Bell, Globe2, Mail, MapPin, Save, Store } from "lucide-react";
import { DemoNotice, PageHeader, Panel, inputClass, labelClass, primaryButton } from "@/components/admin/admin-ui";

export default function SettingsPage() {
  return <div className="space-y-7">
    <PageHeader eyebrow="Preferencias" title="Configuración" description="Información general de la marca, canales de contacto y preferencias del panel." actions={<button className={primaryButton}><Save className="size-4" />Guardar cambios demo</button>} />
    <DemoNotice />
    <form className="grid items-start gap-5 xl:grid-cols-[220px_1fr]">
      <Panel className="p-2 xl:sticky xl:top-24">
        {[
          { label: "Información", icon: Store, active: true },
          { label: "Contacto", icon: Mail, active: false },
          { label: "Redes sociales", icon: AtSign, active: false },
          { label: "Notificaciones", icon: Bell, active: false },
        ].map(({ label, icon: Icon, active }) => <button type="button" key={label} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${active ? "bg-[#f1e5df] text-[#75514d]" : "text-[#7f716d] hover:bg-[#faf7f5]"}`}><Icon className="size-4" />{label}</button>)}
      </Panel>
      <div className="space-y-5">
        <Panel className="p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#f1e5df] text-[#89605b]"><Store className="size-[18px]" /></span><div><h2 className="font-serif text-xl text-[#3e312f]">Información de la marca</h2><p className="text-xs text-[#8e817d]">Datos generales visibles para el equipo.</p></div></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label><span className={labelClass}>Nombre comercial</span><input className={inputClass} defaultValue="Seda y Tul" /></label>
            <label><span className={labelClass}>Correo de contacto</span><input type="email" className={inputClass} defaultValue="hola@sedaytul.com" /></label>
            <label className="sm:col-span-2"><span className={labelClass}>Descripción breve</span><textarea className={`${inputClass} min-h-24 py-3`} defaultValue="Accesorios artesanales para novias, bautizos, primeras comuniones y ocasiones especiales, elaborados con dedicación en El Salvador." /></label>
          </div>
        </Panel>
        <Panel className="p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#eee9df] text-[#76674c]"><Globe2 className="size-[18px]" /></span><div><h2 className="font-serif text-xl text-[#3e312f]">Región y formato</h2><p className="text-xs text-[#8e817d]">Preferencias para precios y fechas.</p></div></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label><span className={labelClass}>País o región</span><select className={`${inputClass} appearance-none`} defaultValue="El Salvador"><option>El Salvador</option></select></label>
            <label><span className={labelClass}>Moneda</span><select className={`${inputClass} appearance-none`} defaultValue="USD"><option>USD · Dólar estadounidense</option></select></label>
            <label className="sm:col-span-2"><span className={labelClass}>Ubicación</span><span className="relative block"><MapPin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9b8d88]" /><input className={`${inputClass} pl-10`} defaultValue="El Salvador" /></span><span className="mt-1.5 block text-[11px] text-[#978a85]">Ubicación general; no se muestra una dirección exacta.</span></label>
          </div>
        </Panel>
        <Panel className="p-5 sm:p-7"><h2 className="font-serif text-xl text-[#3e312f]">Preferencias</h2><div className="mt-5 divide-y divide-[#eee8e4]">
          {[{ title: "Avisos de disponibilidad", text: "Recibir una alerta cuando una pieza deba elaborarse por encargo." }, { title: "Resumen semanal", text: "Actividad reciente del catálogo cada lunes." }].map((item, index) => <label key={item.title} className="flex cursor-pointer items-center gap-4 py-4 first:pt-0 last:pb-0"><span className="min-w-0 flex-1"><strong className="block text-sm text-[#4c3e3b]">{item.title}</strong><span className="mt-1 block text-xs text-[#8e817d]">{item.text}</span></span><input type="checkbox" defaultChecked={index === 0} className="size-4 accent-[#956762]" /></label>)}
        </div></Panel>
      </div>
    </form>
  </div>;
}
