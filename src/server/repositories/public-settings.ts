import { cache } from "react";
import { db } from "@/lib/db";

export type PublicSettings = {
  businessName: string;
  tagline: string;
  logoUrl: string | null;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  address: string;
  businessHours: string;
  businessDescription: string;
  footerText: string;
  paymentMethods: string;
  paymentInstructions: string;
  seoTitle: string;
  seoDescription: string;
};

export type HomeSectionKey =
  | "hero"
  | "accesorios"
  | "regalos"
  | "personalizados"
  | "corporativos"
  | "historia"
  | "tips"
  | "pagos"
  | "contacto";

export type HomeSection = {
  key: HomeSectionKey;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  backgroundColor: string | null;
  image: string | null;
  visible: boolean;
  sortOrder: number;
};

export type PublicGalleryItem = {
  id: string;
  url: string;
  alt: string;
  title: string | null;
  featured: boolean;
};

const digits = (value: string | null | undefined) => (value ?? "").replace(/\D/g, "");

export const fallbackSettings: PublicSettings = {
  businessName: "Seda y Tul",
  tagline: "Hecho a mano con amor en El Salvador",
  logoUrl: null,
  whatsappNumber: digits(process.env.WHATSAPP_NUMBER) || "50376354902",
  instagramUrl: process.env.INSTAGRAM_URL || "",
  facebookUrl: process.env.FACEBOOK_URL || "",
  address: "El Salvador",
  businessHours: "Lunes a sábado, 9:00 a 18:00",
  businessDescription:
    "Tienda virtual de accesorios y regalos especiales en El Salvador. Creamos piezas personalizadas con amor para cada ocasión.",
  footerText: "Accesorios y regalos creados a mano con una mirada sensible sobre cada celebración.",
  paymentMethods: "PayPal\nTransferencia bancaria\nTarjeta de crédito o débito",
  paymentInstructions:
    "Agregá tus piezas al carrito y completá el checkout. Podés pagar con PayPal o solicitar el link de pago por WhatsApp. También coordinamos envíos nacionales e internacionales.",
  seoTitle: "Seda y Tul | Accesorios y regalos personalizados en El Salvador",
  seoDescription:
    "Accesorios y regalos personalizados hechos a mano en El Salvador. Envíos nacionales e internacionales para cada celebración.",
};

export const fallbackSections: Record<HomeSectionKey, Omit<HomeSection, "key">> = {
  hero: {
    eyebrow: "Hecho a mano con amor en El Salvador",
    title: "Accesorios y regalos\ncon alma artesanal",
    body: "Seda y Tul es una tienda virtual de accesorios y regalos especiales en El Salvador.\n\nCreamos regalos y accesorios personalizados, elaborados con amor y dedicación para cada ocasión.\n\nContamos con envíos nacionales e internacionales. Puedes comprar desde cualquier parte del mundo, para ti o para sorprender a tus seres queridos.",
    ctaLabel: "Explorar accesorios",
    ctaUrl: "/productos?tipo=accesorios",
    backgroundColor: "#FFFFFF",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1800&q=90",
    visible: true,
    sortOrder: 0,
  },
  accesorios: {
    eyebrow: "Catálogo de accesorios",
    title: "Accesorios para\ncada celebración",
    body: "Peinetas, tocados, diademas, coronas y lazos creados a mano para acompañar novias, bautizos, primeras comuniones, XV años y ocasiones especiales.",
    ctaLabel: "Ver todos los accesorios",
    ctaUrl: "/productos?tipo=accesorios",
    backgroundColor: "#FFFFFF",
    image: null,
    visible: true,
    sortOrder: 1,
  },
  regalos: {
    eyebrow: "Regalos con intención",
    title: "Regalos que llegan\nal corazón",
    body: "Cajas, sets y detalles personalizados para sorprender a distancia o en persona. Elegimos cada empaque y cada mensaje para que el regalo se sienta único.",
    ctaLabel: "Descubrir regalos",
    ctaUrl: "/productos?tipo=regalos",
    backgroundColor: "#FAF9F6",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1400&q=85",
    visible: true,
    sortOrder: 2,
  },
  personalizados: {
    eyebrow: "Hecho para ti",
    title: "Productos\npersonalizados",
    body: "Adaptamos accesorios y regalos a tus gustos, nombres, colores y preferencias. Agregá la pieza al carrito y envianos los detalles por WhatsApp para cotizarla.",
    ctaLabel: "Solicitar cotización",
    ctaUrl: "whatsapp",
    backgroundColor: "#FCFBF8",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
    visible: true,
    sortOrder: 3,
  },
  corporativos: {
    eyebrow: "Para tu empresa",
    title: "Regalos\ncorporativos",
    body: "Regalos empresariales, detalles institucionales y productos personalizados para eventos corporativos, equipos y clientes. Envianos cantidades y fecha por WhatsApp para preparar tu cotización.",
    ctaLabel: "Solicitar cotización",
    ctaUrl: "whatsapp",
    backgroundColor: "#FFFFFF",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=85",
    visible: true,
    sortOrder: 4,
  },
  historia: {
    eyebrow: "Conócenos",
    title: "Crear un detalle.\nGuardar una memoria.",
    body: "Seda y Tul nace en El Salvador del deseo de acompañar celebraciones con piezas hechas a mano, delicadas y profundamente personales.",
    ctaLabel: "Conocer nuestra historia",
    ctaUrl: "/nosotros",
    backgroundColor: "#423A36",
    image: null,
    visible: true,
    sortOrder: 5,
  },
  tips: {
    eyebrow: "Tips Seda y Tul",
    title: "Ideas y cuidados\npara tus detalles",
    body: "Elegir un regalo a distancia\nCuidar tus accesorios artesanales\nCombinar accesorios según la celebración\nPreparar un regalo corporativo con tiempo",
    ctaLabel: "Ver todos los tips",
    ctaUrl: "/tips",
    backgroundColor: "#FAF9F6",
    image: null,
    visible: true,
    sortOrder: 6,
  },
  pagos: {
    eyebrow: "Formas de pago",
    title: "Comprar es\nmuy sencillo",
    body: "Armá tu carrito, completá tus datos y enviá el resumen por WhatsApp. Si elegís PayPal, te compartimos el link de pago por ese mismo canal y coordinamos la entrega.",
    ctaLabel: "Enviar pedido por WhatsApp",
    ctaUrl: "whatsapp",
    backgroundColor: "#FFFFFF",
    image: null,
    visible: true,
    sortOrder: 7,
  },
  contacto: {
    eyebrow: "¿Buscás algo especial?",
    title: "Encontremos el detalle para\ntu celebración",
    body: "Contanos la fecha, el tipo de celebración y el accesorio o regalo que tenés en mente. También podés armar tu carrito y enviarnos el resumen para cotizar o pagar con PayPal por WhatsApp.",
    ctaLabel: "Escribir por WhatsApp",
    ctaUrl: "whatsapp",
    backgroundColor: "#FFFFFF",
    image: null,
    visible: true,
    sortOrder: 8,
  },
};

