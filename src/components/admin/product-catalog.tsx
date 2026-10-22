"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { Grid2X2, List, MoreHorizontal, Search, SlidersHorizontal } from "lucide-react";
import { Panel, ProductVisual, StatusBadge, inputClass } from "./admin-ui";

type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  status: string;
  availability: string;
  price: number | null;
  showPrice: boolean;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" }).format(value);

export function ProductCatalog({ products, categories }: { products: CatalogProduct[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [view, setView] = useState<"list" | "grid">("list");
  const deferredQuery = useDeferredValue(query);
  const filtered = products.filter((product) =>
    (category === "Todas" || product.category === category) &&
    product.name.toLowerCase().includes(deferredQuery.toLowerCase()),
  );

  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[#ece5e1] p-4 sm:flex-row sm:items-center sm:p-5">
        <label className="relative flex-1">
          <span className="sr-only">Buscar productos</span>
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9c8f8a]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className={`${inputClass} pl-10`} placeholder="Buscar por nombre..." />
        </label>
        <label className="relative sm:w-44">
          <span className="sr-only">Filtrar categoría</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className={`${inputClass} appearance-none pr-9`}>
            {["Todas", ...categories].map((item) => <option key={item}>{item}</option>)}
          </select>
          <SlidersHorizontal className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9c8f8a]" />
        </label>
        <div className="flex rounded-xl border border-[#ded5d0] bg-[#f8f5f3] p-1">
          <button onClick={() => setView("list")} className={`grid size-8 place-items-center rounded-lg ${view === "list" ? "bg-white text-[#7d5651] shadow-sm" : "text-[#9c8e89]"}`} aria-label="Vista de lista"><List className="size-4" /></button>
          <button onClick={() => setView("grid")} className={`grid size-8 place-items-center rounded-lg ${view === "grid" ? "bg-white text-[#7d5651] shadow-sm" : "text-[#9c8e89]"}`} aria-label="Vista de tarjetas"><Grid2X2 className="size-4" /></button>
        </div>
      </div>

      {view === "list" ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-[#fbf9f7] text-[10px] font-bold uppercase tracking-[0.14em] text-[#948681]"><tr><th className="px-5 py-3.5">Producto</th><th className="px-4 py-3.5">Categoría</th><th className="px-4 py-3.5">Estado</th><th className="px-4 py-3.5">Disponibilidad</th><th className="px-4 py-3.5 text-right">Precio público</th><th className="w-14"><span className="sr-only">Acciones</span></th></tr></thead>
            <tbody className="divide-y divide-[#f0ebe8]">
              {filtered.map((product, index) => <tr key={product.id} className="transition hover:bg-[#fdfaf8]"><td className="px-5 py-3"><div className="flex items-center gap-3"><ProductVisual color={index % 2 ? "#c7ad8c" : "#d5b6ae"} accent="#f5ebe6" className="size-12 rounded-xl" /><div><Link href="#" className="text-sm font-semibold text-[#493b38] hover:text-[#946762]">{product.name}</Link><p className="mt-0.5 text-[11px] text-[#9a8d88]">{product.id.slice(-8).toUpperCase()}</p></div></div></td><td className="px-4 py-3 text-sm text-[#716562]">{product.category}</td><td className="px-4 py-3"><StatusBadge status={product.status} /></td><td className="px-4 py-3 text-sm font-semibold text-[#5b504d]">{product.availability}</td><td className="px-4 py-3 text-right text-xs font-semibold text-[#887b77]">{product.showPrice && product.price !== null ? formatCurrency(product.price) : "Oculto"}</td><td><button className="grid size-9 place-items-center rounded-lg text-[#948681] hover:bg-[#f2e9e5]" aria-label={`Acciones de ${product.name}`}><MoreHorizontal className="size-4" /></button></td></tr>)}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product, index) => <article key={product.id} className="overflow-hidden rounded-2xl border border-[#e9e1dd]"><ProductVisual color={index % 2 ? "#c7ad8c" : "#d5b6ae"} accent="#f5ebe6" className="aspect-[4/2.7] w-full" /><div className="p-4"><div className="flex items-start justify-between"><div><h3 className="font-semibold text-[#493b38]">{product.name}</h3><p className="mt-1 text-xs text-[#948681]">{product.category} · {product.availability}</p></div><StatusBadge status={product.status} /></div><p className="mt-4 text-xs font-semibold text-[#887b77]">{product.showPrice && product.price !== null ? formatCurrency(product.price) : "Precio oculto"}</p></div></article>)}
        </div>
      )}
      {filtered.length === 0 && <div className="px-5 py-16 text-center"><p className="font-serif text-xl text-[#574744]">No encontramos productos</p><p className="mt-2 text-sm text-[#91847f]">Prueba con otro nombre o categoría.</p></div>}
      <div className="flex items-center justify-between border-t border-[#ece5e1] px-5 py-3 text-xs text-[#8e817d]"><span>{filtered.length} de {products.length} productos</span><span>Página 1 de 1</span></div>
    </Panel>
  );
}
