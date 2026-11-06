import type { Metadata } from "next";
import { CheckoutForm } from "@/components/public/checkout-form";
import { PublicShell } from "@/components/public/site-chrome";
import { getPublicSettings } from "@/server/repositories/public-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finalizar pedido | Seda y Tul",
  description: "Revisá tu carrito y enviá el resumen de tu pedido por WhatsApp.",
};

export default async function CheckoutPage() {
  const settings = await getPublicSettings();

  return (
    <PublicShell>
      <CheckoutForm
        whatsappNumber={settings.whatsappNumber}
        paymentMethods={settings.paymentMethods.split("\n").map((item) => item.trim()).filter(Boolean)}
      />
    </PublicShell>
  );
}
