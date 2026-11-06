"use client";

import { MessageCircle, Send } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

export function ContactForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const whatsappUrl = useMemo(() => {
    const lines = [
      `Hola Seda y Tul, soy ${name || "..."}.`,
      occasion ? `Me interesa consultar por: ${occasion}.` : "Quisiera hacer una consulta.",
      date ? `La fecha de mi celebración es: ${date}.` : "",
      message ? `Detalles: ${message}` : "",
    ].filter(Boolean);
    return `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [date, message, name, occasion, whatsappNumber]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#E2DCD4] bg-white p-6 sm:p-9">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-[#F5F2EC] text-[#9B7654]"><MessageCircle size={19} strokeWidth={1.5} /></span>
        <div>
          <h2 className="font-serif text-2xl text-[#3e312f]">Contanos tu idea</h2>
          <p className="mt-1 text-xs text-[#857268]">Completá el formulario y te responderemos por WhatsApp.</p>
        </div>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f827d]">Tu nombre</span>
          <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} className="w-full rounded-xl border border-[#ded3cd] bg-[#FCFAF8] px-3.5 py-3 text-sm outline-none focus:border-[#9B7654]" placeholder="Nombre y apellido" />
        </label>
        <label>
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f827d]">¿Qué buscás?</span>
          <select value={occasion} onChange={(event) => setOccasion(event.target.value)} required className="w-full rounded-xl border border-[#ded3cd] bg-[#FCFAF8] px-3.5 py-3 text-sm outline-none focus:border-[#9B7654]">
            <option value="">Seleccioná una opción</option>
            <option>Accesorio para novia</option>
            <option>Bautizo</option>
            <option>Primera comunión</option>
            <option>XV años</option>
            <option>Regalo a distancia</option>
            <option>Regalo corporativo</option>
            <option>Otra ocasión especial</option>
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f827d]">Fecha de la celebración</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-xl border border-[#ded3cd] bg-[#FCFAF8] px-3.5 py-3 text-sm outline-none focus:border-[#9B7654]" />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f827d]">Tu mensaje</span>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1000} className="min-h-28 w-full resize-y rounded-xl border border-[#ded3cd] bg-[#FCFAF8] px-3.5 py-3 text-sm outline-none focus:border-[#9B7654]" placeholder="Contanos colores, nombres, cantidad de piezas o cualquier detalle que tengas en mente." />
        </label>
      </div>
      <button type="submit" className="mt-5 inline-flex items-center gap-2 bg-[#423A36] px-6 py-3.5 text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#655C57]">
        <Send size={14} /> Enviar consulta por WhatsApp
      </button>
      {sent ? <p className="mt-3 text-xs text-[#52664e]">Abrimos WhatsApp con tu consulta. Si no se abrió, revisá el bloqueo de ventanas emergentes.</p> : null}
    </form>
  );
}
