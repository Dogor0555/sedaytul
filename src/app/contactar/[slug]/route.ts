import { redirect } from "next/navigation";
import { demoWhatsAppNumber } from "@/config/demo-content";
import { db } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    db.product.findFirst({ where: { slug, status: "PUBLISHED" }, select: { id: true, name: true } }),
    db.siteSettings.findUnique({ where: { id: "main" }, select: { whatsappNumber: true } }),
  ]);
  if (!product) redirect("/productos");

  await db.contactEvent.create({
    data: { productId: product.id, sourcePage: `/productos/${slug}`, eventType: "WHATSAPP_CLICK" },
  });
  const message = `Hola Seda y Tul, quisiera consultar por "${product.name}". ¿Me pueden ayudar con precio, disponibilidad y entrega?`;
  const number = (settings?.whatsappNumber ?? demoWhatsAppNumber).replace(/\D/g, "");
  redirect(`https://wa.me/${number}?text=${encodeURIComponent(message)}`);
}
