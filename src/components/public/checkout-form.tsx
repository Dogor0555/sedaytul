"use client";

/* eslint-disable @next/next/no-img-element */

import { ArrowLeft, Check, MessageCircle, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { useInquiryCart } from "@/components/public/inquiry-cart";
import {
  buildWhatsAppCheckoutUrl,
  cartQuoteCount,
  cartSubtotal,
  formatMoney,
  lineTotal,
  type CheckoutCustomer,
} from "@/lib/checkout";

const paymentOptions = ["PayPal", "Transferencia bancaria", "Coordinar por WhatsApp"] as const;

const inputClass =
  "w-full rounded-xl border border-[#DED8D0] bg-white px-3.5 py-3 text-sm outline-none transition-colors focus:border-[#9B7654]";
const labelClass =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f827d]";

export function CheckoutForm({
  whatsappNumber,
  paymentMethods,
}: {
  whatsappNumber: string;
  paymentMethods: string[];
}) {
  const { items, updateQuantity, removeItem, clear } = useInquiryCart();
  const [paymentMethod, setPaymentMethod] = useState<CheckoutCustomer["paymentMethod"]>("PayPal");
  const [sent, setSent] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    delivery: "Envío nacional",
    address: "",
    notes: "",
  });

  const quoteCount = useMemo(() => cartQuoteCount(items), [items]);
  const total = useMemo(() => cartSubtotal(items), [items]);
  const hasItems = items.length > 0;

  function updateField(field: keyof typeof customer, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasItems) return;
    const url = buildWhatsAppCheckoutUrl(whatsappNumber, items, {
      ...customer,
      paymentMethod,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  if (!hasItems) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#9B7654]">Tu pedido</p>
        <h1 className="mt-5 font-serif text-5xl text-[#423A36]">Tu carrito está vacío</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#685B54]">
          Añadí accesorios o regalos al carrito para enviar tu pedido o solicitar una cotización por WhatsApp.
        </p>
        <Link href="/productos" className="mt-8 inline-flex items-center gap-3 bg-[#423A36] px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-white">
          <ArrowLeft size={14} /> Explorar catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1250px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="mb-10">
        <Link href="/productos" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#857268] hover:text-[#423A36]">
          <ArrowLeft size={14} /> Seguir comprando
        </Link>
        <p className="mt-8 text-[10px] uppercase tracking-[0.34em] text-[#9B7654]">Finalizar pedido</p>
        <h1 className="mt-4 font-serif text-5xl leading-tight text-[#423A36] sm:text-6xl">Revisá tu pedido</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#685B54]">
          Completá tus datos y enviá el resumen por WhatsApp. Desde ahí coordinamos la disponibilidad, la entrega y el pago con PayPal o el método que elijas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid items-start gap-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <div className="border border-[#E2DCD4] bg-white p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl text-[#423A36]">Productos</h2>
              <button type="button" onClick={clear} className="text-xs font-semibold text-[#857268] hover:underline">Vaciar carrito</button>
            </div>
            <ul className="mt-5 divide-y divide-[#EDE8E2]">
              {items.map((item) => {
                const itemTotal = lineTotal(item);
                return (
                  <li key={item.slug} className="grid grid-cols-[72px_1fr] gap-4 py-4 first:pt-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="size-[72px] rounded-xl bg-[#F5F2EC] object-cover" />
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-xl leading-tight text-[#423A36]">{item.name}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#9B7654]">{item.kind ?? item.category}</p>
                        </div>
                        <button type="button" onClick={() => removeItem(item.slug)} className="grid size-8 place-items-center rounded-full text-[#857268] hover:bg-red-50 hover:text-red-700" aria-label={`Quitar ${item.name}`}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center rounded-full border border-[#D8D1C8]">
                          <button type="button" onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="grid size-8 place-items-center text-[#685B54]" aria-label={`Quitar una unidad de ${item.name}`}><Minus size={13} /></button>
                          <span className="min-w-7 text-center text-xs font-semibold">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="grid size-8 place-items-center text-[#685B54]" aria-label={`Añadir una unidad de ${item.name}`}><Plus size={13} /></button>
                        </div>
                        <p className="text-sm font-semibold text-[#685B54]">
                          {itemTotal === null ? "Cotización" : formatMoney(itemTotal)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border border-[#E2DCD4] bg-white p-5 sm:p-7">
            <h2 className="font-serif text-2xl text-[#423A36]">Datos de contacto</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className={labelClass}>Nombre completo</span>
                <input required value={customer.name} onChange={(event) => updateField("name", event.target.value)} maxLength={100} className={inputClass} placeholder="Nombre y apellido" />
              </label>
              <label>
                <span className={labelClass}>WhatsApp</span>
                <input required value={customer.phone} onChange={(event) => updateField("phone", event.target.value)} maxLength={30} inputMode="tel" className={inputClass} placeholder="+503 0000 0000" />
              </label>
              <label>
                <span className={labelClass}>Correo <span className="font-normal text-[#a79b95]">(opcional)</span></span>
                <input type="email" value={customer.email} onChange={(event) => updateField("email", event.target.value)} maxLength={120} className={inputClass} placeholder="tu@correo.com" />
              </label>
              <label>
                <span className={labelClass}>Ciudad y país</span>
                <input required value={customer.location} onChange={(event) => updateField("location", event.target.value)} maxLength={120} className={inputClass} placeholder="San Salvador, El Salvador" />
              </label>
              <label>
                <span className={labelClass}>Tipo de entrega</span>
                <select value={customer.delivery} onChange={(event) => updateField("delivery", event.target.value)} className={`${inputClass} appearance-none`}>
                  <option>Envío nacional</option>
                  <option>Envío internacional</option>
                  <option>Entrega coordinada</option>
                  <option>Retiro a coordinar</option>
                </select>
              </label>
              <label className="sm:col-span-2">
                <span className={labelClass}>Dirección de entrega</span>
                <input value={customer.address} onChange={(event) => updateField("address", event.target.value)} maxLength={300} className={inputClass} placeholder="Dirección completa o referencia" />
              </label>
              <label className="sm:col-span-2">
                <span className={labelClass}>Notas del pedido</span>
                <textarea value={customer.notes} onChange={(event) => updateField("notes", event.target.value)} maxLength={1000} className={`${inputClass} min-h-28 resize-y py-3`} placeholder="Colores, nombres, fecha de la celebración, dedicatoria o cualquier detalle para tu cotización." />
              </label>
            </div>
          </div>

          <div className="border border-[#E2DCD4] bg-white p-5 sm:p-7">
            <h2 className="font-serif text-2xl text-[#423A36]">Forma de pago</h2>
            <p className="mt-1 text-xs leading-6 text-[#857268]">No se procesa ningún pago en este sitio. Al enviar el pedido, abriremos WhatsApp para coordinar el pago.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {paymentOptions.map((option) => (
                <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${paymentMethod === option ? "border-[#9B7654] bg-[#FAF8F4]" : "border-[#E2DCD4] bg-white hover:bg-[#FAF8F4]"}`}>
                  <input type="radio" name="paymentMethod" value={option} checked={paymentMethod === option} onChange={() => setPaymentMethod(option)} className="mt-0.5 size-4 accent-[#9B7654]" />
                  <span className="text-sm font-medium text-[#50423f]">{option}</span>
                </label>
              ))}
            </div>
            {paymentMethods.length ? <p className="mt-4 text-[11px] text-[#978a85]">Métodos disponibles: {paymentMethods.join(" · ")}</p> : null}
          </div>
        </div>

        <aside className="border border-[#E2DCD4] bg-[#FAF8F4] p-6 lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl text-[#423A36]">Resumen</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4"><span className="text-[#857268]">Productos con precio fijo</span><strong>{formatMoney(total)}</strong></div>
            {quoteCount > 0 ? (
              <div className="flex items-center justify-between gap-4"><span className="text-[#857268]">Piezas a cotización</span><span>{quoteCount}</span></div>
            ) : null}
            <div className="border-t border-[#E2DCD4] pt-3">
              <div className="flex items-center justify-between gap-4"><span className="font-semibold">Subtotal</span><strong>{formatMoney(total)}</strong></div>
              {quoteCount > 0 ? <p className="mt-2 text-xs leading-5 text-[#857268]">El valor de las piezas a cotización se confirma por WhatsApp.</p> : null}
            </div>
          </div>

          <button type="submit" className="mt-6 flex w-full items-center justify-center gap-3 bg-[#423A36] px-6 py-4 text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#655C57]">
            <MessageCircle size={16} />
            {paymentMethod === "PayPal" ? "Enviar pedido y pagar con PayPal" : quoteCount > 0 ? "Solicitar cotización por WhatsApp" : "Enviar pedido por WhatsApp"}
          </button>

          <p className="mt-4 text-center text-[11px] leading-5 text-[#857268]">
            {paymentMethod === "PayPal"
              ? "Te enviaremos el link de pago de PayPal por WhatsApp junto con la confirmación de tu pedido."
              : "Coordinamos disponibilidad, entrega y pago directamente por WhatsApp."}
          </p>

          {sent ? (
            <p role="status" className="mt-4 flex items-start gap-2 rounded-xl bg-white p-3 text-xs leading-5 text-[#52664e]">
              <Check size={15} className="mt-0.5 shrink-0" />
              Abrimos WhatsApp con el resumen. Si no se abrió, revisá el bloqueo de ventanas emergentes.
            </p>
          ) : null}
        </aside>
      </form>
    </section>
  );
}
