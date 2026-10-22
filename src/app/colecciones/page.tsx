import type { Metadata } from "next";
import { CollectionCard, PageIntro } from "@/components/public/content";
import { PublicShell } from "@/components/public/site-chrome";
import { getPublicCategories } from "@/server/repositories/public-catalog";

export const metadata: Metadata = {
  title: "Categorías | Seda y Tul",
  description: "Accesorios artesanales para novias, bautizos, primeras comuniones y ocasiones especiales.",
};

export default async function CategoriesPage() {
  const categories = await getPublicCategories();
  return <PublicShell><PageIntro eyebrow="Para cada celebración" title="Detalles con un significado propio" text="Descubrí accesorios artesanales pensados para acompañar momentos importantes con sutileza y personalidad." /><section className="mx-auto max-w-[1250px] space-y-24 px-5 pb-28 sm:px-8 lg:space-y-36">{categories.map((category, index) => <CollectionCard key={category.slug} collection={category} index={index} />)}</section></PublicShell>;
}
