/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Flower2, Sparkles, Sprout } from "lucide-react";
import { Eyebrow } from "@/components/public/content";
import { PublicShell } from "@/components/public/site-chrome";
import {
  getPublicHomeContent,
  getPublicSettings,
} from "@/server/repositories/public-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conocé la esencia artesanal de Seda y Tul, un emprendimiento salvadoreño de accesorios para celebraciones.",
};

export default async function AboutPage() {
  const [settings, content] = await Promise.all([
    getPublicSettings(),
    getPublicHomeContent(),
  ]);
  const historia = content.find((section) => section.key === "historia");

  const values = [
    {
      icon: Flower2,
      title: "Hecho a mano",
      text: "Cada detalle se compone cuidadosamente para lograr piezas delicadas y bien terminadas.",
    },
    {
      icon: Sprout,
      title: "Sensibilidad",
      text: "Pensamos en la ocasión, el estilo y la persona que llevará cada accesorio.",
    },
    {
      icon: Sparkles,
      title: "Singularidad",
      text: "Buscamos que cada pieza aporte un gesto especial sin dejar de sentirse natural.",
    },
  ];

  return (
    <PublicShell>
      <section className="grid bg-[#E8D6CF] lg:grid-cols-2">
        <div className="flex items-center px-7 py-24 sm:px-16 lg:px-[12%]">
          <div>
            <Eyebrow>Nuestra esencia</Eyebrow>
            <h1 className="text-6xl leading-[1.02] sm:text-7xl">
              Crear un detalle.
              <br />
              <i className="font-normal">Guardar una memoria.</i>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-8 text-[#685B54]">
              {settings.businessDescription}
            </p>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=85"
          alt="Detalle de una pieza artesanal delicada"
          className="h-full min-h-[580px] w-full object-cover"
        />
      </section>

      <section className="mx-auto max-w-5xl px-5 py-24 text-center sm:px-8 lg:py-32">
        <Eyebrow>{historia?.eyebrow ?? "Nuestra historia"}</Eyebrow>
        <p className="text-3xl leading-relaxed sm:text-5xl sm:leading-snug">
          {historia?.body ??
            "“Creemos en los detalles que acompañan sin imponerse y convierten una celebración en un recuerdo muy propio.”"}
        </p>
        <span className="mt-8 block text-[10px] uppercase tracking-[0.3em] text-[#9B7654]">
          Esencia {settings.businessName}
        </span>
      </section>

      <section className="bg-[#423A36] px-5 py-24 text-[#F9F6F1] sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <Eyebrow light>Nuestra manera de crear</Eyebrow>
            <h2 className="text-5xl">Lo que nos guía</h2>
          </div>
          <div className="mt-16 grid gap-px bg-white/15 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <article key={title} className="bg-[#423A36] p-10">
                <Icon strokeWidth={1} className="text-[#C7AD8C]" />
                <h3 className="mt-8 text-2xl">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/60">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
