import { getAboutData } from "@/lib/content";
import { extractHeadings, renderMarkdown } from "@/lib/markdown";
import { Language } from "@/lib/types";
import { TableOfContents } from "@/components/TableOfContents";
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
    <>
      {headings.length > 0 && (
        <aside
          className="hidden fixed top-20 w-44
                     border-l border-[var(--color-border)] pl-4 pt-1
                     [@media(min-width:1150px)]:block"
          style={{ left: "calc(50% + 24rem + 1.5rem)" }}
        >
          <TableOfContents headings={headings} />
        </aside>
      )}

      <article className="w-full max-w-3xl mx-auto px-5 sm:px-8">
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
    </>
  );
}
