"use client";

import { useEffect } from "react";

type PreviewSection = {
  key: "hero" | "artesanal" | "historia" | "contacto";
  title: string;
  subtitle: string;
  body: string;
  visible: boolean;
  sortOrder: number;
};

type PreviewMessage = {
  type: "sedaytul:content-preview";
  sections: PreviewSection[];
};

function updateEyebrow(element: HTMLElement, value: string) {
  const line = element.querySelector("span");
  element.replaceChildren();
  if (line) element.append(line);
  element.append(document.createTextNode(value));
}

function updateTitle(element: HTMLElement, value: string) {
  const indentSecondLine = element.dataset.previewIndent === "true";
  const lines = value.split("\n");
  element.replaceChildren(...lines.map((line, index) => {
    const span = document.createElement("span");
    span.textContent = line;
    span.className = `block ${index > 0 ? "font-normal italic" : ""} ${
      indentSecondLine && index === 1 ? "ml-[9%]" : ""
    }`;
    return span;
  }));
}

export function LivePreviewBridge() {
  useEffect(() => {
    if (window.parent === window) return;

    function handleMessage(event: MessageEvent<PreviewMessage>) {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type !== "sedaytul:content-preview" || !Array.isArray(event.data.sections)) return;

      for (const section of event.data.sections) {
        const root = document.querySelector<HTMLElement>(`[data-preview-section="${section.key}"]`);
        if (!root) continue;

        root.hidden = !section.visible;
        const eyebrow = root.querySelector<HTMLElement>('[data-preview-field="subtitle"]');
        const title = root.querySelector<HTMLElement>('[data-preview-field="title"]');
        const body = root.querySelector<HTMLElement>('[data-preview-field="body"]');

        if (eyebrow) updateEyebrow(eyebrow, section.subtitle);
        if (title) updateTitle(title, section.title);
        if (body) body.textContent = section.body;
      }

      const orderedMiddleSections = event.data.sections
        .filter((section) => section.key === "artesanal" || section.key === "historia")
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((section) => document.querySelector<HTMLElement>(`[data-preview-section="${section.key}"]`))
        .filter((section): section is HTMLElement => Boolean(section));

      if (orderedMiddleSections.length === 2) {
        const [first, second] = orderedMiddleSections;
        if (first.parentElement === second.parentElement) second.before(first);
      }
    }

    function preventPreviewNavigation(event: MouseEvent) {
      if (event.target instanceof Element && event.target.closest("a")) event.preventDefault();
    }

    window.addEventListener("message", handleMessage);
    document.addEventListener("click", preventPreviewNavigation, true);
    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("click", preventPreviewNavigation, true);
    };
  }, []);

  return null;
}
