import { Camera, ChevronDown, Menu, MessageCircle, UsersRound } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/shared/brand-mark";
import { InquiryCartButton, InquiryCartProvider } from "@/components/public/inquiry-cart";
import { navigation } from "@/config/demo-content";
import type { Category } from "@/config/demo-content";
import {
  buildWhatsAppUrl,
  getPublicSettings,
  type PublicSettings,
} from "@/server/repositories/public-settings";
import { getPublicCategories } from "@/server/repositories/public-catalog";

const whatsappMessage =
  "Hola Seda y Tul, quisiera consultar por sus accesorios y regalos artesanales.";

export function Header({
  settings,
  categories,
}: {
  settings: PublicSettings;
  categories: Category[];
}) {
  const whatsapp = buildWhatsAppUrl(settings.whatsappNumber, whatsappMessage);

  return (
    <header className="relative z-30 border-b border-[#E5E0D8] bg-white/95 text-[#423A36] backdrop-blur">
      <div className="mx-auto grid h-24 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2">
          <details className="group relative">
            <summary className="flex h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-[#D8D1C8] px-3 text-[10px] uppercase tracking-[0.16em] transition-colors hover:bg-[#F7F5F1] [&::-webkit-details-marker]:hidden">
              <Menu size={17} aria-hidden="true" />
              <span className="hidden sm:inline">Menú</span>
              <ChevronDown size={13} className="hidden transition-transform group-open:rotate-180 sm:block" />
            </summary>
            <div className="absolute left-0 top-14 z-50 w-[min(88vw,330px)] border border-[#E5E0D8] bg-white p-3 shadow-xl">
              <p className="px-3 pb-2 pt-1 text-[9px] uppercase tracking-[0.3em] text-[#9B7654]">Categorías</p>
              {categories.map((category) => (
                <Link key={category.slug} href={`/productos?categoria=${category.slug}`} className="flex items-center justify-between border-b border-[#EDE8E2] px-3 py-2.5 text-sm tracking-wide last:border-0 hover:text-[#9B7654]">
                  {category.name}
                  <span className="text-[10px] text-[#C7AD8C]">→</span>
                </Link>
              ))}
              <p className="px-3 pb-2 pt-4 text-[9px] uppercase tracking-[0.3em] text-[#9B7654]">Conócenos</p>
              {navigation.filter((item) => item.href !== "/").map((item) => (
                <Link key={item.href} href={item.href} className="block border-b border-[#EDE8E2] px-3 py-2.5 text-sm tracking-wide last:border-0 hover:text-[#9B7654]">
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 rounded-xl bg-[#F7F5F1] p-3 text-[11px] leading-5 text-[#685B54]">
                Envíos nacionales e internacionales. Comprá desde cualquier parte del mundo.
              </div>
            </div>
          </details>
          <span className="hidden text-[9px] uppercase tracking-[0.28em] text-[#9B7654] xl:block">
            Accesorios y regalos
          </span>
        </div>

        <div className="flex min-w-0 flex-col items-center">
          <BrandMark logoUrl={settings.logoUrl} businessName={settings.businessName} />
        </div>

        <div className="flex items-center justify-end gap-2">
          <InquiryCartButton />
          {settings.instagramUrl ? (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Instagram de ${settings.businessName}`}
              className="hidden size-11 place-items-center rounded-full border border-[#D8D1C8] hover:bg-[#F7F5F1] sm:grid"
            >
              <Camera size={16} />
            </a>
          ) : null}
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-11 items-center gap-2 rounded-full bg-[#423A36] px-4 text-[9px] uppercase tracking-[0.16em] text-white hover:bg-[#655C57] md:inline-flex"
          >
            <MessageCircle size={15} /> WhatsApp
          </a>
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            aria-label="Consultar por WhatsApp"
            className="grid size-11 place-items-center rounded-full bg-[#423A36] text-white md:hidden"
          >
            <MessageCircle size={17} />
          </a>
        </div>
      </div>

      <nav aria-label="Categorías principales" className="border-t border-[#EDE8E2] bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 overflow-x-auto px-4 py-3 text-[9px] uppercase tracking-[0.2em] [scrollbar-width:none] sm:justify-center sm:px-8 lg:px-12 [&::-webkit-scrollbar]:hidden">
          <Link href="/productos" className="shrink-0 pb-1 text-[#222222] transition-colors hover:text-[#222222]">Todos</Link>
          {categories.map((category) => (
            <Link key={category.slug} href={`/productos?categoria=${category.slug}`} className="shrink-0 pb-1 transition-colors hover:text-[#222222]">
              {category.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function Footer({ settings }: { settings: PublicSettings }) {
  const whatsapp = buildWhatsAppUrl(
    settings.whatsappNumber,
    "Hola Seda y Tul, quisiera conocer más sobre sus accesorios y regalos.",
  );

  return (
    <footer className="bg-[#423A36] px-5 py-16 text-[#F9F6F1] sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <BrandMark light logoUrl={settings.logoUrl} businessName={settings.businessName} />
          <p className="mt-6 max-w-sm text-sm leading-7 text-[#F9F6F1]/65">{settings.footerText}</p>
          <p className="mt-3 text-xs text-[#F9F6F1]/45">{settings.address} · {settings.businessHours}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#F9F6F1] px-4 py-2 text-xs font-semibold text-[#423A36]">
              <MessageCircle size={14} /> WhatsApp
            </a>
            {settings.instagramUrl ? (
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="grid size-9 place-items-center rounded-full border border-white/25" aria-label="Instagram">
                <Camera size={15} />
              </a>
            ) : null}
            {settings.facebookUrl ? (
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="grid size-9 place-items-center rounded-full border border-white/25" aria-label="Facebook">
                <UsersRound size={15} />
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#C7AD8C]">Conócenos</p>
          <ul className="space-y-2.5 text-sm text-[#F9F6F1]/70">
            <li><Link href="/nosotros" className="hover:text-white">Nuestra historia</Link></li>
            <li><Link href="/nosotros#valores" className="hover:text-white">Valores y esencia</Link></li>
            <li><Link href="/colecciones" className="hover:text-white">Colecciones</Link></li>
            <li><Link href="/tips" className="hover:text-white">Tips y cuidados</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#C7AD8C]">Contáctanos</p>
          <ul className="space-y-2.5 text-sm text-[#F9F6F1]/70">
            <li><Link href="/contacto" className="hover:text-white">Formulario de consulta</Link></li>
            <li><a href={whatsapp} target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp directo</a></li>
            <li><span className="text-[#F9F6F1]/45">{settings.address}</span></li>
            <li><span className="text-[#F9F6F1]/45">{settings.businessHours}</span></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#C7AD8C]">Redes y envíos</p>
          <ul className="space-y-2.5 text-sm text-[#F9F6F1]/70">
            {settings.instagramUrl ? <li><a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a></li> : null}
            {settings.facebookUrl ? <li><a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-white">Facebook</a></li> : null}
            <li><Link href="/productos?tipo=regalos" className="hover:text-white">Regalos a distancia</Link></li>
            <li><span className="text-[#F9F6F1]/45">Envíos nacionales e internacionales</span></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1400px] flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.18em] text-white/40">
        <span>© {new Date().getFullYear()} {settings.businessName}</span>
        <span>{settings.tagline}</span>
      </div>
    </footer>
  );
}

export async function PublicShell({ children }: { children: ReactNode }) {
  const [settings, categories] = await Promise.all([
    getPublicSettings(),
    getPublicCategories(),
  ]);

  return (
    <InquiryCartProvider whatsappNumber={settings.whatsappNumber}>
      <div className="flex min-h-screen flex-1 flex-col bg-white font-serif text-[#423A36]">
        <Header settings={settings} categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <FloatingWhatsApp
          href={buildWhatsAppUrl(
            settings.whatsappNumber,
            "Hola Seda y Tul, quisiera recibir información sobre sus accesorios y regalos.",
          )}
        />
      </div>
    </InquiryCartProvider>
  );
}

function FloatingWhatsApp({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir por WhatsApp: ¿Podemos ayudarte?"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-[#857268] py-3 pl-4 pr-4 text-white shadow-lg transition-transform hover:scale-105 focus:outline-2 focus:outline-offset-2 focus:outline-[#857268] sm:pr-5"
    >
      <MessageCircle size={21} />
      <span className="hidden text-[10px] uppercase tracking-[0.14em] sm:inline">¿Podemos ayudarte?</span>
    </a>
  );
}
