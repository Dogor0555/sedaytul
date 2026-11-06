export type Category = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  image: string | null;
};

export type ProductType = "ACCESSORY" | "GIFT";

export type PricingMode = "FIXED" | "QUOTE";

export type Product = {
  slug: string;
  name: string;
  category: string;
  kind: string;
  productType?: ProductType;
  pricingMode?: PricingMode;
  priceValue?: number | null;
  description: string;
  detail: string;
  personalization?: string;
  presentation?: string;
  price?: string;
  image: string;
  images: string[];
  materials: string[];
  featured?: boolean;
};

// Valores de respaldo. En Vercel se configuran mediante variables de entorno.
export const demoWhatsAppNumber = process.env.WHATSAPP_NUMBER ?? "50376354902";

export const site = {
  name: "Seda y Tul",
  tagline: "Hecho a mano con amor en El Salvador",
  country: "El Salvador",
  showPrices: false,
  instagramUrl: process.env.INSTAGRAM_URL ?? "https://www.instagram.com/",
  facebookUrl: process.env.FACEBOOK_URL ?? "https://www.facebook.com/",
};

export const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Conócenos", href: "/nosotros" },
  { label: "Contáctanos", href: "/contacto" },
  { label: "Tips", href: "/tips" },
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
    name: "Primera Comunión",
    eyebrow: "Detalles luminosos",
    description: "Tocados sutiles y coronas delicadas para complementar un momento especial con naturalidad.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=85",
  },
  {
    slug: "xv-anos",
    name: "XV Años",
    eyebrow: "Una noche para recordar",
    description: "Accesorios y detalles personalizados para acompañar la celebración de los quince.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1400&q=85",
  },
  {
    slug: "regalos-a-distancia",
    name: "Regalos a distancia",
    eyebrow: "Cerca aunque estés lejos",
    description: "Regalos personalizados con envío nacional e internacional para sorprender a quien quieres.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1400&q=85",
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
    productType: "ACCESSORY",
    description: "Ramas de flores marfil y pequeños cristales sobre una estructura ligera.",
    detail: "Azahar enmarca recogidos y ondas con una composición orgánica de flores, hojas y destellos sutiles. Su estructura flexible permite acomodarla con naturalidad en distintos peinados.",
    personalization: "Tono de flores, tamaño y detalles de cristal.",
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
    productType: "ACCESSORY",
    description: "Un tocado de inspiración botánica con perlas y hojas doradas.",
    detail: "Celeste combina pequeñas perlas con hojas de acabado cálido. Puede llevarse a un lado, sobre un moño bajo o acompañando un semirrecogido.",
    personalization: "Acabado dorado o plateado y cantidad de perlas.",
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
    productType: "ACCESSORY",
    description: "Corona liviana de flores pequeñas en tonos marfil y champán.",
    detail: "Alba fue pensada para acompañar con suavidad una celebración familiar. Sus pequeñas flores se distribuyen sobre una base flexible y se ajustan con una cinta delicada.",
    personalization: "Color de cintas y paleta de flores.",
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
    productType: "ACCESSORY",
    description: "Lazo de tul suave con centro bordado y broche discreto.",
    detail: "Nube suma un detalle etéreo sin perder comodidad. El volumen liviano del tul y su broche pequeño hacen que sea fácil de colocar y llevar.",
    personalization: "Inicial bordada y color del tul.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Tul suave", "Hilo de seda", "Broche metálico"],
  },
  {
    slug: "diadema-gracia",
    name: "Gracia",
    category: "Primera Comunión",
    kind: "Diadema",
    productType: "ACCESSORY",
    description: "Flores de porcelana fría y perlas pequeñas en una línea delicada.",
    detail: "Gracia acompaña el peinado con una línea sutil de flores y perlas. La base está forrada para ofrecer un ajuste cómodo durante toda la celebración.",
    personalization: "Color de flores y acabado de la base.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Flores modeladas", "Perlas", "Base forrada"],
  },
  {
    slug: "corona-paz",
    name: "Paz",
    category: "Primera Comunión",
    kind: "Corona",
    productType: "ACCESSORY",
    description: "Corona de hojas marfil con pequeños puntos de luz.",
    detail: "Paz rodea el peinado con una rama continua de hojas claras y cristales diminutos. Se termina con cintas para adaptar su ajuste.",
    personalization: "Largo de cintas y tono de cristales.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Hojas textiles", "Cristales", "Cintas de ajuste"],
  },
  {
    slug: "tocado-quince",
    name: "Quince",
    category: "XV Años",
    kind: "Tocado",
    productType: "ACCESSORY",
    description: "Tocado de volumen suave con cristales y detalles en tono dorado.",
    detail: "Quince está pensado para brillar con luz propia sin perder delicadeza. Se adapta a peinados recogidos y semirrecogidos.",
    personalization: "Paleta de cristales y acabado metálico.",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Textil satinado", "Cristales", "Base forrada"],
    featured: true,
  },
  {
    slug: "diadema-aurora",
    name: "Aurora",
    category: "Ocasiones especiales",
    kind: "Diadema",
    productType: "ACCESSORY",
    description: "Una diadema de volumen suave, bordada con cristales tono sobre tono.",
    detail: "Aurora aporta textura y luz a celebraciones de día o de noche. Su interior forrado y su volumen equilibrado permiten llevarla cómodamente.",
    personalization: "Color de cristales y altura del volumen.",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Textil satinado", "Cristales", "Base forrada"],
  },
  {
    slug: "lazo-rosa",
    name: "Rosa",
    category: "Ocasiones especiales",
    kind: "Lazo",
    productType: "ACCESSORY",
    description: "Lazo de líneas amplias en rosa empolvado, con caída elegante.",
    detail: "Rosa transforma una coleta o semirrecogido con un gesto femenino y contemporáneo. Su broche permite colocarlo fácilmente.",
    personalization: "Color, tamaño e inicial bordada.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Tela satinada", "Entretela suave", "Broche metálico"],
  },
  {
    slug: "caja-recuerdo-seda",
    name: "Caja de recuerdo Seda",
    category: "Regalos a distancia",
    kind: "Regalo",
    productType: "GIFT",
    description: "Una caja de regalo con accesorio artesanal, dedicatoria y empaque especial.",
    detail: "Una selección pensada para enviar cariño a distancia. Incluye una pieza artesanal, tarjeta personalizada y empaque listo para regalar.",
    personalization: "Dedicatoria, inicial y elección del accesorio.",
    presentation: "Caja rígida con lazo, tarjeta y bolsa de regalo.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Pieza artesanal", "Tarjeta personalizada", "Empaque de regalo"],
    featured: true,
  },
  {
    slug: "set-bautizo-celeste",
    name: "Set bautizo Celeste",
    category: "Regalos a distancia",
    kind: "Set de regalo",
    productType: "GIFT",
    description: "Set de lazo, corona y tarjeta para acompañar un bautizo desde lejos.",
    detail: "Un regalo completo para una celebración especial. Coordinamos los detalles, el empaque y el envío al destino que indiques.",
    personalization: "Nombre, fecha y paleta de colores.",
    presentation: "Caja de regalo con tarjeta y envoltura.",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Lazo artesanal", "Corona", "Tarjeta personalizada"],
  },
  {
    slug: "detalle-corporativo-tul",
    name: "Detalle corporativo Tul",
    category: "Ocasiones especiales",
    kind: "Regalo corporativo",
    productType: "GIFT",
    description: "Detalle institucional personalizado con la identidad de tu empresa.",
    detail: "Creamos detalles corporativos para equipos, clientes y eventos. Se adaptan colores, empaque y mensaje a la identidad de cada marca.",
    personalization: "Logo, colores corporativos y mensaje.",
    presentation: "Empaque institucional y tarjeta corporativa.",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Detalle artesanal", "Empaque institucional", "Tarjeta"],
  },
  {
    slug: "caja-xv-anos",
    name: "Caja XV",
    category: "XV Años",
    kind: "Regalo",
    productType: "GIFT",
    description: "Caja de regalo con accesorio y recuerdos para celebrar los quince.",
    detail: "Una caja pensada para sorprender en una fecha inolvidable. Podés elegir el accesorio, los colores y la dedicatoria.",
    personalization: "Nombre, fecha, colores y accesorio.",
    presentation: "Caja decorada con lazo y tarjeta.",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1100&q=85",
    images: ["https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=85"],
    materials: ["Accesorio artesanal", "Tarjeta", "Empaque especial"],
  },
];

export const processSteps = [
  { number: "01", title: "Elegí la ocasión", text: "Explorá las categorías y encontrá el tipo de accesorio o regalo que acompaña tu celebración." },
  { number: "02", title: "Contanos tu idea", text: "Escribinos por WhatsApp con la fecha, el peinado o la inspiración que tenés en mente." },
  { number: "03", title: "Coordinamos los detalles", text: "Confirmamos disponibilidad, opciones y forma de entrega antes de preparar tu pieza." },
];

export function whatsappUrl(message: string) {
  return `https://wa.me/${demoWhatsAppNumber}?text=${encodeURIComponent(message)}`;
}
