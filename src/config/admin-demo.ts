export type ProductStatus = "Publicado" | "Borrador" | "Por encargo";

export type Product = {
  id: string;
  name: string;
  category: string;
  price?: number;
  showPrice: boolean;
  quantity: number;
  status: ProductStatus;
  color: string;
  accent: string;
};

export const adminStats = [
  { label: "Productos activos", value: "24", change: "+3 este mes", tone: "rose" },
  { label: "Piezas disponibles", value: "38", change: "6 se elaboran por encargo", tone: "sand" },
  { label: "Categorías", value: "6", change: "Todas visibles", tone: "sage" },
  { label: "Imágenes", value: "92", change: "+14 esta semana", tone: "lilac" },
] as const;

export const products: Product[] = [
  { id: "ST-024", name: "Peineta Azahar", category: "Peinetas", price: 48, showPrice: false, quantity: 4, status: "Publicado", color: "#d8aaa8", accent: "#f7e9e5" },
  { id: "ST-023", name: "Tocado Magnolia", category: "Tocados", price: 62, showPrice: false, quantity: 2, status: "Publicado", color: "#c8b6a6", accent: "#f4eee8" },
  { id: "ST-022", name: "Diadema Perla", category: "Diademas", showPrice: false, quantity: 3, status: "Publicado", color: "#aeb8a0", accent: "#e8ece2" },
  { id: "ST-021", name: "Corona Primera Luz", category: "Coronas", price: 38, showPrice: false, quantity: 0, status: "Por encargo", color: "#b79a8c", accent: "#eee2dc" },
  { id: "ST-020", name: "Lazo Bautizo Celeste", category: "Lazos", price: 24, showPrice: false, quantity: 5, status: "Borrador", color: "#b6a8bc", accent: "#eee8f0" },
  { id: "ST-019", name: "Tocado Flor de Nácar", category: "Tocados", showPrice: false, quantity: 1, status: "Por encargo", color: "#c7aa86", accent: "#f3e8d7" },
];

export const categories = [
  { name: "Peinetas", description: "Detalles artesanales para peinados de novia.", products: 7, visible: true, color: "#d8aaa8" },
  { name: "Tocados", description: "Flores, perlas y cristales trabajados a mano.", products: 6, visible: true, color: "#c8b6a6" },
  { name: "Diademas", description: "Piezas delicadas para celebraciones especiales.", products: 4, visible: true, color: "#aeb8a0" },
  { name: "Coronas", description: "Diseños para bautizos y primeras comuniones.", products: 4, visible: true, color: "#b79a8c" },
  { name: "Lazos", description: "Lazos personalizados para niñas y ocasiones especiales.", products: 3, visible: true, color: "#b6a8bc" },
];

export const galleryItems = [
  { id: 1, name: "peineta-azahar.jpg", size: "1.8 MB", color: "#d8aaa8", accent: "#f8e7df" },
  { id: 2, name: "tocado-magnolia.jpg", size: "1.2 MB", color: "#9c8177", accent: "#e8d8d0" },
  { id: 3, name: "diadema-perlas.jpg", size: "2.1 MB", color: "#b7ad91", accent: "#efeadb" },
  { id: 4, name: "corona-primera-comunion.jpg", size: "980 KB", color: "#c7b8a5", accent: "#f5eee5" },
  { id: 5, name: "detalle-flor-artesanal.jpg", size: "1.5 MB", color: "#a58c91", accent: "#ede1e3" },
  { id: 6, name: "lazos-bautizo.jpg", size: "2.4 MB", color: "#9faa9a", accent: "#e4eae0" },
  { id: 7, name: "tocado-novia-nacar.jpg", size: "1.9 MB", color: "#a5826f", accent: "#ead8ce" },
  { id: 8, name: "empaque-seda-tul.jpg", size: "860 KB", color: "#b6a8bc", accent: "#eee8f0" },
];

export const recentActivity = [
  { title: "Peineta Azahar actualizada", detail: "Disponibilidad y detalles", time: "Hace 18 min", initials: "MV" },
  { title: "6 fotografías añadidas", detail: "Accesorios para novias", time: "Hace 2 h", initials: "AL" },
  { title: "Categoría Coronas publicada", detail: "Catálogo principal", time: "Ayer", initials: "MV" },
  { title: "Texto de inicio editado", detail: "Banner principal", time: "20 oct", initials: "CR" },
];

export const contentSections = [
  { title: "Portada", description: "Mensaje principal, imagen y llamada a la acción.", status: "Publicado", updated: "Hoy, 10:42" },
  { title: "Nuestra historia", description: "Origen de la marca, proceso y valores.", status: "Publicado", updated: "18 oct, 16:20" },
  { title: "Accesorios destacados", description: "Selección artesanal visible en inicio.", status: "Borrador", updated: "17 oct, 09:15" },
  { title: "Guía de cuidados", description: "Recomendaciones para conservar cada accesorio.", status: "Publicado", updated: "12 oct, 12:08" },
];

export const users = [
  { name: "Ivon Mena de Castro", email: "ivon@sedaytul.com", role: "Administradora", status: "Activo", initials: "IM", lastSeen: "Ahora" },
  { name: "Ana Lozano", email: "ana@sedaytul.com", role: "Editora", status: "Activo", initials: "AL", lastSeen: "Hace 2 h" },
  { name: "Clara Ruiz", email: "clara@sedaytul.com", role: "Editora", status: "Activo", initials: "CR", lastSeen: "Ayer" },
  { name: "Sofía Mora", email: "sofia@sedaytul.com", role: "Fotografía", status: "Invitación", initials: "SM", lastSeen: "Pendiente" },
];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
