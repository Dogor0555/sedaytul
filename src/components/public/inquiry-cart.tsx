"use client";

/* eslint-disable @next/next/no-img-element */

import { Check, MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  buildCartInquiryMessage,
  cartQuoteCount,
  cartSubtotal,
  formatMoney,
  lineTotal,
  type CartItem,
} from "@/lib/checkout";

export type InquiryItem = CartItem;

type InquiryCartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  quoteCount: number;
  whatsappNumber: string;
  addItem: (item: CartItem) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const InquiryCartContext = createContext<InquiryCartContextValue | null>(null);
const storageKey = "sedaytul:cart-items";
const legacyStorageKey = "sedaytul:inquiry-items";

function normalizeItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  if (typeof value.slug !== "string" || typeof value.name !== "string") return null;

  const isFixed = value.pricingMode === "FIXED" && typeof value.unitPrice === "number" && value.unitPrice > 0;
  return {
    slug: value.slug,
    name: value.name,
    image: typeof value.image === "string" ? value.image : "",
    category: typeof value.category === "string" ? value.category : "",
    kind: typeof value.kind === "string" ? value.kind : undefined,
    pricingMode: isFixed ? "FIXED" : "QUOTE",
    unitPrice: isFixed ? Number(value.unitPrice) : null,
    quantity: Math.max(1, Math.floor(Number(value.quantity) || 1)),
    note: typeof value.note === "string" && value.note.trim() ? value.note.trim() : null,
  };
}

export function useInquiryCart() {
  const value = useContext(InquiryCartContext);
  if (!value) throw new Error("useInquiryCart debe usarse dentro de InquiryCartProvider");
  return value;
}

export function buildProductInquiryUrl(number: string, productName: string, slug: string) {
  const message = `Hola Seda y Tul, quisiera consultar por "${productName}".\n${window.location.origin}/productos/${slug}`;
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function InquiryCartProvider({
  whatsappNumber,
  children,
}: {
  whatsappNumber: string;
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey) ?? window.localStorage.getItem(legacyStorageKey);
        if (!stored) return;
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed.map(normalizeItem).filter((item): item is CartItem => Boolean(item)));
        }
      } catch {
        // Si el almacenamiento falla, el carrito sigue funcionando durante la sesión.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const commit = useCallback((next: CartItem[]) => {
    setItems(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      window.localStorage.removeItem(legacyStorageKey);
    } catch {
      // Sin persistencia, el carrito sigue funcionando durante la sesión.
    }
  }, []);

  const addItem = useCallback((item: CartItem) => {
    const normalized = normalizeItem(item);
    if (!normalized) return;
    setItems((current) => {
      const existing = current.find((entry) => entry.slug === normalized.slug);
      const next = existing
        ? current.map((entry) =>
            entry.slug === normalized.slug
              ? {
                  ...entry,
                  quantity: entry.quantity + normalized.quantity,
                  note: normalized.note ?? entry.note,
                }
              : entry,
          )
        : [...current, normalized];
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
        window.localStorage.removeItem(legacyStorageKey);
      } catch {
        // Ignorar almacenamiento no disponible.
      }
      return next;
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    commit(items.filter((item) => item.slug !== slug));
  }, [commit, items]);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      commit(items.filter((item) => item.slug !== slug));
      return;
    }
    commit(items.map((item) => (item.slug === slug ? { ...item, quantity } : item)));
  }, [commit, items]);

  const clear = useCallback(() => commit([]), [commit]);

  const count = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const quoteCount = useMemo(() => cartQuoteCount(items), [items]);

  const value = useMemo<InquiryCartContextValue>(() => ({
    items,
    count,
    subtotal,
    quoteCount,
    whatsappNumber,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    isOpen,
  }), [addItem, clear, count, isOpen, items, quoteCount, removeItem, subtotal, updateQuantity, whatsappNumber]);

  return (
    <InquiryCartContext.Provider value={value}>
      {children}
      <InquiryDrawer />
    </InquiryCartContext.Provider>
  );
}

