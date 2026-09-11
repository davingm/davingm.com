"use client";

// Minimal client island — only the interactive controls in the header.
// This keeps the client bundle small: ThemeToggle + LanguageSwitcher + SearchModal trigger.

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchModal, SearchItem } from "./SearchModal";
import { Language } from "@/lib/types";

interface HeaderControlsProps {
  lang: Language;
  searchItems: SearchItem[];
}

export function HeaderControls({ lang, searchItems }: HeaderControlsProps) {
  const pathname = usePathname();

  // Highlight active nav link via DOM — avoids shipping full nav logic to client
  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>("nav .nav-link");
    const clean = pathname.replace(/\/$/, "");

    links.forEach((link) => {
      const path = link.dataset.path ?? "";
      const isActive =
        clean === path ||
        clean === path.replace(`/${lang}`, "") ||
        (path !== `/${lang}` && clean.startsWith(path + "/")) ||
        (path !== `/${lang}` && clean.startsWith(path.replace(`/${lang}`, "") + "/"));

      if (isActive) {
        link.classList.add(
          "text-[var(--color-nav-active)]",
          "underline",
          "underline-offset-4",
          "decoration-2",
          "font-semibold"
        );
        link.classList.remove("text-[var(--color-text-muted)]");
      } else {
        link.classList.remove(
          "text-[var(--color-nav-active)]",
          "underline",
          "underline-offset-4",
          "decoration-2",
          "font-semibold"
        );
        link.classList.add("text-[var(--color-text-muted)]");
      }
    });
  }, [pathname, lang]);

  return (
    <div className="flex items-center gap-2">
      <SearchModal lang={lang} items={searchItems} />
      <ThemeToggle />
      <LanguageSwitcher currentLang={lang} />
      <a
        href="https://www.travellings.cn/go"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Traveling link"
        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] hover:text-[var(--color-heading)] hover:border-[var(--color-accent)] transition-colors"
      >
        {/* TramFront icon — inline SVG to avoid one extra Lucide import in this island */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <rect x="4" y="3" width="16" height="16" rx="2" />
          <path d="M4 11h16" />
          <path d="M12 3v8" />
          <path d="m8 19-2 3" />
          <path d="m18 22-2-3" />
          <path d="M8 15h.01" />
          <path d="M16 15h.01" />
        </svg>
      </a>
    </div>
  );
}
