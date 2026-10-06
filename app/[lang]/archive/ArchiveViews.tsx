"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Star, StarHalf } from "lucide-react";
import { AnimeEntry, BlogPost, Language } from "@/lib/types";

interface ArchiveViewsProps {
  lang: Language;
  animeEntries: AnimeEntry[];
  blogPostsByYear: Record<string, BlogPost[]>;
}

const labels = {
  id: {
    anime: "Anime Archive",
    blog: "Blog Archive",
    empty: "Belum ada anime di arsip. Tambahkan file anime pertama di content/anime.",
    rating: "Rating",
    minutes: "menit per episode",
    image: "Gambar",
    of: "dari",
    loadMore: "Tampilkan 20 anime lagi",
  },
  en: {
    anime: "Anime Archive",
    blog: "Blog Archive",
    empty: "No anime entries yet. Add your first anime file in content/anime.",
    rating: "Rating",
    minutes: "min per episode",
    image: "Image",
    of: "of",
    loadMore: "Show 20 more anime",
  },
  zh: {
    anime: "动漫归档",
    blog: "博客归档",
    empty: "还没有动漫记录。请在 content/anime 中添加第一部动漫。",
    rating: "评分",
    minutes: "分钟/集",
    image: "图片",
    of: "共",
    loadMore: "再显示 20 部动漫",
  },
} satisfies Record<Language, Record<string, string>>;

const ANIME_PAGE_SIZE = 20;

export function ArchiveViews({
  lang,
  animeEntries,
  blogPostsByYear,
}: ArchiveViewsProps) {
  const [selectedArchive, setSelectedArchive] = useState<"anime" | "blog">("anime");
  const text = labels[lang];

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <div
          className="inline-flex rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-1"
          aria-label="Archive category"
          role="group"
        >
          {(["anime", "blog"] as const).map((archive) => (
            <button
              key={archive}
              type="button"
              aria-pressed={selectedArchive === archive}
              onClick={() => setSelectedArchive(archive)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedArchive === archive
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-heading)]"
              }`}
            >
              {text[archive]}
            </button>
          ))}
        </div>
      </div>

      {selectedArchive === "anime" ? (
        <AnimeArchive key={lang} entries={animeEntries} text={text} />
      ) : (
        <BlogArchive lang={lang} postsByYear={blogPostsByYear} />
      )}
    </div>
  );
}

function AnimeArchive({
  entries,
  text,
}: {
  entries: AnimeEntry[];
  text: Record<string, string>;
}) {
  const [visibleCount, setVisibleCount] = useState(ANIME_PAGE_SIZE);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-muted)]">
        {text.empty}
      </p>
    );
  }

  return (
    <>
      <div className="space-y-10">
        {entries.slice(0, visibleCount).map((entry) => (
          <AnimeEntryRow key={entry.slug} entry={entry} text={text} />
        ))}
      </div>
      {visibleCount < entries.length && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((count) =>
                Math.min(count + ANIME_PAGE_SIZE, entries.length),
              )
            }
            aria-label={text.loadMore}
            title={text.loadMore}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <ChevronDown size={20} aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
}

function AnimeEntryRow({
  entry,
  text,
}: {
  entry: AnimeEntry;
  text: Record<string, string>;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const fullStars = Math.floor(entry.rating / 2);
  const hasHalfStar = entry.rating % 2 !== 0;

  function showImage(direction: -1 | 1) {
    setActiveImage((current) =>
      (current + direction + entry.images.length) % entry.images.length,
    );
  }

  return (
    <article className="group flex flex-col gap-2 sm:flex-row sm:gap-6">
      <time className="w-24 shrink-0 pt-1 text-xs font-mono text-[var(--color-text-muted)]">
        {entry.year}
      </time>
      <div className="min-w-0 flex-1 space-y-2">
        <h3 className="text-base font-semibold text-[var(--color-heading)]">
          {entry.title}
        </h3>

        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-code-bg)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entry.images[activeImage]}
            alt={`${entry.title} — ${text.image} ${activeImage + 1}`}
            className="h-full w-full object-cover"
          />
          {entry.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => showImage(-1)}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => showImage(1)}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
              <span className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 text-[11px] text-white">
                {activeImage + 1} {text.of} {entry.images.length}
              </span>
            </>
          )}
        </div>

        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          {entry.description}
        </p>

        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)]">
            <span>{entry.episodeDurationMinutes} {text.minutes}</span>
            {entry.categories.map((category) => (
              <span
                key={category}
                className="text-[var(--color-tag)] underline underline-offset-4 decoration-[var(--color-tag)]"
              >
                {category}
              </span>
            ))}
          </div>
          <div
            className="ml-auto flex shrink-0 items-center gap-0.5 text-amber-400"
            aria-label={`${text.rating}: ${entry.rating}/10`}
            title={`${entry.rating}/10`}
          >
            {Array.from({ length: 5 }, (_, index) => {
              if (index < fullStars) {
                return <Star key={index} size={15} fill="currentColor" aria-hidden="true" />;
              }
              if (index === fullStars && hasHalfStar) {
                return <StarHalf key={index} size={15} fill="currentColor" aria-hidden="true" />;
              }
              return <Star key={index} size={15} aria-hidden="true" />;
            })}
            <span className="ml-1 text-xs text-[var(--color-text-muted)]">
              {entry.rating}/10
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function BlogArchive({
  lang,
  postsByYear,
}: {
  lang: Language;
  postsByYear: Record<string, BlogPost[]>;
}) {
  const years = Object.keys(postsByYear).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-12">
      {years.map((year) => (
        <section key={year} className="space-y-4">
          <h3 className="text-sm font-bold font-mono text-[var(--color-heading)]">
            {year}
          </h3>
          <div className="space-y-3 border-l border-[var(--color-border)] pl-2 sm:pl-4">
            {postsByYear[year].map((post) => (
              <div
                key={post.slug}
                className="group flex flex-col gap-2 py-1 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <time className="w-24 shrink-0 text-xs font-mono text-[var(--color-text-muted)]">
                  {post.publishedAt}
                </time>
                <div className="flex min-w-0 flex-1 items-baseline gap-2">
                  <Link
                    href={`/${lang}/posts/${post.slug}`}
                    className="text-sm text-[var(--color-heading)] transition-colors group-hover:text-[var(--color-accent)] underline-offset-4"
                  >
                    {post.title}
                  </Link>
                  {post.tags.length > 0 && (
                    <span className="shrink-0 text-[11px] text-[var(--color-tag)]">
                      {post.tags[0]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
