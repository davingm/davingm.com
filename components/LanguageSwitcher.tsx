"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Language } from "@/lib/types";
import { useState, useRef, useEffect } from "react";

const languages: { code: Language; label: string }[] = [
  { code: "zh", label: "中文 (ZH)" },
  { code: "en", label: "English (EN)" },
  { code: "id", label: "Bahasa Indonesia (ID)" },
];

export function LanguageSwitcher({ currentLang }: { currentLang: Language }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLanguage = (targetLang: Language) => {
    setOpen(false);
    if (targetLang === currentLang) return;

    // Replace current lang in pathname
    let newPath = pathname;
    if (pathname.startsWith(`/${currentLang}`)) {
      newPath = pathname.replace(`/${currentLang}`, `/${targetLang}`);
    } else {
      newPath = `/${targetLang}${pathname}`;
    }
    router.push(newPath);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Switch language"
        className="inline-flex items-center justify-center gap-1.5 h-8 min-w-[62px] px-2 text-xs rounded-md border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] hover:text-[var(--color-heading)] hover:border-[var(--color-accent)] transition-colors focus:outline-none"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="uppercase font-medium leading-none">{currentLang}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-md shadow-lg bg-[var(--color-card)] border border-[var(--color-border)] py-1 z-50 focus:outline-none">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                currentLang === lang.code
                  ? "text-[var(--color-accent)] font-semibold bg-[var(--color-quote-bg)]"
                  : "text-[var(--color-text)] hover:bg-[var(--color-quote-bg)]"
              }`}
            >
              <span>{lang.label}</span>
              {currentLang === lang.code && <span className="text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
