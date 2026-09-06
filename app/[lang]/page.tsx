import { getSiteConfig, getAllBlogPosts } from "@/lib/content";
import { Language } from "@/lib/types";
import { PageContainer } from "@/components/PageContainer";
import Link from "next/link";

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }, { lang: "id" }];
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Language };
  const site = getSiteConfig(lang);
  const posts = getAllBlogPosts(lang);
  const recentPosts = posts.slice(0, 5);

  return (
    <PageContainer>
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
    </PageContainer>
  );
}
