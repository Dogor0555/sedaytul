import type { Metadata } from "next";
import { Lightbulb, MessageCircle } from "lucide-react";
import { Eyebrow, PageIntro } from "@/components/public/content";
import { PublicShell } from "@/components/public/site-chrome";
import { buildWhatsAppUrl, getPublicHomeContent, getPublicSettings } from "@/server/repositories/public-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tips y cuidados | Seda y Tul",
  description: "Ideas para elegir regalos, combinar accesorios y cuidar tus piezas artesanales.",
};

export default async function TipsPage() {
  const [content, settings] = await Promise.all([getPublicHomeContent(), getPublicSettings()]);
  const tips = content.find((section) => section.key === "tips");
  const lines = tips?.body.split("\n").map((line) => line.trim()).filter(Boolean) ?? [];

  return (
    <PublicShell>
      <PageIntro
        eyebrow={tips?.eyebrow ?? "Tips Seda y Tul"}
        title={tips?.title.replace(/\n/g, " ") ?? "Ideas y cuidados para tus detalles"}
        text="Pequeños consejos para elegir, regalar y conservar tus accesorios y regalos artesanales."
      />
      <section className="mx-auto max-w-[1200px] px-5 pb-28 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {lines.map((tip, index) => (
            <article key={tip} className="border border-[#E2DCD4] bg-white p-7 sm:p-9">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-full bg-[#F5F2EC] text-[#9B7654]"><Lightbulb size={19} strokeWidth={1.5} /></span>
                <span className="text-3xl italic text-[#C7AD8C]">0{index + 1}</span>
              </div>
              <h2 className="mt-6 text-2xl">{tip}</h2>
              <p className="mt-3 text-sm leading-7 text-[#685B54]">
                {index === 0
                  ? "Pensá en la ocasión, el estilo de la persona y el mensaje que querés transmitir."
                  : index === 1
                    ? "Guardá tus piezas en un lugar seco, lejos del sol directo y manipulá los detalles con cuidado."
                    : index === 2
                      ? "Combiná tonos y texturas sin perder la armonía; menos es más cuando se trata de un detalle especial."
                      : "Para regalos corporativos, coordiná nombres, cantidades y fecha de entrega con anticipación."}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Eyebrow>¿Tenés otra duda?</Eyebrow>
          <a href={buildWhatsAppUrl(settings.whatsappNumber, "Hola Seda y Tul, quisiera recibir un consejo para elegir un accesorio o regalo.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-[#423A36] px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-white hover:bg-[#655C57]">
            <MessageCircle size={16} /> Escribinos por WhatsApp
          </a>
        </div>
      </section>
    </PublicShell>
  );
}
