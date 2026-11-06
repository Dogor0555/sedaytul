"use client";

import { useEffect } from "react";

type PreviewSection = {
  key: "hero" | "accesorios" | "regalos" | "personalizados" | "corporativos" | "historia" | "tips" | "pagos" | "contacto";
  title: string;
  subtitle: string;
  body: string;
  backgroundColor: string;
  image: string | null;
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
        root.style.display = section.visible ? "" : "none";
        root.style.backgroundColor = section.backgroundColor || "";
        const eyebrow = root.querySelector<HTMLElement>('[data-preview-field="subtitle"]');
        const title = root.querySelector<HTMLElement>('[data-preview-field="title"]');
        const body = root.querySelector<HTMLElement>('[data-preview-field="body"]');
        const image = root.querySelector<HTMLImageElement>('[data-preview-field="image"]');

        if (eyebrow) updateEyebrow(eyebrow, section.subtitle);
        if (title) updateTitle(title, section.title);
        if (body) body.textContent = section.body;
        if (image && section.image) image.src = section.image;
      }

    }

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return null;
}
