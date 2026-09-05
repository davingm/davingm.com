import { getAllBlogPosts, getBlogPostBySlug, getSiteConfig } from "@/lib/content";
import { extractHeadings, renderMarkdown } from "@/lib/markdown";
import { Language } from "@/lib/types";
import { TableOfContents } from "@/components/TableOfContents";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  const languages: Language[] = ["zh", "en", "id"];
  const params: { lang: string; slug: string }[] = [];

  languages.forEach((lang) => {
    const posts = getAllBlogPosts(lang);
    posts.forEach((post) => {
      params.push({ lang, slug: post.slug });
    });
  });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = (await params) as { lang: Language; slug: string };
  const post = getBlogPostBySlug(slug, lang);
  const site = getSiteConfig(lang);

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.summary || post.subtitle || site.description,
    openGraph: {
      title: post.title,
      description: post.summary || post.subtitle || site.description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [site.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary || post.subtitle || site.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = (await params) as { lang: Language; slug: string };
  const post = getBlogPostBySlug(slug, lang);

  if (!post) {
    notFound();
  }

  const html = await renderMarkdown(post.content);
  const headings = extractHeadings(post.content);

  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <article className="flex-1 min-w-0 max-w-full">
          {/* Post Header */}
          <header className="mb-10 pb-6 border-b border-[var(--color-border)]">
            <Link
              href={`/${lang}/posts`}
              className="text-xs font-mono text-[var(--color-accent)] hover:underline inline-flex items-center gap-1 mb-6"
            >
              &larr; {lang === "zh" ? "返回文章列表" : lang === "id" ? "Kembali ke artikel" : "Back to posts"}
            </Link>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-heading)] mb-4">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-sm text-[var(--color-text-muted)] mb-4 italic">
                {post.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--color-text-muted)]">
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
              {post.readingTime && (
                <>
                  <span>•</span>
                  <span>{post.readingTime} min read</span>
                </>
              )}
              {post.tags.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/${lang}/posts?tag=${encodeURIComponent(tag)}`}
                        className="text-[var(--color-tag)] hover:underline"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Top Featured Hero Image */}
            {post.image && (
              <div className="mt-6 rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-code-bg)] shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto max-h-[420px] object-cover"
                />
              </div>
            )}
          </header>

          {/* Post Markdown Content */}
          <div
            className="prose text-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>

        {/* Desktop Table of Contents */}
        {headings.length > 0 && (
          <aside className="hidden lg:block w-56 shrink-0 sticky top-12 max-h-[80vh] overflow-y-auto pl-4 border-l border-[var(--color-border)]">
            <TableOfContents headings={headings} />
          </aside>
        )}
      </div>
    </div>
  );
}
