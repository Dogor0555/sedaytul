/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Flower2, Sparkles, Sprout } from "lucide-react";
import { Eyebrow } from "@/components/public/content";
import { PublicShell } from "@/components/public/site-chrome";
import {
  getPublicAboutContent,
  getPublicSettings,
} from "@/server/repositories/public-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Conócenos",
  description: "Conocé la esencia artesanal de Seda y Tul, un emprendimiento salvadoreño de accesorios y regalos para celebraciones.",
};

export default async function AboutPage() {
  const [settings, about] = await Promise.all([
    getPublicSettings(),
    getPublicAboutContent(),
  ]);
  const valueIcons = [Flower2, Sprout, Sparkles];

  return (
    <PublicShell>
      <section className="grid border-b border-[#EDE8E2] bg-white lg:grid-cols-2">
        <div className="flex items-center px-7 py-24 sm:px-16 lg:px-[12%]">
          <div>
            <Eyebrow>{about.hero.eyebrow}</Eyebrow>
            <h1 className="text-6xl leading-[1.02] sm:text-7xl">
              {about.hero.title.split("\n").map((line, index) => (
                <span key={`${line}-${index}`} className={`block ${index > 0 ? "font-normal italic" : ""}`}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-8 max-w-lg text-base leading-8 text-[#685B54]">
              {about.hero.body}
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.26em] text-[#9B7654]">
              {settings.tagline}
            </p>
          </div>
        </div>
        <img
          src={about.hero.image ?? "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=85"}
          alt="Detalle de una pieza artesanal delicada"
          className="h-full min-h-[580px] w-full object-cover"
        />
      </section>

      <section className="mx-auto max-w-5xl px-5 py-24 text-center sm:px-8 lg:py-32">
        <Eyebrow>{about.story.eyebrow}</Eyebrow>
        <p className="text-3xl leading-relaxed sm:text-5xl sm:leading-snug">
          {about.story.body}
        </p>
        <span className="mt-8 block text-[10px] uppercase tracking-[0.3em] text-[#9B7654]">
          Esencia {settings.businessName}
        </span>
      </section>

      <section id="valores" className="bg-[#423A36] px-5 py-24 text-[#F9F6F1] sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <Eyebrow light>Nuestra manera de crear</Eyebrow>
            <h2 className="text-5xl">{about.values.title}</h2>
          </div>
          <div className="mt-16 grid gap-px bg-white/15 md:grid-cols-3">
            {about.values.items.map(({ title, text }, index) => {
              const Icon = valueIcons[index % valueIcons.length];
              return (
              <article key={`${title}-${index}`} className="bg-[#423A36] p-10">
                <Icon strokeWidth={1} className="text-[#C7AD8C]" />
                <h3 className="mt-8 text-2xl">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/60">{text}</p>
              </article>
              );
            })}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
