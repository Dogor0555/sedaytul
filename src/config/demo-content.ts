export type Category = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  image: string | null;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  kind: string;
  description: string;
  detail: string;
  price?: string;
  image: string;
  images: string[];
  materials: string[];
  featured?: boolean;
};

// Valores de respaldo. En Vercel se configuran mediante variables de entorno.
export const demoWhatsAppNumber = process.env.WHATSAPP_NUMBER ?? "50370000000";

export const site = {
  name: "Seda y Tul",
  tagline: "Detalles artesanales para momentos inolvidables",
  country: "El Salvador",
  showPrices: false,
  instagramUrl: process.env.INSTAGRAM_URL ?? "https://www.instagram.com/",
  facebookUrl: process.env.FACEBOOK_URL ?? "https://www.facebook.com/",
};

export const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Categorías", href: "/colecciones" },
  { label: "Accesorios", href: "/productos" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export const categories: Category[] = [
  {
    slug: "novias",
    name: "Novias",
    eyebrow: "Para el gran día",
    description: "Peinetas, tocados y diademas que acompañan cada estilo con luz, textura y delicadeza.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1400&q=85",
  },
  {
    slug: "bautizos",
    name: "Bautizos",
    eyebrow: "Primeras celebraciones",
    description: "Coronas y lazos suaves, creados para guardar la ternura de un día lleno de significado.",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1400&q=85",
  },
  {
    slug: "primeras-comuniones",
    name: "Primeras comuniones",
    eyebrow: "Detalles luminosos",
    description: "Tocados sutiles y coronas delicadas para complementar un momento especial con naturalidad.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=85",
  },
  {
    slug: "ocasiones-especiales",
    name: "Ocasiones especiales",
    eyebrow: "Para celebrar",
    description: "Diademas, lazos y piezas versátiles que transforman un look y hacen memorable cada ocasión.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1400&q=85",
  },
];

export const products: Product[] = [
  {
    slug: "peineta-azahar",
    name: "Azahar",
    category: "Novias",
    kind: "Peineta",
    description: "Ramas de flores marfil y pequeños cristales sobre una estructura ligera.",
    detail: "Azahar enmarca recogidos y ondas con una composición orgánica de flores, hojas y destellos sutiles. Su estructura flexible permite acomodarla con naturalidad en distintos peinados.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Flores modeladas", "Cristales", "Alambre de joyería"],
    featured: true,
  },
  {
    slug: "tocado-celeste",
    name: "Celeste",
    category: "Novias",
    kind: "Tocado",
    description: "Un tocado de inspiración botánica con perlas y hojas doradas.",
    detail: "Celeste combina pequeñas perlas con hojas de acabado cálido. Puede llevarse a un lado, sobre un moño bajo o acompañando un semirrecogido.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Perlas de vidrio", "Hojas metálicas", "Alambre flexible"],
    featured: true,
  },
  {
    slug: "corona-alba",
    name: "Alba",
    category: "Bautizos",
    kind: "Corona",
    description: "Corona liviana de flores pequeñas en tonos marfil y champán.",
    detail: "Alba fue pensada para acompañar con suavidad una celebración familiar. Sus pequeñas flores se distribuyen sobre una base flexible y se ajustan con una cinta delicada.",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Flores textiles", "Cinta de satén", "Base flexible"],
    featured: true,
  },
  {
    slug: "lazo-nube",
    name: "Nube",
    category: "Bautizos",
    kind: "Lazo",
    description: "Lazo de tul suave con centro bordado y broche discreto.",
    detail: "Nube suma un detalle etéreo sin perder comodidad. El volumen liviano del tul y su broche pequeño hacen que sea fácil de colocar y llevar.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Tul suave", "Hilo de seda", "Broche metálico"],
  },
  {
    slug: "diadema-gracia",
    name: "Gracia",
    category: "Primeras comuniones",
    kind: "Diadema",
    description: "Flores de porcelana fría y perlas pequeñas en una línea delicada.",
    detail: "Gracia acompaña el peinado con una línea sutil de flores y perlas. La base está forrada para ofrecer un ajuste cómodo durante toda la celebración.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Flores modeladas", "Perlas", "Base forrada"],
  },
  {
    slug: "corona-paz",
    name: "Paz",
    category: "Primeras comuniones",
    kind: "Corona",
    description: "Corona de hojas marfil con pequeños puntos de luz.",
    detail: "Paz rodea el peinado con una rama continua de hojas claras y cristales diminutos. Se termina con cintas para adaptar su ajuste.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Hojas textiles", "Cristales", "Cintas de ajuste"],
  },
  {
    slug: "diadema-aurora",
    name: "Aurora",
    category: "Ocasiones especiales",
    kind: "Diadema",
    description: "Una diadema de volumen suave, bordada con cristales tono sobre tono.",
    detail: "Aurora aporta textura y luz a celebraciones de día o de noche. Su interior forrado y su volumen equilibrado permiten llevarla cómodamente.",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Textil satinado", "Cristales", "Base forrada"],
  },
  {
    slug: "lazo-rosa",
    name: "Rosa",
    category: "Ocasiones especiales",
    kind: "Lazo",
    description: "Lazo de líneas amplias en rosa empolvado, con caída elegante.",
    detail: "Rosa transforma una coleta o semirrecogido con un gesto femenino y contemporáneo. Su broche permite colocarlo fácilmente.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Tela satinada", "Entretela suave", "Broche metálico"],
  },
];

export const processSteps = [
  { number: "01", title: "Elegí la ocasión", text: "Explorá las categorías y encontrá el tipo de accesorio que acompaña tu celebración." },
  { number: "02", title: "Contanos tu idea", text: "Escribinos por WhatsApp con la fecha, el peinado o la inspiración que tenés en mente." },
  { number: "03", title: "Coordinamos los detalles", text: "Confirmamos disponibilidad, opciones y forma de entrega antes de preparar tu pieza." },
];

export function whatsappUrl(message: string) {
  return `https://wa.me/${demoWhatsAppNumber}?text=${encodeURIComponent(message)}`;
}
