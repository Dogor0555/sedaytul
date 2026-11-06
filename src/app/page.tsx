/* eslint-disable @next/next/no-img-element */
import {
  ArrowDown,
  ArrowRight,
  Banknote,
  CreditCard,
  Globe2,
  Heart,
  Landmark,
  MessageCircle,
  Smartphone,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Eyebrow, ProductCard } from "@/components/public/content";
import { isLightColor } from "@/lib/colors";
import { LivePreviewBridge } from "@/components/public/live-preview-bridge";
import { PublicShell } from "@/components/public/site-chrome";
import { getPublicProducts } from "@/server/repositories/public-catalog";
import {
  buildWhatsAppUrl,
  getPublicGallery,
  getPublicHomeContent,
  getPublicSettings,
  type HomeSection,
} from "@/server/repositories/public-settings";

export const dynamic = "force-dynamic";

const paymentIcons = [Landmark, CreditCard, Globe2, Smartphone, Banknote];

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

function sectionCta(section: HomeSection | undefined, whatsappNumber: string, message: string) {
  if (!section?.ctaLabel || !section.ctaUrl) return null;
  const href = section.ctaUrl === "whatsapp" ? buildWhatsAppUrl(whatsappNumber, message) : section.ctaUrl;
  const external = href.startsWith("http");
  return { label: section.ctaLabel, href, external };
}

