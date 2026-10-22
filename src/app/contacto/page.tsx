import type { Metadata } from "next";
import {
  CalendarDays,
  Camera,
  MapPin,
  MessageCircle,
  PackageCheck,
  UsersRound,
} from "lucide-react";
import { Eyebrow } from "@/components/public/content";
import { PublicShell } from "@/components/public/site-chrome";
import {
  buildWhatsAppUrl,
  getPublicSettings,
} from "@/server/repositories/public-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Consultá por accesorios artesanales Seda y Tul en El Salvador.",
};

export default async function ContactPage() {
  const settings = await getPublicSettings();
  const whatsapp = buildWhatsAppUrl(
    settings.whatsappNumber,
    "Hola Seda y Tul, mi celebración es el... y quisiera consultar por un accesorio de...",
  );
  const notes = [
    {
      icon: CalendarDays,
      title: "Contanos la fecha",
      text: "Así podemos orientarte sobre disponibilidad y tiempos.",
    },
    {
      icon: PackageCheck,
      title: "Consultá la entrega",
      text: "Las opciones y condiciones se confirman directamente por mensaje.",
    },
    {
      icon: MapPin,
      title: settings.address,
      text: `Horario de atención: ${settings.businessHours}`,
    },
  ];

  return (
    <PublicShell>
      <section className="mx-auto grid min-h-[70vh] max-w-[1400px] items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:px-12 lg:py-28">
        <div>
          <Eyebrow>Hablemos</Eyebrow>
          <h1 className="max-w-3xl text-6xl leading-[0.98] sm:text-8xl">
            Encontremos el detalle para{" "}
            <i className="font-normal">tu ocasión</i>
          </h1>
          <p className="mt-8 max-w-xl whitespace-pre-line text-base leading-8 text-[#685B54]">
            {settings.businessDescription}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#857268]">
            Escribinos con la fecha, el tipo de celebración y el accesorio que
            tenés en mente. Te responderemos con las opciones disponibles.
          </p>
          <div id="redes" className="mt-9 flex flex-wrap gap-3">
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[#423A36] px-7 py-4 text-[10px] uppercase tracking-[0.18em] text-white"
            >
              <MessageCircle size={16} /> Consultar por WhatsApp
            </a>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#C7AD8C] px-5 py-4 text-xs font-semibold"
            >
              <Camera size={16} /> Instagram
            </a>
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#C7AD8C] px-5 py-4 text-xs font-semibold"
            >
              <UsersRound size={16} /> Facebook
            </a>
          </div>
        </div>
        <aside className="border border-[#C7AD8C]/60 bg-[#E8D6CF]/45 p-8 sm:p-12">
          <p className="text-3xl">Antes de escribirnos</p>
          <div className="mt-8 divide-y divide-[#C7AD8C]/50">
            {notes.map(({ icon: Icon, title, text }) => (
              <div key={`${title}-${text}`} className="flex gap-5 py-6 first:pt-0 last:pb-0">
                <Icon
                  size={19}
                  strokeWidth={1.4}
                  className="mt-1 shrink-0 text-[#9B7654]"
                />
                <div>
                  <p className="text-[9px] uppercase tracking-[0.28em] text-[#857268]">
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-6">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-9 border-t border-[#C7AD8C]/50 pt-7 text-xs leading-6 text-[#685B54]">
            Los canales oficiales son los que aparecen en esta página. La
            disponibilidad y la entrega se confirman por mensaje antes de
            preparar cada pieza.
          </p>
        </aside>
      </section>
    </PublicShell>
  );
}
