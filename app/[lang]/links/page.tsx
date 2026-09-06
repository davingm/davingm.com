import { getLinksData } from "@/lib/content";
import { Language } from "@/lib/types";
import { PageContainer } from "@/components/PageContainer";
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
    title: lang === "zh" ? "友链" : lang === "id" ? "Tautan Teman" : "Links",
    description: "Friends, blogs, and inspiring websites.",
  };
}

export default async function LinksPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Language };
  const data = getLinksData(lang);

  return (
    <PageContainer>
      <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-heading)] mb-3">
          {data.title}
        </h2>
        <div className="text-xs font-mono text-[var(--color-text-muted)] space-y-0.5 mb-6">
          <div>{data.publishedAt}</div>
          <div>Updated {data.updatedAt}</div>
        </div>

        {data.description && (
          <p className="text-xs text-[var(--color-text-muted)]">
            {data.description}
          </p>
        )}
      </header>

      {/* Link cards list */}
      <div className="space-y-3">
        {data.links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-accent)] hover:bg-[var(--color-card-hover)] transition-all group"
          >
            {/* Avatar or fallback monogram */}
            {link.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={link.avatar}
                alt={link.name}
                className="w-10 h-10 rounded-full border border-[var(--color-border)] object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--color-quote-bg)] border border-[var(--color-border)] flex items-center justify-center font-bold text-sm text-[var(--color-accent)] shrink-0">
                {link.name.charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[var(--color-heading)] group-hover:text-[var(--color-accent)] transition-colors truncate">
                {link.name}
              </h3>
              {link.desc && (
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
                  {link.desc}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </PageContainer>
  );
}
