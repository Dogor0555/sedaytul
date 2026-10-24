/* eslint-disable @next/next/no-img-element */
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Eyebrow, ProductCard } from "@/components/public/content";
import { LivePreviewBridge } from "@/components/public/live-preview-bridge";
import { PublicShell } from "@/components/public/site-chrome";
import { processSteps } from "@/config/demo-content";
import { getPublicProducts } from "@/server/repositories/public-catalog";
import {
  buildWhatsAppUrl,
  getPublicGallery,
  getPublicHomeContent,
  getPublicSettings,
  type HomeSection,
} from "@/server/repositories/public-settings";

export const dynamic = "force-dynamic";

function SectionTitle({
  title,
  className = "",
  indentSecondLine = false,
  preview = false,
}: {
  title: string;
  className?: string;
  indentSecondLine?: boolean;
  preview?: boolean;
}) {
  return (
    <span className={className} data-preview-field={preview ? "title" : undefined} data-preview-indent={indentSecondLine ? "true" : undefined}>
      {title.split("\n").map((line, index) => (
        <span
          key={`${line}-${index}`}
          className={`block ${index > 0 ? "font-normal italic" : ""} ${
            indentSecondLine && index === 1 ? "ml-[9%]" : ""
          }`}
        >
          {line}
        </span>
      ))}
    </span>
  );
}

