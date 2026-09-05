"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchModal, SearchItem } from "./SearchModal";
import { Language, SiteConfig } from "@/lib/types";

interface HeaderProps {
  lang: Language;
  site: SiteConfig;
  currentPath?: string;
  searchItems?: SearchItem[];
}

export function Header({ lang, site, currentPath = "", searchItems = [] }: HeaderProps) {
  const pathname = usePathname() || currentPath || `/${lang}`;

  const navItems = [
    { name: "Home", path: "" },
    { name: "Posts", path: "posts" },
    { name: "Archive", path: "archive" },
    { name: "About", path: "about" },
    { name: "Projects", path: "projects" },
    { name: "Links", path: "links" },
  ];

  // Helper to determine active route
  const isNavActive = (itemPath: string) => {
    // Normalize path
    const cleanPath = pathname.replace(/\/$/, "");
    if (itemPath === "") {
      return (
        cleanPath === "" ||
        cleanPath === `/${lang}` ||
        cleanPath === "/"
      );
    }
    return (
      cleanPath === `/${lang}/${itemPath}` ||
      cleanPath.startsWith(`/${lang}/${itemPath}/`) ||
      cleanPath === `/${itemPath}` ||
      cleanPath.startsWith(`/${itemPath}/`)
    );
  };

  return (
    <header className="pt-10 pb-8">
      <div className="flex items-center justify-between mb-2">
        <Link href={`/${lang}`} className="group inline-block">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-heading)] group-hover:text-[var(--color-accent)] transition-colors">
            {site.title}
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <SearchModal lang={lang} items={searchItems} />
          <ThemeToggle />
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>

      <p className="text-sm text-[var(--color-text-muted)] font-mono mb-6">
        {site.tagline}
      </p>

      {/* Navigation tabs */}
      <nav className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-sm font-medium">
        {navItems.map((item, index) => {
          const itemHref = item.path === "" ? `/${lang}` : `/${lang}/${item.path}`;
          const isActive = isNavActive(item.path);

          return (
            <div key={item.name} className="flex items-center gap-2.5">
              <Link
                href={itemHref}
                className={`transition-all py-0.5 hover:underline hover:underline-offset-4 hover:decoration-2 ${
                  isActive
                    ? "text-[var(--color-nav-active)] underline underline-offset-4 decoration-2 font-semibold"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-heading)]"
                }`}
              >
                {item.name}
              </Link>
              {index < navItems.length - 1 && (
                <span className="text-[var(--color-border)] select-none">|</span>
              )}
            </div>
          );
        })}
      </nav>
    </header>
  );
}