const sectionKeys = Object.keys(fallbackSections) as HomeSectionKey[];

export function buildWhatsAppUrl(number: string, message: string) {
  return `https://wa.me/${digits(number)}?text=${encodeURIComponent(message)}`;
}

export const getPublicSettings = cache(async (): Promise<PublicSettings> => {
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: "main" },
      include: { logo: { select: { url: true } } },
    });
    if (!settings) return fallbackSettings;

    return {
      businessName: settings.businessName.trim() || fallbackSettings.businessName,
      tagline: settings.tagline?.trim() || fallbackSettings.tagline,
      logoUrl: settings.logo?.url ?? null,
      whatsappNumber:
        digits(settings.whatsappNumber) || fallbackSettings.whatsappNumber,
      instagramUrl:
        settings.instagramUrl?.trim() || fallbackSettings.instagramUrl,
      facebookUrl: settings.facebookUrl?.trim() || fallbackSettings.facebookUrl,
      address: settings.address?.trim() || fallbackSettings.address,
      businessHours:
        settings.businessHours?.trim() || fallbackSettings.businessHours,
      businessDescription:
        settings.businessDescription?.trim() ||
        fallbackSettings.businessDescription,
      footerText: settings.footerText?.trim() || fallbackSettings.footerText,
      paymentMethods:
        settings.paymentMethods?.trim() || fallbackSettings.paymentMethods,
      paymentInstructions:
        settings.paymentInstructions?.trim() ||
        fallbackSettings.paymentInstructions,
      seoTitle: settings.seoTitle?.trim() || fallbackSettings.seoTitle,
      seoDescription:
        settings.seoDescription?.trim() || fallbackSettings.seoDescription,
    };
  } catch {
    return fallbackSettings;
  }
});

export const getPublicHomeContent = cache(async (): Promise<HomeSection[]> => {
  try {
    const rows = await db.pageContent.findMany({
      where: { pageKey: "home", sectionKey: { in: sectionKeys } },
      include: { media: { select: { url: true } } },
    });
    const stored = new Map(rows.map((row) => [row.sectionKey, row]));

    return sectionKeys.map((key) => {
      const row = stored.get(key);
      const fallback = fallbackSections[key];
      return {
        key,
        eyebrow: row?.subtitle?.trim() || fallback.eyebrow,
        title: row?.title?.trim() || fallback.title,
        body: row?.body?.trim() || fallback.body,
        ctaLabel: row?.ctaLabel?.trim() || fallback.ctaLabel,
        ctaUrl: row?.ctaUrl?.trim() || fallback.ctaUrl,
        backgroundColor: row?.backgroundColor?.trim() || fallback.backgroundColor,
        image: row?.media?.url || fallback.image,
        visible: row?.visible ?? fallback.visible,
        sortOrder: row?.sortOrder ?? fallback.sortOrder,
      };
    });
  } catch {
    return sectionKeys.map((key) => ({ key, ...fallbackSections[key] }));
  }
});

export const getPublicGallery = cache(async (): Promise<PublicGalleryItem[]> => {
  try {
    const items = await db.galleryItem.findMany({
      where: { visible: true },
      include: { media: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      take: 9,
    });

    return items.map((item) => ({
      id: item.id,
      url: item.media.url,
      alt: item.media.altText || item.title || "Detalle artesanal de Seda y Tul",
      title: item.title,
      featured: item.featured,
    }));
  } catch {
    return [];
  }
});
