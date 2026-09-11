"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/algolia.png"
        alt="Algolia"
        width={55}
        height={16}
        className="h-4 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
      />
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open/close native dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
      // Focus input after modal opens
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      dialog.close();
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  // Close on backdrop click (native dialog backdrop)
  const handleDialogClick = useCallback((e: React.MouseEvent<HTMLDialogElement>) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setOpen(false);
    }
  }, []);

  // Close on native dialog cancel (Escape key)
  const handleDialogClose = useCallback(() => {
    setOpen(false);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
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

  // Filter items (title, tag, summary, content)
  const filtered = query.trim()
    ? items
        .filter((item) => {
          const q = query.toLowerCase();
          return (
            item.title.toLowerCase().includes(q) ||
            item.summary.toLowerCase().includes(q) ||
            (item.tag && item.tag.toLowerCase().includes(q)) ||
            (item.content && item.content.toLowerCase().includes(q))
          );
        })
        .slice(0, 10)
    : [];

  // Keyboard navigation inside modal
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filtered.length > 0) setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length > 0)
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
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
    if (item.sectionId) href += `#${item.sectionId}`;
    router.push(href);
  };

  // Highlight matching terms
  const highlightMatch = (text: string, q: string) => {
    if (!q.trim() || !text) return text;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark
          key={i}
          className="bg-emerald-500/20 text-[#2ABC89] font-medium rounded-xs px-0.5"
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

      {/* Native <dialog> — zero dependency, full a11y via browser */}
      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        onClose={handleDialogClose}
        className="search-dialog p-0 rounded-xl border border-[#2D3134] bg-[#1E2022] text-[#E5E7EB] shadow-2xl w-[94vw] max-w-2xl focus:outline-none backdrop:bg-black/70 backdrop:backdrop-blur-sm"
        aria-label="Search"
      >
        <div className="p-4">
          {/* Search input */}
          <div className="relative flex items-center gap-3 px-3.5 py-3 rounded-lg border-2 border-[#2ABC89] bg-[#161819] shadow-inner">
            <Search className="w-5 h-5 text-[#2ABC89] shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search docs"
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

          {/* Results */}
          <div className="min-h-[160px] max-h-[55vh] overflow-y-auto mt-4 py-2 divide-y divide-[#2A2E31]">
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
                    <div className="mt-1 shrink-0" aria-hidden="true">
                      {item.type === "post" ? (
                        <FileText className={`w-4 h-4 ${isSelected ? "text-[#2ABC89]" : "text-[#9CA3AF]"}`} />
                      ) : item.type === "project" ? (
                        <FolderGit2 className={`w-4 h-4 ${isSelected ? "text-[#2ABC89]" : "text-[#9CA3AF]"}`} />
                      ) : (
                        <Hash className={`w-4 h-4 ${isSelected ? "text-[#2ABC89]" : "text-[#9CA3AF]"}`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-sm font-semibold truncate ${isSelected ? "text-[#2ABC89]" : "text-[#F3F4F6]"}`}>
                          {highlightMatch(item.title, query)}
                        </h4>
                        <span className="text-[10px] font-mono text-[#6B7280] shrink-0">{item.date}</span>
                      </div>
                      {item.summary && (
                        <p className="text-xs text-[#9CA3AF] line-clamp-2 mt-0.5">
                          {highlightMatch(item.summary, query)}
                        </p>
                      )}
                    </div>

                    {isSelected && <ArrowRight className="w-4 h-4 text-[#2ABC89] shrink-0 self-center" />}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-[#2D3134] flex items-center justify-between text-xs text-[#9CA3AF] font-mono select-none">
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#2D3134] text-[#E5E7EB]">↵</kbd>{" "}
                to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#2D3134] text-[#E5E7EB]">↓</kbd>
                <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#2D3134] text-[#E5E7EB]">↑</kbd>{" "}
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#2D3134] text-[#E5E7EB]">esc</kbd>{" "}
                to close
              </span>
            </div>
            <AlgoliaLogo />
          </div>
        </div>
      </dialog>
    </>
  );
}
