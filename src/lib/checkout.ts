export type CartPricingMode = "FIXED" | "QUOTE";

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  category: string;
  kind?: string;
  pricingMode: CartPricingMode;
  unitPrice: number | null;
  quantity: number;
  note?: string | null;
};

export type CheckoutPaymentMethod = "PayPal" | "Transferencia bancaria" | "Coordinar por WhatsApp";

export type CheckoutCustomer = {
  name: string;
  phone: string;
  email: string;
  location: string;
  delivery: string;
  address: string;
  notes: string;
  paymentMethod: CheckoutPaymentMethod;
};

export function formatMoney(value: number) {
  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function lineTotal(item: CartItem) {
  if (item.pricingMode !== "FIXED" || item.unitPrice === null) return null;
  return item.unitPrice * item.quantity;
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + (lineTotal(item) ?? 0), 0);
}

export function cartQuoteCount(items: CartItem[]) {
  return items
    .filter((item) => item.pricingMode === "QUOTE" || item.unitPrice === null)
    .reduce((total, item) => total + item.quantity, 0);
}

export function hasQuoteItems(items: CartItem[]) {
  return items.some((item) => item.pricingMode === "QUOTE" || item.unitPrice === null);
}

export function buildOrderLines(items: CartItem[]) {
  return items.map((item, index) => {
    const total = lineTotal(item);
    const price =
      total === null
        ? "Cotización"
        : `${formatMoney(item.unitPrice ?? 0)} c/u = ${formatMoney(total)}`;
    const note = item.note?.trim() ? ` — ${item.note.trim()}` : "";
    return `${index + 1}. ${item.name} — ${item.quantity} x ${price}${note}`;
  });
}

export function buildCartInquiryMessage(items: CartItem[]) {
  const subtotal = cartSubtotal(items);
  const quoteCount = cartQuoteCount(items);
  const lines = [
    "Hola Seda y Tul, me interesan estos productos:",
    "",
    ...buildOrderLines(items),
    "",
  ];

  if (subtotal > 0) lines.push(`Subtotal de productos con precio fijo: ${formatMoney(subtotal)}`);
  if (quoteCount > 0) lines.push(`Piezas a cotización: ${quoteCount}`);
  lines.push("", "¿Me ayudan con disponibilidad, entrega y forma de pago?");
  return lines.join("\n");
}

export function buildOrderWhatsAppMessage(items: CartItem[], customer: CheckoutCustomer) {
  const subtotal = cartSubtotal(items);
  const quoteCount = cartQuoteCount(items);
  const lines = [
    "Hola Seda y Tul, quiero realizar este pedido:",
    "",
    ...buildOrderLines(items),
    "",
  ];

  if (subtotal > 0) lines.push(`Subtotal de productos con precio fijo: ${formatMoney(subtotal)}`);
  if (quoteCount > 0) lines.push(`Piezas a cotización: ${quoteCount}`);

  lines.push(
    "",
    "Datos de contacto:",
    `Nombre: ${customer.name}`,
    `WhatsApp: ${customer.phone}`,
  );
  if (customer.email) lines.push(`Correo: ${customer.email}`);
  lines.push(`Ciudad / país: ${customer.location}`, `Entrega: ${customer.delivery}`);
  if (customer.address) lines.push(`Dirección: ${customer.address}`);
  if (customer.notes) lines.push(`Notas: ${customer.notes}`);
  lines.push("", `Forma de pago elegida: ${customer.paymentMethod}`);

  if (customer.paymentMethod === "PayPal") {
    lines.push("Quiero pagar con PayPal. Por favor envíenme el link de pago por este WhatsApp.");
  } else if (quoteCount > 0) {
    lines.push("Solicito la cotización de las piezas indicadas y las opciones de entrega.");
  } else {
    lines.push("Por favor confírmenme disponibilidad y las opciones para completar el pago.");
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function buildWhatsAppCheckoutUrl(number: string, items: CartItem[], customer: CheckoutCustomer) {
  const message = buildOrderWhatsAppMessage(items, customer);
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
