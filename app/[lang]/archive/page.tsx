import { getGroupedArchivePosts } from "@/lib/content";
import { Language } from "@/lib/types";
import { PageContainer } from "@/components/PageContainer";
import Link from "next/link";
import type { Metadata } from "next";

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }, { lang: "id" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Language };
  return {
    title: lang === "zh" ? "归档" : lang === "id" ? "Arsip" : "Archive",
    description: "Chronological archive of all published articles.",
  };
}

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Language };
  const grouped = getGroupedArchivePosts(lang);
  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <PageContainer>
      <div className="space-y-10">
      <h2 className="text-2xl font-bold tracking-tight text-[var(--color-heading)]">
        Archive
      </h2>

      <div className="space-y-12">
        {years.map((year) => (
          <div key={year} className="space-y-4">
            <div className="text-sm font-bold font-mono text-[var(--color-heading)]">
              {year}
            </div>

            <div className="space-y-3 pl-2 sm:pl-4 border-l border-[var(--color-border)]">
              {grouped[year].map((post) => (
                <div
                  key={post.slug}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 py-1 group"
                >
                  <time className="text-xs font-mono text-[var(--color-text-muted)] shrink-0 w-24">
                    {post.publishedAt}
                  </time>
                  <div className="flex-1 min-w-0 flex items-baseline gap-2">
                    <Link
                      href={`/${lang}/posts/${post.slug}`}
                      className="text-sm text-[var(--color-heading)] group-hover:text-[var(--color-accent)] transition-colors underline-offset-4"
                    >
                      {post.title}
                    </Link>
                    {post.tags.length > 0 && (
                      <span className="text-[11px] text-[var(--color-tag)] shrink-0">
                        {post.tags[0]}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>
    </PageContainer>
  );
}