export function InquiryCartButton({ light = false }: { light?: boolean }) {
  const { count, open } = useInquiryCart();
  return (
    <button
      type="button"
      onClick={open}
      className={`relative grid size-11 place-items-center rounded-full border transition-colors ${light ? "border-white/40 text-white hover:bg-white/10" : "border-[#D8D1C8] text-[#423A36] hover:bg-[#F7F5F1]"}`}
      aria-label={`Abrir carrito (${count} productos)`}
    >
      <ShoppingBag size={18} />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-[#423A36] px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function AddToInquiryButton({
  item,
  compact = false,
}: {
  item: CartItem;
  compact?: boolean;
}) {
  const { addItem, items } = useInquiryCart();
  const [added, setAdded] = useState(false);
  const inCart = items.some((entry) => entry.slug === item.slug);

  function handleAdd() {
    addItem({ ...item, quantity: item.quantity || 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#D8D1C8] px-3 text-[10px] uppercase tracking-[0.14em] text-[#5f4a45] transition-colors hover:bg-[#F7F5F1]"
        aria-label={`Añadir ${item.name} al carrito`}
      >
        {inCart || added ? <Check size={13} /> : <ShoppingBag size={13} />}
        {inCart || added ? "En el carrito" : "Añadir"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D8D1C8] px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] text-[#5f4a45] transition-colors hover:bg-[#F7F5F1]"
    >
      {inCart || added ? <Check size={14} /> : <ShoppingBag size={14} />}
      {inCart || added ? "En el carrito" : "Añadir al carrito"}
    </button>
  );
}

function InquiryDrawer() {
  const { items, isOpen, close, removeItem, updateQuantity, clear, whatsappNumber, subtotal, quoteCount } = useInquiryCart();

  const whatsappUrl = useMemo(() => {
    const message = items.length
      ? buildCartInquiryMessage(items)
      : "Hola Seda y Tul, quisiera recibir información sobre sus accesorios y regalos.";
    return `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  }, [items, whatsappNumber]);

  return (
    <div className={`fixed inset-0 z-[80] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={close}
        className={`absolute inset-0 bg-[#2f2422]/35 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute inset-y-0 right-0 flex w-[min(92vw,440px)] flex-col bg-white shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Carrito de compras"
      >
        <div className="flex items-start justify-between border-b border-[#E6E0D8] px-5 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#9B7654]">Tu pedido</p>
            <h2 className="mt-1 font-serif text-2xl text-[#3e312f]">Carrito</h2>
            <p className="mt-1 text-xs text-[#857268]">Los pagos y la cotización se coordinan por WhatsApp.</p>
          </div>
          <button type="button" onClick={close} className="grid size-9 place-items-center rounded-full border border-[#D8D1C8]" aria-label="Cerrar">
            <X size={17} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {!items.length ? (
            <div className="mt-12 text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#F5F2EC] text-[#9B7654]"><ShoppingBag size={26} /></span>
              <p className="mt-5 font-serif text-2xl text-[#3e312f]">Tu carrito está vacío</p>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#857268]">Añade las piezas que te gusten y envía tu pedido o cotización por WhatsApp.</p>
              <Link href="/productos" onClick={close} className="mt-6 inline-flex items-center gap-2 bg-[#423A36] px-6 py-3 text-[10px] uppercase tracking-[0.18em] text-white">
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const total = lineTotal(item);
                return (
                  <li key={item.slug} className="grid grid-cols-[76px_1fr] gap-3 rounded-2xl border border-[#E6E0D8] bg-white p-3">
                    <Link href={`/productos/${item.slug}`} onClick={close} className="block">
                      <img src={item.image} alt={item.name} className="size-[76px] rounded-xl bg-[#F5F2EC] object-cover" />
                    </Link>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link href={`/productos/${item.slug}`} onClick={close} className="font-serif text-lg leading-tight text-[#3e312f] hover:text-[#9B7654]">{item.name}</Link>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#9B7654]">{item.kind ?? item.category}</p>
                        </div>
                        <button type="button" onClick={() => removeItem(item.slug)} className="grid size-8 shrink-0 place-items-center rounded-full text-[#857268] hover:bg-red-50 hover:text-red-700" aria-label={`Quitar ${item.name}`}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center rounded-full border border-[#D8D1C8]">
                          <button type="button" onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="grid size-8 place-items-center text-[#685B54]" aria-label={`Quitar una unidad de ${item.name}`}><Minus size={13} /></button>
                          <span className="min-w-7 text-center text-xs font-semibold">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="grid size-8 place-items-center text-[#685B54]" aria-label={`Añadir una unidad de ${item.name}`}><Plus size={13} /></button>
                        </div>
                        <p className="text-xs font-semibold text-[#685B54]">{total === null ? "Cotización" : formatMoney(total)}</p>
                      </div>
                      {item.note ? <p className="mt-1 text-[11px] leading-5 text-[#857268]">{item.note}</p> : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length ? (
          <div className="border-t border-[#E6E0D8] p-5">
            <div className="mb-4 space-y-1.5 text-sm">
              {subtotal > 0 ? <div className="flex items-center justify-between"><span className="text-[#857268]">Subtotal con precio fijo</span><strong>{formatMoney(subtotal)}</strong></div> : null}
              {quoteCount > 0 ? <div className="flex items-center justify-between text-xs text-[#857268]"><span>Piezas a cotización</span><span>{quoteCount}</span></div> : null}
            </div>
            <Link href="/checkout" onClick={close} className="flex w-full items-center justify-center gap-3 bg-[#423A36] px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#655C57]">
              Continuar con el pedido
            </Link>
            <div className="mt-3 flex items-center justify-between text-xs text-[#857268]">
              <span>{items.length} {items.length === 1 ? "producto" : "productos"}</span>
              <div className="flex gap-4">
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold hover:underline"><MessageCircle size={13} /> WhatsApp</a>
                <button type="button" onClick={clear} className="font-semibold hover:underline">Vaciar</button>
              </div>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
