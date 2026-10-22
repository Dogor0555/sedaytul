import { cache } from "react";
import { db } from "@/lib/db";

export type PublicSettings = {
  businessName: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  address: string;
  businessHours: string;
  businessDescription: string;
  footerText: string;
  seoTitle: string;
  seoDescription: string;
};

export type HomeSectionKey = "hero" | "artesanal" | "historia" | "contacto";

export type HomeSection = {
  key: HomeSectionKey;
  eyebrow: string;
  title: string;
  body: string;
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

const fallbackSettings: PublicSettings = {
  businessName: "Seda y Tul",
  whatsappNumber: digits(process.env.WHATSAPP_NUMBER) || "50370000000",
  instagramUrl: process.env.INSTAGRAM_URL || "https://www.instagram.com/",
  facebookUrl: process.env.FACEBOOK_URL || "https://www.facebook.com/",
  address: "El Salvador",
  businessHours: "Lunes a sábado, 9:00 a 18:00",
  businessDescription:
    "Accesorios artesanales para novias, bautizos, primeras comuniones y ocasiones especiales.",
  footerText: "Accesorios creados a mano con una mirada sensible sobre cada celebración.",
  seoTitle: "Seda y Tul | Accesorios artesanales en El Salvador",
  seoDescription:
    "Peinetas, tocados, diademas, coronas y lazos artesanales para celebraciones inolvidables.",
};

const fallbackSections: Record<HomeSectionKey, Omit<HomeSection, "key">> = {
  hero: {
    eyebrow: "Accesorios artesanales",
    title: "Pequeños detalles,\ngrandes recuerdos",
    body: "Peinetas, tocados, diademas, coronas y lazos hechos en El Salvador para acompañar celebraciones inolvidables.",
    visible: true,
    sortOrder: 0,
  },
  artesanal: {
    eyebrow: "Hecho con intención",
    title: "El valor de hacer\nlas cosas despacio",
    body: "Cada flor, perla y lazo encuentra su lugar a través de un proceso manual, atento a las proporciones, el color y los pequeños acabados.",
    visible: true,
    sortOrder: 1,
  },
  historia: {
    eyebrow: "Nuestra historia",
    title: "Crear un detalle.\nGuardar una memoria.",
    body: "Seda y Tul nace en El Salvador del deseo de acompañar celebraciones con piezas hechas a mano, delicadas y profundamente personales.",
    visible: true,
    sortOrder: 2,
  },
  contacto: {
    eyebrow: "¿Buscás algo especial?",
    title: "Encontremos el detalle para\ntu celebración",
    body: "Contanos la fecha, el tipo de celebración y el accesorio que tenés en mente. Te responderemos con las opciones disponibles.",
    visible: true,
    sortOrder: 3,
  },
};

const sectionKeys = Object.keys(fallbackSections) as HomeSectionKey[];

export function buildWhatsAppUrl(number: string, message: string) {
  return `https://wa.me/${digits(number)}?text=${encodeURIComponent(message)}`;
}

export const getPublicSettings = cache(async (): Promise<PublicSettings> => {
  try {
    const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
    if (!settings) return fallbackSettings;

    return {
      businessName: settings.businessName.trim() || fallbackSettings.businessName,
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