function ArtesanalSection({ section }: { section: HomeSection }) {
  return (
    <section data-preview-section="artesanal" hidden={!section.visible} className="grid bg-[#423A36] text-[#F9F6F1] lg:grid-cols-2">
      <div className="min-h-[560px] overflow-hidden">
        {section.image ? <img
          src={section.image}
          alt="Detalle de una pieza artesanal con pequeños cristales"
          data-preview-field="image"
          className="h-full w-full object-cover opacity-90"
        /> : null}
      </div>
      <div className="flex items-center px-7 py-20 sm:px-16 lg:px-[12%]">
        <div>
          <Eyebrow light previewField="subtitle">{section.eyebrow}</Eyebrow>
          <Sparkles className="mb-7 text-[#C7AD8C]" strokeWidth={1} />
          <h2 className="text-5xl leading-tight sm:text-6xl">
            <SectionTitle title={section.title} preview />
          </h2>
          <p data-preview-field="body" className="mt-7 max-w-lg whitespace-pre-line text-sm leading-8 text-white/65">
            {section.body}
          </p>
          <Link
            href="/nosotros"
            className="mt-9 inline-flex items-center gap-3 border-b border-[#C7AD8C] pb-2 text-[10px] uppercase tracking-[0.25em]"
          >
            Nuestra historia <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function HistoriaSection({ section }: { section: HomeSection }) {
  return (
    <section data-preview-section="historia" hidden={!section.visible} className="mx-auto max-w-5xl px-5 py-24 text-center sm:px-8 lg:py-32">
      <Eyebrow previewField="subtitle">{section.eyebrow}</Eyebrow>
      <h2 className="mx-auto max-w-4xl text-4xl leading-tight sm:text-6xl">
        <SectionTitle title={section.title} preview />
      </h2>
      <p data-preview-field="body" className="mx-auto mt-8 max-w-2xl whitespace-pre-line text-base leading-8 text-[#685B54]">
        {section.body}
      </p>
      <Link
        href="/nosotros"
        className="mt-9 inline-flex items-center gap-3 border-b border-[#857268] pb-2 text-[10px] uppercase tracking-[0.25em]"
      >
        Conocer más <ArrowRight size={14} />
      </Link>
    </section>
  );
}

export default async function Home() {
  const [featured, content, settings, gallery] = await Promise.all([
    getPublicProducts({ featured: true }),
    getPublicHomeContent(),
    getPublicSettings(),
    getPublicGallery(),
  ]);

  const hero = content.find((section) => section.key === "hero");
  const contact = content.find((section) => section.key === "contacto");
  const middleSections = content
    .filter((section) => section.key === "artesanal" || section.key === "historia")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <PublicShell>
      <LivePreviewBridge />
      {hero ? (
        <section data-preview-section="hero" hidden={!hero.visible} className="grid min-h-[calc(100vh-6rem)] bg-[#E8D6CF] lg:grid-cols-[42%_58%]">
          <div className="relative flex flex-col justify-center px-7 py-20 sm:px-14 lg:px-[10%]">
            <div className="absolute left-8 top-10 h-24 w-24 rounded-full border border-[#C7AD8C]/60 sm:left-auto sm:right-10" />
            <Eyebrow previewField="subtitle">{hero.eyebrow}</Eyebrow>
            <h1 className="relative z-10 text-[clamp(3.5rem,7vw,7.4rem)] leading-[0.88] tracking-[-0.04em]">
              <SectionTitle title={hero.title} indentSecondLine preview />
            </h1>
            <p data-preview-field="body" className="mt-9 max-w-md whitespace-pre-line text-sm leading-7 text-[#685B54] sm:text-base">
              {hero.body}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/colecciones"
                className="inline-flex items-center gap-4 bg-[#423A36] px-7 py-4 text-[10px] uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#857268]"
              >
                Explorar categorías <ArrowRight size={15} />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center border-b border-[#857268] px-3 text-[10px] uppercase tracking-[0.24em]"
              >
                Hacer una consulta
              </Link>
            </div>
          </div>
          <div className="relative min-h-[65vh] overflow-hidden">
            {hero.image ? <img
              src={hero.image}
              alt="Detalle de accesorios delicados en tonos dorados"
              data-preview-field="image"
              className="absolute inset-0 h-full w-full object-cover object-center"
            /> : null}
            <div className="absolute inset-0 bg-gradient-to-t from-[#423A36]/25 to-transparent" />
            <span className="absolute bottom-8 right-8 flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-white">
              <ArrowDown size={14} /> Descubrir
            </span>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="mb-14 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>Piezas elegidas</Eyebrow>
            <h2 className="text-5xl sm:text-6xl">
              Una belleza <i className="font-normal">íntima</i>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#685B54] md:justify-self-end">
            Diseños delicados que celebran la identidad de cada persona y la
            emoción de cada ocasión.
          </p>
        </div>
        {featured.length ? (
          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="border border-[#C7AD8C]/45 bg-white/45 px-6 py-14 text-center">
            <p className="text-3xl">Nuevas piezas muy pronto</p>
            <p className="mx-auto mt-3 max-w-lg font-sans text-sm leading-7 text-[#685B54]">
              Estamos preparando el catálogo. Mientras tanto, podés escribirnos y
              contarnos qué accesorio estás buscando.
            </p>
          </div>
        )}
        <div className="mt-12 text-center">
          <Link
            href="/productos"
            className="inline-flex items-center gap-3 border-b border-[#857268] pb-2 text-[10px] uppercase tracking-[0.25em]"
          >
            Ver todos los accesorios <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {middleSections.map((section) =>
        section.key === "artesanal" ? (
          <ArtesanalSection key={section.key} section={section} />
        ) : (
          <HistoriaSection key={section.key} section={section} />
        ),
      )}

      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="text-center">
          <Eyebrow>Cómo elegir</Eyebrow>
          <h2 className="text-5xl">
            Tu accesorio, <i className="font-normal">paso a paso</i>
          </h2>
        </div>
        <div className="mt-16 grid gap-px bg-[#C7AD8C]/40 md:grid-cols-3">
          {processSteps.map((step) => (
            <article key={step.number} className="bg-[#F9F6F1] p-8 sm:p-11">
              <span className="text-4xl italic text-[#C7AD8C]">
                {step.number}
              </span>
              <h3 className="mt-10 text-2xl">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#685B54]">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {gallery.length ? (
        <section className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
          <div className="mb-10 text-center">
            <Eyebrow>Galería</Eyebrow>
            <h2 className="text-5xl">
              Detalles que <i className="font-normal">inspiran</i>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((item, index) => (
              <figure
                key={item.id}
                className={`overflow-hidden bg-[#E8D6CF] ${
                  index === 0 ? "sm:col-span-2 sm:row-span-2" : ""
                }`}
              >
                <img
                  src={item.url}
                  alt={item.alt}
                  className={`w-full object-cover ${
                    index === 0 ? "aspect-[4/3] sm:h-full" : "aspect-square"
                  }`}
                />
                {item.title ? (
                  <figcaption className="sr-only">{item.title}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {contact ? (
        <section data-preview-section="contacto" hidden={!contact.visible} className="relative overflow-hidden bg-[#E8D6CF] px-5 py-24 text-center sm:px-8">
          <div className="absolute -left-16 -top-24 h-72 w-72 rounded-full border border-[#C7AD8C]" />
          <div className="relative">
            <Eyebrow previewField="subtitle">{contact.eyebrow}</Eyebrow>
            <h2 className="mx-auto mt-6 max-w-3xl text-5xl leading-tight sm:text-6xl">
              <SectionTitle title={contact.title} preview />
            </h2>
            <p data-preview-field="body" className="mx-auto mt-6 max-w-2xl whitespace-pre-line text-sm leading-7 text-[#685B54]">
              {contact.body}
            </p>
            <a
              href={buildWhatsAppUrl(
                settings.whatsappNumber,
                "Hola Seda y Tul, quisiera consultar por un accesorio para una celebración.",
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-9 inline-flex items-center gap-4 bg-[#423A36] px-8 py-4 text-[10px] uppercase tracking-[0.24em] text-white"
            >
              Escribir por WhatsApp <ArrowRight size={15} />
            </a>
          </div>
        </section>
      ) : null}
    </PublicShell>
  );
}
