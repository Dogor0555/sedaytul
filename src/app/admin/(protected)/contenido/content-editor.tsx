"use client";

import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { Panel } from "@/components/admin/admin-ui";
import { LiveSitePreview } from "@/components/admin/live-site-preview";
import { ContentSectionForm, type ContentSection } from "./content-section-form";
import { restoreContentSection } from "./actions";

export type DeletedContentSection = {
  key: ContentSection["key"];
  label: string;
};

function RestoreSectionButton({ section }: { section: DeletedContentSection }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRestore() {
    setError(null);
    setPending(true);
    try {
      const result = await restoreContentSection(section.key);
      if (result.status === "error") {
        setError(result.message ?? "No se pudo restaurar la sección.");
        return;
      }
      window.location.reload();
    } catch {
      setError("Ocurrió un error al restaurar la sección.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleRestore}
        disabled={pending}
        className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-[#ded5d0] bg-white px-3 py-1.5 text-xs font-semibold text-[#4e403d] transition hover:border-[#c6b6ae] hover:bg-[#fcfaf8] disabled:cursor-wait disabled:opacity-60"
      >
        <RotateCcw className="size-3.5" />{pending ? "Restaurando..." : "Restaurar"}
      </button>
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
    </div>
  );
}

export function ContentEditor({
  initialSections,
  initialDeletedSections = [],
}: {
  initialSections: ContentSection[];
  initialDeletedSections?: DeletedContentSection[];
}) {
  const [sections, setSections] = useState(initialSections);
  const [deletedKeys, setDeletedKeys] = useState(() => new Set(initialDeletedSections.map((section) => section.key)));
  const activeSections = sections.filter((section) => !deletedKeys.has(section.key));
  const deletedSections = sections
    .filter((section) => deletedKeys.has(section.key))
    .map((section) => ({ key: section.key, label: section.label }));

  function updateSection(key: ContentSection["key"], values: Partial<ContentSection>) {
    setSections((current) => current.map((section) => (
      section.key === key ? { ...section, ...values } : section
    )));
  }

  function deleteSection(key: ContentSection["key"]) {
    setDeletedKeys((current) => {
      const next = new Set(current);
      next.add(key);
      return next;
    });
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(390px,0.82fr)]">
      <div className="space-y-5">
        {activeSections.map((section) => (
          <ContentSectionForm
            key={section.key}
            section={section}
            onChange={(values) => updateSection(section.key, values)}
            onDelete={deleteSection}
          />
        ))}

        {deletedSections.length ? (
          <Panel className="overflow-hidden">
            <div className="flex items-start gap-3 border-b border-[#ece5e1] p-5 sm:items-center sm:px-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#f2e6e0] text-[#8e615c]"><Trash2 className="size-[18px]" /></span>
              <div>
                <h2 className="font-serif text-xl text-[#3e312f]">Secciones eliminadas</h2>
                <p className="mt-1 text-xs leading-5 text-[#8d807c]">No se muestran en el sitio. Podés restaurarlas cuando quieras.</p>
              </div>
            </div>
            <ul className="divide-y divide-[#ece5e1]">
              {deletedSections.map((section) => (
                <li key={section.key} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                  <span className="text-sm font-semibold text-[#4e403d]">{section.label}</span>
                  <RestoreSectionButton section={section} />
                </li>
              ))}
            </ul>
          </Panel>
        ) : null}
      </div>
      <LiveSitePreview sections={sections.map((section) => ({
        ...section,
        visible: deletedKeys.has(section.key) ? false : section.visible,
        image: section.image?.url ?? null,
      }))} />
    </div>
  );
}
