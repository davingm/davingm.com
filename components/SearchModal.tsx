"use client";

import { useState, useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, FileText, FolderGit2, Hash, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Language } from "@/lib/types";

export interface SearchItem {
  type: "post" | "project" | "heading";
  title: string;
  summary: string;
  slug: string;
  lang: Language;
  date: string;
  tag?: string;
  sectionId?: string;
  content?: string;
}

export function AlgoliaLogo() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
      <span className="text-[11px]">Search by</span>
      <div className="flex items-center gap-1">
        <svg
          className="w-3.5 h-3.5 text-[#003DFF] dark:text-[#0052FF]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6c4.639 0 8.4 3.761 8.4 8.4 0 4.639-3.761 8.4-8.4 8.4-4.639 0-8.4-3.761-8.4-8.4 0-4.639 3.761-8.4 8.4-8.4zm-.2 2.76a.9.9 0 0 0-.9.9v4.2a.9.9 0 0 0 .9.9h4.2a.9.9 0 0 0 .9-.9.9.9 0 0 0-.9-.9h-3.3v-3.3a.9.9 0 0 0-.9-.9z" />
        </svg>
        <span className="font-bold tracking-tight text-[#003DFF] dark:text-[#5468FF] text-xs">
          algolia
        </span>
      </div>
    </div>
  );
}

export function SearchModal({
  lang,
  items,
}: {
  lang: Language;
  items: SearchItem[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter items deeply (title, tag, summary, content)
  const filtered = query.trim()
    ? items.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          (item.tag && item.tag.toLowerCase().includes(q)) ||
          (item.content && item.content.toLowerCase().includes(q))
        );
      }).slice(0, 10)
    : [];

  // Keyboard navigation inside modal
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filtered.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered.length > 0 && filtered[selectedIndex]) {
        navigateToItem(filtered[selectedIndex]);
      }
    }
  };

  const navigateToItem = (item: SearchItem) => {
    setOpen(false);
    let href =
      item.type === "project"
        ? `/${lang}/projects/${item.slug}`
        : `/${lang}/posts/${item.slug}`;

    if (item.sectionId) {
      href += `#${item.sectionId}`;
    }
    router.push(href);
  };

  // Helper to highlight matching terms
  const highlightMatch = (text: string, q: string) => {
    if (!q.trim() || !text) return text;
    const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark
          key={i}
          className="bg-emerald-500/20 text-[#2ABC89] dark:text-[#2ABC89] font-medium rounded-xs px-0.5"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search docs and posts"
        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] hover:text-[var(--color-heading)] hover:border-[var(--color-accent)] transition-colors focus:outline-none"
      >
        <Search className="w-4 h-4" />
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 animate-fade-in" />
          <Dialog.Content className="fixed top-[12%] left-1/2 -translate-x-1/2 w-[94vw] max-w-2xl bg-[#1E2022] dark:bg-[#1E2022] text-[#E5E7EB] border border-[#2D3134] rounded-xl shadow-2xl z-50 p-4 focus:outline-none overflow-hidden">
            {/* Search Input Box with Green Border */}
            <div className="relative flex items-center gap-3 px-3.5 py-3 rounded-lg border-2 border-[#2ABC89] bg-[#161819] shadow-inner">
              <Search className="w-5 h-5 text-[#2ABC89] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search docs"
                autoFocus
                className="w-full bg-transparent text-base text-[#F3F4F6] placeholder:text-[#6B7280] focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-xs font-mono text-[#9CA3AF] hover:text-[#F3F4F6] px-1.5 py-0.5 rounded bg-[#2D3134]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Results or Empty State */}
            <div
              ref={resultContainerRef}
              className="min-h-[160px] max-h-[55vh] overflow-y-auto mt-4 py-2 divide-y divide-[#2A2E31]"
            >
              {!query.trim() ? (
                <div className="flex flex-col items-center justify-center py-12 text-[#9CA3AF] text-sm">
                  <p>No recent searches</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-[#9CA3AF] text-sm">
                  <p>No results for &quot;{query}&quot;</p>
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={`${item.type}-${item.slug}-${item.sectionId || ""}-${idx}`}
                      onClick={() => navigateToItem(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#2ABC89]/15 border border-[#2ABC89]/40"
                          : "hover:bg-[#26292B] border border-transparent"
                      }`}
                    >
                      <div className="mt-1 shrink-0">
                        {item.type === "post" ? (
                          <FileText
                            className={`w-4 h-4 ${
                              isSelected ? "text-[#2ABC89]" : "text-[#9CA3AF]"
                            }`}
                          />
                        ) : item.type === "project" ? (
                          <FolderGit2
                            className={`w-4 h-4 ${
                              isSelected ? "text-[#2ABC89]" : "text-[#9CA3AF]"
                            }`}
                          />
                        ) : (
                          <Hash
                            className={`w-4 h-4 ${
                              isSelected ? "text-[#2ABC89]" : "text-[#9CA3AF]"
                            }`}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`text-sm font-semibold truncate ${
                              isSelected ? "text-[#2ABC89]" : "text-[#F3F4F6]"
                            }`}
                          >
                            {highlightMatch(item.title, query)}
                          </h4>
                          <span className="text-[10px] font-mono text-[#6B7280] shrink-0">
                            {item.date}
                          </span>
                        </div>

                        {item.summary && (
                          <p className="text-xs text-[#9CA3AF] line-clamp-2 mt-0.5">
                            {highlightMatch(item.summary, query)}
                          </p>
                        )}
                      </div>

                      {isSelected && (
                        <ArrowRight className="w-4 h-4 text-[#2ABC89] shrink-0 self-center" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer with Keyboard instructions & Algolia logo */}
            <div className="mt-3 pt-3 border-t border-[#2D3134] flex items-center justify-between text-xs text-[#9CA3AF] font-mono select-none">
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#2D3134] text-[#E5E7EB]">
                    ↵
                  </kbd>{" "}
                  to select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#2D3134] text-[#E5E7EB]">
                    ↓
                  </kbd>
                  <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#2D3134] text-[#E5E7EB]">
                    ↑
                  </kbd>{" "}
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#2D3134] text-[#E5E7EB]">
                    esc
                  </kbd>{" "}
                  to close
                </span>
              </div>

              <AlgoliaLogo />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
