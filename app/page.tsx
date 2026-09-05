import { getSiteConfig, getAllBlogPosts, getAllProjectPosts } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchItem } from "@/components/SearchModal";
import Link from "next/link";

export default function RootHomePage() {
  const lang = "zh";
  const site = getSiteConfig(lang);
  const posts = getAllBlogPosts(lang);
  const projects = getAllProjectPosts(lang);

  const searchItems: SearchItem[] = [
    ...posts.map((p) => ({
      type: "post" as const,
      title: p.title,
      summary: p.summary || p.subtitle || "",
      slug: p.slug,
      lang: p.lang,
      date: p.publishedAt,
      tag: p.tag,
      content: p.content,
    })),
    ...projects.map((pr) => ({
      type: "project" as const,
      title: pr.title,
      summary: pr.summary,
      slug: pr.slug,
      lang: pr.lang,
      date: pr.publishedAt,
      tag: pr.tech,
      content: pr.content,
    })),
  ];

  const recentPosts = posts.slice(0, 5);

  return (
    <div className="w-full max-w-3xl mx-auto px-5 sm:px-8 flex-1 flex flex-col">
      <Header lang={lang} site={site} currentPath="/" searchItems={searchItems} />

      <main className="flex-1 py-4">
        {/* Intro bio */}
        <section className="mb-12 text-sm leading-relaxed text-[var(--color-text)]">
          <p>{site.bio}</p>
        </section>

        {/* Recent Posts */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--color-heading)] tracking-tight">
              Recent Posts
            </h2>
            <Link
              href={`/${lang}/posts`}
              className="text-xs font-medium text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
            >
              All posts &rarr;
            </Link>
          </div>

          <div className="space-y-8">
            {recentPosts.map((post) => (
              <article key={post.slug} className="group">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                  <time className="text-xs font-mono text-[var(--color-text-muted)] shrink-0 w-24">
                    {post.publishedAt}
                  </time>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold">
                      <Link
                        href={`/${lang}/posts/${post.slug}`}
                        className="text-[var(--color-heading)] group-hover:text-[var(--color-accent)] transition-colors underline-offset-4"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    {post.image && (
                      <div className="mt-3 mb-2 max-w-sm rounded-lg overflow-hidden border border-[var(--color-border)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-auto object-cover max-h-44 group-hover:scale-[1.02] transition-transform duration-200"
                        />
                      </div>
                    )}

                    {post.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/${lang}/posts?tag=${encodeURIComponent(tag)}`}
                            className="text-xs font-medium text-[#CB2A42] dark:text-[#FB7185] underline underline-offset-4 decoration-[#CB2A42] dark:decoration-[#FB7185] hover:text-[#2ABC89] dark:hover:text-[#2ABC89] hover:decoration-[#2ABC89] dark:hover:decoration-[#2ABC89]"
                          >
                            {tag}
                          </Link>
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
            ))}
          </div>
        </section>
      </main>

      <Footer site={site} />
    </div>
  );
}
