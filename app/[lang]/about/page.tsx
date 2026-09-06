import { getAboutData } from "@/lib/content";
import { extractHeadings, renderMarkdown } from "@/lib/markdown";
import { Language } from "@/lib/types";
import { TableOfContents } from "@/components/TableOfContents";
import { PageContainer } from "@/components/PageContainer";
import { GiscusComments } from "@/components/GiscusComments";
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
    title: lang === "zh" ? "关于" : lang === "id" ? "Tentang" : "About",
    description: "About the author and site information.",
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Language };
  const about = getAboutData(lang);
  const html = await renderMarkdown(about.content);
  const headings = extractHeadings(about.content);

  return (
    <PageContainer>
      <div className="flex gap-10 items-start">
        <article className="flex-1 min-w-0">
          <header className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-heading)] mb-3">
              {about.title}
            </h1>
            <div className="text-xs font-mono text-[var(--color-text-muted)] space-y-0.5">
              <div>{about.publishedAt}</div>
              <div>Updated {about.updatedAt}</div>
            </div>
          </header>

          <div className="prose text-sm max-w-none pb-16" dangerouslySetInnerHTML={{ __html: html }} />

          <GiscusComments lang={lang} />
        </article>

        {headings.length > 0 && (
          <aside className="hidden lg:block w-48 shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto border-l border-[var(--color-border)] pl-4">
            <TableOfContents headings={headings} />
          </aside>
        )}
      </div>
    </PageContainer>
  );
}
