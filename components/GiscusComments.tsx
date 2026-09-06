"use client";

import { useEffect, useRef } from "react";

const GISCUS_REPO = "nairha/davingm.com";
const GISCUS_REPO_ID = "R_kgDOUPbFqQ";
const GISCUS_CATEGORY_ID = "DIC_kwDOUPbFqc4DE_aJ";

const labels = {
  zh: "评论",
  en: "Comments",
  id: "Komentar",
} as const;

export function GiscusComments({ lang }: { lang: "zh" | "en" | "id" }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getTheme = () =>
      document.documentElement.classList.contains("dark") ? "dark" : "light";

    const mountGiscus = (theme: string) => {
      container.replaceChildren();

      const script = document.createElement("script");
      script.src = "https://giscus.app/client.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.setAttribute("data-repo", GISCUS_REPO);
      script.setAttribute("data-repo-id", GISCUS_REPO_ID);
      script.setAttribute("data-category", "General");
      script.setAttribute("data-category-id", GISCUS_CATEGORY_ID);
      script.setAttribute("data-mapping", "specific");
      script.setAttribute(
        "data-term",
        window.location.pathname.replace(/^\/(?:zh|en|id)(?=\/|$)/, "") || "/",
      );
      script.setAttribute("data-strict", "0");
      script.setAttribute("data-reactions-enabled", "1");
      script.setAttribute("data-emit-metadata", "0");
      script.setAttribute("data-input-position", "top");
      script.setAttribute("data-theme", theme);
      script.setAttribute("data-lang", "zh-CN");
      script.setAttribute("data-loading", "lazy");
      container.appendChild(script);
    };

    const handleThemeChange = (event?: Event) => {
      const theme = event instanceof CustomEvent && typeof event.detail === "string"
        ? event.detail
        : getTheme();
      mountGiscus(theme);
    };
    mountGiscus(getTheme());
    window.addEventListener("storage", handleThemeChange);
    window.addEventListener("theme-change", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleThemeChange);
      window.removeEventListener("theme-change", handleThemeChange);
    };
  }, [lang]);

  return (
    <section className="mt-16 border-t border-[var(--color-border)] pt-8" aria-label={labels[lang]}>
      <h2 className="mb-6 text-sm font-bold text-[var(--color-heading)]">{labels[lang]}</h2>
      <div ref={containerRef} className="giscus-container min-h-24" />
    </section>
  );
}