function CtaButton({
  cta,
  variant = "dark",
}: {
  cta: { label: string; href: string; external: boolean } | null;
  variant?: "dark" | "outline" | "light";
}) {
  if (!cta) return null;
  const classes = variant === "dark"
    ? "bg-[#423A36] text-white hover:bg-[#655C57]"
    : variant === "light"
      ? "bg-[#F9F6F1] text-[#423A36] hover:bg-white"
      : "border-b border-[#857268] pb-2 text-[#423A36] hover:text-[#9B7654]";
  return (
    <a
      href={cta.href}
      {...(cta.external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] transition-colors ${variant === "outline" ? classes : `px-7 py-4 ${classes}`}`}
    >
      {cta.label} <ArrowRight size={14} />
    </a>
  );
}

function SectionHeading({ section, align = "left" }: { section: HomeSection | undefined; align?: "left" | "center" }) {
  if (!section) return null;
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Eyebrow>{section.eyebrow}</Eyebrow>
      <h2 className="text-4xl leading-tight sm:text-5xl lg:text-6xl">
        <SectionTitle title={section.title} />
      </h2>
      <p className={`whitespace-pre-line text-sm leading-7 text-[#685B54] ${centered ? "mx-auto mt-6" : "mt-6"}`}>{section.body}</p>
    </div>
  );
}

function CatalogSection({
  section,
  products,
  settings,
  background = false,
}: {
  section: HomeSection | undefined;
  products: Awaited<ReturnType<typeof getPublicProducts>>;
  settings: Awaited<ReturnType<typeof getPublicSettings>>;
  background?: boolean;
}) {
  const cta = sectionCta(section, settings.whatsappNumber, `Hola Seda y Tul, quisiera explorar ${section?.eyebrow?.toLowerCase() ?? "el catálogo"}.`);
  const backgroundColor = section?.backgroundColor ?? (background ? "#FAF9F6" : "#FFFFFF");
  return (
    <section data-preview-section={section?.key} hidden={section ? !section.visible : false} style={{ backgroundColor }} className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading section={section} />
          <div className="shrink-0 md:pb-2"><CtaButton cta={cta} variant="outline" /></div>
        </div>
        {products.length ? (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        ) : (
          <div className="border border-[#E2DCD4] bg-white px-6 py-14 text-center">
            <p className="text-3xl">Nuevas piezas muy pronto</p>
            <p className="mx-auto mt-3 max-w-lg font-sans text-sm leading-7 text-[#685B54]">Estamos preparando esta selección. Mientras tanto, escribinos y contanos qué estás buscando.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function SpecialSection({ section, settings, tone }: { section: HomeSection | undefined; settings: Awaited<ReturnType<typeof getPublicSettings>>; tone: "rose" | "sand" }) {
  if (!section) return null;
  const cta = sectionCta(section, settings.whatsappNumber, `Hola Seda y Tul, quisiera solicitar una cotización de ${section.title.replace(/\n/g, " ").toLowerCase()}.`);
  return (
    <article data-preview-section={section.key} hidden={!section.visible} style={{ backgroundColor: section.backgroundColor ?? (tone === "rose" ? "#FCFBF8" : "#FFFFFF") }} className="group overflow-hidden border border-[#E2DCD4]">
      <div className="relative h-64 overflow-hidden">
        {section.image ? (
          <img src={section.image} alt={section.title.replace(/\n/g, " ")} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
        ) : (
          <div className="grid h-full place-items-center"><Sparkles size={42} strokeWidth={1} className="text-[#9B7654]/55" /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#423A36]/35 to-transparent" />
      </div>
      <div className="p-7 sm:p-9">
        <Eyebrow>{section.eyebrow}</Eyebrow>
        <h3 className="text-3xl leading-tight"><SectionTitle title={section.title} /></h3>
        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#685B54]">{section.body}</p>
        <div className="mt-7"><CtaButton cta={cta} /></div>
      </div>
    </article>
  );
}

export default async function Home() {
  const [allProducts, content, settings, gallery] = await Promise.all([
    getPublicProducts(),
    getPublicHomeContent(),
    getPublicSettings(),
    getPublicGallery(),
  ]);

  const section = (key: HomeSection["key"]) => content.find((item) => item.key === key);
  const hero = section("hero");
  const accesorios = section("accesorios");
  const regalos = section("regalos");
  const personalizados = section("personalizados");
  const corporativos = section("corporativos");
  const historia = section("historia");
  const tips = section("tips");
  const pagos = section("pagos");
  const contacto = section("contacto");

  const accessories = allProducts
    .filter((product) => product.productType !== "GIFT")
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 6);
  const gifts = allProducts
    .filter((product) => product.productType === "GIFT")
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 6);

  const heroCta = sectionCta(hero, settings.whatsappNumber, "Hola Seda y Tul, quisiera explorar sus accesorios.");
  const whatsappHero = buildWhatsAppUrl(settings.whatsappNumber, "Hola Seda y Tul, quisiera consultar por un accesorio o regalo especial.");
  const paymentMethods = settings.paymentMethods.split("\n").map((item) => item.trim()).filter(Boolean);
  const heroBackground = hero?.backgroundColor ?? "#FFFFFF";
  const heroIsLight = isLightColor(heroBackground);
  const historiaBackground = historia?.backgroundColor ?? "#423A36";
  const historiaIsLight = isLightColor(historiaBackground);

  return (
    <PublicShell>
      <LivePreviewBridge />
      {hero ? (
        <section data-preview-section="hero" hidden={!hero.visible} style={{ backgroundColor: heroBackground, color: heroIsLight ? "#423A36" : "#F9F6F1" }} className="grid min-h-[calc(100vh-9rem)] border-b border-[#EDE8E2] lg:grid-cols-[44%_56%]">
          <div className="relative flex flex-col justify-center px-7 py-16 sm:px-14 lg:px-[9%]">
            <div className={`absolute left-8 top-10 h-24 w-24 rounded-full border sm:left-auto sm:right-10 ${heroIsLight ? "border-[#E2DCD4]" : "border-white/30"}`} />
            <Eyebrow light={!heroIsLight} previewField="subtitle">{hero.eyebrow}</Eyebrow>
            <h1 className="relative z-10 text-[clamp(3rem,6vw,6.4rem)] leading-[0.94] tracking-[-0.035em]">
              <SectionTitle title={hero.title} indentSecondLine preview />
            </h1>
            <p data-preview-field="body" className={`mt-8 max-w-lg whitespace-pre-line text-sm leading-7 sm:text-[15px] ${heroIsLight ? "text-[#685B54]" : "text-white/75"}`}>
              {hero.body}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <CtaButton cta={heroCta} variant={heroIsLight ? "dark" : "light"} />
              <Link href="/productos?tipo=regalos" className={`inline-flex items-center gap-3 border-b px-2 py-4 text-[10px] uppercase tracking-[0.22em] transition-colors ${heroIsLight ? "border-[#857268] hover:text-[#9B7654]" : "border-white/50 hover:text-white"}`}>
                Descubrir regalos <ArrowRight size={14} />
              </Link>
              <a href={whatsappHero} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 px-3 py-4 text-[10px] uppercase tracking-[0.18em] ${heroIsLight ? "text-[#685B54] hover:text-[#9B7654]" : "text-white/75 hover:text-white"}`}>
                <MessageCircle size={15} /> Contáctanos por WhatsApp
              </a>
            </div>
          </div>
          <div className="relative min-h-[60vh] overflow-hidden lg:min-h-0">
            {hero.image ? (
              <img src={hero.image} alt="Accesorios y regalos artesanales de Seda y Tul" data-preview-field="image" className="absolute inset-0 h-full w-full object-cover object-center" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-[#423A36]/30 via-transparent to-transparent" />
            <span className="absolute bottom-8 right-8 flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-white">
              <ArrowDown size={14} /> Descubrir
            </span>
          </div>
        </section>
      ) : null}

      <CatalogSection section={accesorios} products={accessories} settings={settings} />

      <CatalogSection section={regalos} products={gifts} settings={settings} background />

      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Eyebrow>Más que un detalle</Eyebrow>
          <h2 className="text-4xl sm:text-5xl">Creamos contigo, <i className="font-normal">a tu medida</i></h2>
          <p className="mt-5 text-sm leading-7 text-[#685B54]">Personalizamos colores, nombres, empaques y mensajes para que cada pieza cuente exactamente la historia que imaginás.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <SpecialSection section={personalizados} settings={settings} tone="rose" />
          <SpecialSection section={corporativos} settings={settings} tone="sand" />
        </div>
      </section>

      {gallery.length ? (
        <section className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>Galería</Eyebrow>
              <h2 className="text-4xl sm:text-5xl">Detalles que <i className="font-normal">inspiran</i></h2>
            </div>
            <Link href="/colecciones" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#857268] hover:text-[#9B7654]">Ver colecciones <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((item, index) => (
              <figure key={item.id} className={`overflow-hidden bg-[#F5F2EC] ${index === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}>
                <img src={item.url} alt={item.alt} className={`w-full object-cover ${index === 0 ? "aspect-[4/3] sm:h-full" : "aspect-square"}`} />
                {item.title ? <figcaption className="sr-only">{item.title}</figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {historia ? (
        <section data-preview-section="historia" hidden={!historia.visible} style={{ backgroundColor: historiaBackground, color: historiaIsLight ? "#423A36" : "#F9F6F1" }} className="px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-80 overflow-hidden bg-[#5a4c46]">
              {historia.image ? <img src={historia.image} alt="Proceso artesanal de Seda y Tul" data-preview-field="image" className="absolute inset-0 h-full w-full object-cover opacity-90" /> : <div className="grid min-h-80 place-items-center"><Heart size={46} strokeWidth={1} className="text-[#C7AD8C]" /></div>}
            </div>
            <div>
              <Eyebrow light={!historiaIsLight} previewField="subtitle">{historia.eyebrow}</Eyebrow>
              <h2 className="text-4xl leading-tight sm:text-5xl"><SectionTitle title={historia.title} preview /></h2>
              <p data-preview-field="body" className={`mt-6 max-w-xl whitespace-pre-line text-sm leading-8 ${historiaIsLight ? "text-[#685B54]" : "text-white/65"}`}>{historia.body}</p>
              <div className="mt-8"><CtaButton cta={sectionCta(historia, settings.whatsappNumber, "Hola Seda y Tul, quisiera conocer más sobre ustedes.") ?? { label: "Conocer nuestra historia", href: "/nosotros", external: false }} variant={historiaIsLight ? "dark" : "light"} /></div>
            </div>
          </div>
        </section>
      ) : null}

      {pagos ? (
        <section data-preview-section="pagos" hidden={!pagos.visible} style={{ backgroundColor: pagos.backgroundColor ?? "#FFFFFF" }} className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionHeading section={pagos} />
              <div className="mt-8"><CtaButton cta={sectionCta(pagos, settings.whatsappNumber, "Hola Seda y Tul, quisiera coordinar el pago y la entrega de mi pedido.")} /></div>
            </div>
            <div className="border border-[#E2DCD4] bg-white p-7 sm:p-10">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#9B7654]">Métodos disponibles</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {paymentMethods.map((method, index) => {
                  const Icon = paymentIcons[index % paymentIcons.length];
                  return (
                    <div key={method} className="flex items-center gap-3 rounded-xl border border-[#E4D9D3] bg-[#FCFAF8] px-4 py-3.5">
                      <Icon size={18} strokeWidth={1.5} className="shrink-0 text-[#9B7654]" />
                      <span className="text-sm text-[#5f514e]">{method}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-sm leading-7 text-[#685B54]">{settings.paymentInstructions}</p>
            </div>
          </div>
        </section>
      ) : null}

      {tips ? (
        <section data-preview-section="tips" hidden={!tips.visible} style={{ backgroundColor: tips.backgroundColor ?? "#FAF9F6" }} className="border-y border-[#EDE8E2] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading section={tips} />
              <div className="md:pb-2"><CtaButton cta={sectionCta(tips, settings.whatsappNumber, "Hola Seda y Tul, quisiera recibir tips para elegir un regalo.")} variant="outline" /></div>
            </div>
            <div className="mt-10 grid gap-px bg-[#E2DCD4] sm:grid-cols-2 lg:grid-cols-4">
              {tips.body.split("\n").map((tip) => tip.trim()).filter(Boolean).map((tip, index) => (
                <article key={tip} className="bg-white p-7">
                  <span className="text-3xl italic text-[#C7AD8C]">0{index + 1}</span>
                  <p className="mt-5 text-xl leading-snug">{tip}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {contacto ? (
        <section data-preview-section="contacto" hidden={!contacto.visible} style={{ backgroundColor: contacto.backgroundColor ?? "#FFFFFF" }} className="relative overflow-hidden border-t border-[#EDE8E2] px-5 py-24 text-center sm:px-8">
          <div className="absolute -left-16 -top-24 h-72 w-72 rounded-full border border-[#E2DCD4]" />
          <div className="relative">
            <Eyebrow previewField="subtitle">{contacto.eyebrow}</Eyebrow>
            <h2 className="mx-auto mt-6 max-w-3xl text-4xl leading-tight sm:text-6xl"><SectionTitle title={contacto.title} preview /></h2>
            <p data-preview-field="body" className="mx-auto mt-6 max-w-2xl whitespace-pre-line text-sm leading-7 text-[#685B54]">{contacto.body}</p>
            <div className="mt-9 flex justify-center"><CtaButton cta={sectionCta(contacto, settings.whatsappNumber, "Hola Seda y Tul, quisiera consultar por un accesorio o regalo para una celebración.") ?? { label: "Escribir por WhatsApp", href: whatsappHero, external: true }} /></div>
          </div>
        </section>
      ) : null}
    </PublicShell>
  );
}
