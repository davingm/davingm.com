"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Language } from "@/lib/types";

const SITE_TITLE = "Kin's Blog";

const awayTitles: Record<Language, string> = {
  zh: ">-< 请回来",
  en: ">-< please come back",
  id: ">-< Kembali dong",
};

export function TabTitle({ lang }: { lang: Language }) {
  const pathname = usePathname();
  const normalTitleRef = useRef("");

  useEffect(() => {
    const getNormalTitle = () => {
      const title = document.title.replace(/\s*[|—]\s*Kin's Blog\s*$/, "").trim();
      return title || SITE_TITLE;
    };

    normalTitleRef.current = getNormalTitle();

    const updateTitle = () => {
      if (document.hidden) {
        document.title = awayTitles[lang];
        return;
      }

      const pageTitle = normalTitleRef.current;
      document.title = pageTitle === SITE_TITLE ? SITE_TITLE : `${pageTitle} — ${SITE_TITLE}`;
    };

    updateTitle();
    document.addEventListener("visibilitychange", updateTitle);

    return () => document.removeEventListener("visibilitychange", updateTitle);
  }, [lang, pathname]);

  return null;
}