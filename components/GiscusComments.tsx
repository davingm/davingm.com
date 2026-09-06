"use client";

import { useEffect, useRef } from "react";

const GISCUS_REPO = "nairha/davingm.com";
const GISCUS_REPO_ID = "R_kgDOUPbFqQ";

const labels = {
  zh: "评论",
  en: "Comments",
  id: "Komentar",
} as const;

export function GiscusComments({ lang }: { lang: "zh" | "en" | "id" }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", GISCUS_REPO);
    script.setAttribute("data-repo-id", GISCUS_REPO_ID);
    script.setAttribute("data-category", "General");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", lang === "zh" ? "zh-CN" : lang);
    script.setAttribute("data-loading", "lazy");
    container.appendChild(script);
  }, [lang]);

  return (
    <section className="mt-16 border-t border-[var(--color-border)] pt-8" aria-label={labels[lang]}>
      <h2 className="mb-6 text-sm font-bold text-[var(--color-heading)]">{labels[lang]}</h2>
      <div ref={containerRef} className="giscus-container min-h-24" />
    </section>
  );
}