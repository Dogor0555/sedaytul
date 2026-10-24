"use client";

import { useState } from "react";
import { LiveSitePreview } from "@/components/admin/live-site-preview";
import { ContentSectionForm, type ContentSection } from "./content-section-form";

export function ContentEditor({ initialSections }: { initialSections: ContentSection[] }) {
  const [sections, setSections] = useState(initialSections);

  function updateSection(key: ContentSection["key"], values: Partial<ContentSection>) {
    setSections((current) => current.map((section) => (
      section.key === key ? { ...section, ...values } : section
    )));
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(390px,0.82fr)]">
      <div className="space-y-5">
        {sections.map((section) => (
          <ContentSectionForm
            key={section.key}
            section={section}
            onChange={(values) => updateSection(section.key, values)}
          />
        ))}
      </div>
      <LiveSitePreview sections={sections.map((section) => ({
        ...section,
        image: section.image?.url ?? null,
      }))} />
    </div>
  );
}
