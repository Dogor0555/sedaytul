import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, ProductCard } from "@/components/public/content";
import { PublicShell } from "@/components/public/site-chrome";
import { getPublicCategories, getPublicProducts } from "@/server/repositories/public-catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Accesorios y regalos | Seda y Tul", description: "Accesorios y regalos personalizados hechos a mano en El Salvador." };

const typeFilters = [
  { value: "", label: "Todos" },
  { value: "accesorios", label: "Accesorios" },
  { value: "regalos", label: "Regalos" },
] as const;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ categoria?: string; tipo?: string }> }) {
  const { categoria, tipo } = await searchParams;
  const [categories, products] = await Promise.all([getPublicCategories(), getPublicProducts()]);
  const selected = categories.find((item) => item.slug === categoria);
  const type = tipo === "accesorios" || tipo === "regalos" ? tipo : "";
  const visibleProducts = products.filter((product) => {
    const matchesType = !type || (type === "regalos" ? product.productType === "GIFT" : product.productType !== "GIFT");
    const matchesCategory = !selected || product.category === selected.name;
    return matchesType && matchesCategory;
  });

  return (
    <PublicShell>
      <PageIntro
        eyebrow="Creaciones artesanales"
        title={selected ? selected.name : type === "regalos" ? "Regalos para sorprender" : type === "accesorios" ? "Detalles para recordar" : "Accesorios y regalos con alma"}
        text={selected?.description ?? "Una selección de peinetas, tocados, diademas, coronas, lazos y regalos personalizados para acompañar ocasiones significativas."}
      />

      <div className="mx-auto mb-8 flex max-w-[1400px] flex-wrap justify-center gap-3 px-5 sm:px-8">
        {typeFilters.map((filter) => {
          const params = new URLSearchParams();
          if (filter.value) params.set("tipo", filter.value);
          if (categoria) params.set("categoria", categoria);
          const href = params.toString() ? `/productos?${params.toString()}` : "/productos";
          return (
            <Link
              key={filter.value || "todos"}
              href={href}
              className={`rounded-full px-5 py-2.5 text-[10px] uppercase tracking-[0.16em] transition-colors ${type === filter.value ? "bg-[#423A36] text-white" : "border border-[#D8D1C8] text-[#685B54] hover:bg-[#F7F5F1]"}`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-wrap justify-center gap-x-7 gap-y-3 px-5 pb-14 text-[10px] uppercase tracking-[0.22em]">
        <Link href="/productos" className={!selected ? "border-b border-[#423A36] pb-2" : "pb-2 text-[#857268]"}>Todas las categorías</Link>
        {categories.map((category) => (
          <Link key={category.slug} href={`/productos?categoria=${category.slug}`} className={selected?.slug === category.slug ? "border-b border-[#423A36] pb-2" : "pb-2 text-[#857268]"}>
            {category.name}
          </Link>
        ))}
      </div>

      {visibleProducts.length ? (
        <section className="mx-auto grid max-w-[1400px] gap-x-8 gap-y-14 px-5 pb-28 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-12">
          {visibleProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
        </section>
      ) : (
        <section className="mx-auto max-w-3xl px-5 pb-28 text-center">
          <div className="border border-[#E2DCD4] bg-white px-6 py-14">
            <p className="text-3xl">Todavía no hay piezas publicadas</p>
            <p className="mt-3 font-sans text-sm leading-7 text-[#685B54]">El catálogo se actualizará desde el panel administrativo.</p>
          </div>
        </section>
      )}
    </PublicShell>
  );
}
