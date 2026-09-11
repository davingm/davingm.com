// Server Component — no "use client" needed here
// Interactive parts (ThemeToggle, LanguageSwitcher, SearchModal) are in HeaderControls

import Link from "next/link";
import { HeaderControls } from "./HeaderControls";
import { Language, SiteConfig } from "@/lib/types";
import { SearchItem } from "./SearchModal";

interface HeaderProps {
  lang: Language;
  site: SiteConfig;
  currentPath?: string;
  searchItems?: SearchItem[];
}

const navItems = [
  { name: "Home", path: "" },
  { name: "Posts", path: "posts" },
  { name: "Archive", path: "archive" },
  { name: "About", path: "about" },
  { name: "Projects", path: "projects" },
  { name: "Links", path: "links" },
];

export function Header({ lang, site, currentPath = "", searchItems = [] }: HeaderProps) {
  return (
    <header className="pt-10 pb-8">
      <div className="flex items-center justify-between mb-2">
        <Link href={`/${lang}`} className="group inline-block">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-heading)] group-hover:text-[var(--color-accent)] transition-colors">
            {site.title}
          </h1>
        </Link>
        {/* Client island: only interactive controls ship client JS */}
        <HeaderControls lang={lang} searchItems={searchItems} />
      </div>

      <p className="text-sm text-[var(--color-text-muted)] font-mono mb-6">
        {site.tagline}
      </p>

      {/* Navigation — rendered server-side, active state handled client-side via CSS */}
      <nav className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-sm font-medium" aria-label="Main navigation">
        {navItems.map((item, index) => {
          const itemHref = item.path === "" ? `/${lang}` : `/${lang}/${item.path}`;
          return (
            <div key={item.name} className="flex items-center gap-2.5">
              <Link
                href={itemHref}
                className="nav-link transition-all py-0.5 hover:underline hover:underline-offset-4 hover:decoration-2 text-[var(--color-text-muted)] hover:text-[var(--color-heading)]"
                data-path={item.path === "" ? `/${lang}` : `/${lang}/${item.path}`}
              >
                {item.name}
              </Link>
              {index < navItems.length - 1 && (
                <span className="text-[var(--color-border)] select-none" aria-hidden="true">|</span>
              )}
            </div>
          );
        })}
      </nav>
    </header>
  );
}
