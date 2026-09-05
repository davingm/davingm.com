"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BlogPost, Language } from "@/lib/types";

interface PostsListProps {
  lang: Language;
  posts: BlogPost[];
  categories: string[];
}

export function PostsList({ lang, posts, categories }: PostsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter((p) => p.tags.includes(selectedCategory));
  }, [posts, selectedCategory]);

  return (
    <div className="space-y-10">
      {/* Categories filter */}
      {categories.length > 0 && (
        <section>
          <h3 className="text-base font-semibold text-[var(--color-heading)] mb-4">
            Categories
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`text-xs transition-all cursor-pointer ${
                selectedCategory === null
                  ? "bg-[#2ABC89] text-white px-2.5 py-1 rounded-md font-medium no-underline shadow-xs"
                  : "text-[#CB2A42] dark:text-[#FB7185] underline underline-offset-4 decoration-[#CB2A42] dark:decoration-[#FB7185] hover:text-[#2ABC89] dark:hover:text-[#2ABC89] hover:decoration-[#2ABC89] dark:hover:decoration-[#2ABC89]"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat ? null : cat)
                }
                className={`text-xs transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#2ABC89] text-white px-2.5 py-1 rounded-md font-medium no-underline shadow-xs"
                    : "text-[#CB2A42] dark:text-[#FB7185] underline underline-offset-4 decoration-[#CB2A42] dark:decoration-[#FB7185] hover:text-[#2ABC89] dark:hover:text-[#2ABC89] hover:decoration-[#2ABC89] dark:hover:decoration-[#2ABC89]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* All posts list */}
      <section>
        <h3 className="text-base font-semibold text-[var(--color-heading)] mb-6">
          {selectedCategory ? `Posts in "${selectedCategory}"` : "All posts"}
        </h3>

        <div className="space-y-8">
          {filteredPosts.length === 0 ? (
            <p className="text-xs text-[var(--color-text-muted)]">No posts found.</p>
          ) : (
            filteredPosts.map((post) => (
              <article key={post.slug} className="group">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                  <time className="text-xs font-mono text-[var(--color-text-muted)] shrink-0 w-24">
                    {post.publishedAt}
                  </time>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold">
                      <Link
                        href={`/${lang}/posts/${post.slug}`}
                        className="text-[var(--color-heading)] group-hover:text-[var(--color-accent)] transition-colors underline-offset-4"
                      >
                        {post.title}
                      </Link>
                    </h4>

                    {/* Featured Image preview if present */}
                    {post.image && (
                      <div className="mt-3 mb-2 max-w-sm rounded-lg overflow-hidden border border-[var(--color-border)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-auto object-cover max-h-48 group-hover:scale-[1.02] transition-transform duration-200"
                        />
                      </div>
                    )}

                    {post.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSelectedCategory(tag)}
                            className="text-xs text-[#CB2A42] dark:text-[#FB7185] underline underline-offset-4 decoration-[#CB2A42] dark:decoration-[#FB7185] hover:text-[#2ABC89] dark:hover:text-[#2ABC89] hover:decoration-[#2ABC89] dark:hover:decoration-[#2ABC89] cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}

                    {post.summary && (
                      <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)] line-clamp-3">
                        {post.summary}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
