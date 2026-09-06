"use client";

import { useEffect, useState } from "react";
import { HeadingItem } from "@/lib/markdown";

export function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -60% 0%" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="text-xs">
      <h3 className="font-semibold text-[var(--color-heading)] mb-3 tracking-wide">
        On this page
      </h3>
      <div className="relative after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-1 after:h-8 after:bg-gradient-to-b after:from-transparent after:to-[var(--color-bg)]">
        <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {headings.map((h) => (
            <li
              key={h.id}
              style={{ paddingLeft: `${(h.level - 1) * 0.75}rem` }}
            >
              <a
                href={`#${h.id}`}
                className={`block transition-colors ${
                  activeId === h.id
                    ? "text-[var(--color-accent)] font-medium"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-heading)]"
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
