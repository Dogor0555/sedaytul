import { Camera, Menu, MessageCircle, UsersRound } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/shared/brand-mark";
import { navigation } from "@/config/demo-content";
import {
  buildWhatsAppUrl,
  getPublicSettings,
  type PublicSettings,
} from "@/server/repositories/public-settings";

const whatsappMessage =
  "Hola Seda y Tul, quisiera consultar por sus accesorios artesanales.";

export function Header({ settings }: { settings: PublicSettings }) {
  const whatsapp = buildWhatsAppUrl(settings.whatsappNumber, whatsappMessage);

  return (
    <header className="relative z-30 border-b border-[#C7AD8C]/35 bg-[#F9F6F1]/95 text-[#423A36] backdrop-blur">
      <div className="mx-auto flex h-24 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <BrandMark />
        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Navegación principal"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-[#9B7654]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Instagram de ${settings.businessName}`}
            className="grid size-10 place-items-center rounded-full border border-[#C7AD8C]/60 hover:bg-white"
          >
            <Camera size={16} />
          </a>
          <a
            href={settings.facebookUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Facebook de ${settings.businessName}`}
            className="grid size-10 place-items-center rounded-full border border-[#C7AD8C]/60 hover:bg-white"
          >
            <UsersRound size={16} />
          </a>
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#423A36] px-5 text-[10px] uppercase tracking-[0.16em] text-white hover:bg-[#857268]"
          >
            <MessageCircle size={15} /> Consultar
          </a>
        </div>
        <details className="group relative lg:hidden">
          <summary
            className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-[#C7AD8C]/60 [&::-webkit-details-marker]:hidden"
            aria-label="Abrir menú"
          >
            <Menu size={19} aria-hidden="true" />
          </summary>
          <nav
            className="absolute right-0 top-14 w-64 border border-[#C7AD8C]/40 bg-[#F9F6F1] p-3 shadow-xl"
            aria-label="Navegación móvil"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block border-b border-[#C7AD8C]/25 px-4 py-3 text-sm tracking-wide last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-[#C7AD8C]/40 px-3 py-2 text-xs"
              >
                <Camera size={15} /> Instagram
              </a>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-[#C7AD8C]/40 px-3 py-2 text-xs"
              >
                <UsersRound size={15} /> Facebook
              </a>
            </div>
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#423A36] px-3 py-3 text-xs font-semibold text-white"
            >
              <MessageCircle size={15} /> Consultar por WhatsApp
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function Footer({ settings }: { settings: PublicSettings }) {
  const whatsapp = buildWhatsAppUrl(
    settings.whatsappNumber,
    "Hola Seda y Tul, quisiera conocer más sobre sus accesorios.",
  );

  return (
    <footer className="bg-[#423A36] px-5 py-14 text-[#F9F6F1] sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandMark light />
          <p className="mt-6 max-w-sm text-sm leading-7 text-[#F9F6F1]/65">
            {settings.footerText}
          </p>
          {settings.address !== "El Salvador" ? (
            <p className="mt-3 text-xs text-[#F9F6F1]/45">{settings.address}</p>
          ) : null}
        </div>
        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#C7AD8C]">
            Desde
          </p>
          <p className="text-sm leading-7 text-[#F9F6F1]/70">
            {settings.address === "El Salvador" ? "El Salvador" : settings.address}
            <br />
            {settings.businessHours}
          </p>
        </div>
        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#C7AD8C]">
            Conversemos
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#F9F6F1] px-4 py-2 text-xs font-semibold text-[#423A36]"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="grid size-9 place-items-center rounded-full border border-white/25"
              aria-label="Instagram"
            >
              <Camera size={15} />
            </a>
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="grid size-9 place-items-center rounded-full border border-white/25"
              aria-label="Facebook"
            >
              <UsersRound size={15} />
            </a>
          </div>
          <p className="mt-3 text-xs leading-5 text-[#F9F6F1]/45">
            Disponibilidad y entregas se confirman por mensaje.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1400px] flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.18em] text-white/40">
        <span>© {new Date().getFullYear()} {settings.businessName}</span>
        <span>Creado con delicadeza en El Salvador</span>
      </div>
    </footer>
  );
}

export async function PublicShell({ children }: { children: ReactNode }) {
  const settings = await getPublicSettings();

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#F9F6F1] font-serif text-[#423A36]">
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton
        href={buildWhatsAppUrl(
          settings.whatsappNumber,
          "Hola Seda y Tul, quisiera recibir información sobre sus accesorios.",
        )}
      />
    </div>
  );
}

function WhatsAppButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#857268] text-white shadow-lg transition-transform hover:scale-105 focus:outline-2 focus:outline-offset-2 focus:outline-[#857268]"
    >
      <MessageCircle size={22} />
    </a>
  );
}
