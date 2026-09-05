import { getAboutData } from "@/lib/content";
import { Language } from "@/lib/types";
import { TableOfContents } from "@/components/TableOfContents";
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

  const headings = about.sections.map((s) => ({
    id: s.id,
    text: s.title,
    level: 2,
  }));

  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 min-w-0">
          <header className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--color-heading)] mb-3">
              {about.title}
            </h2>
            <div className="text-xs font-mono text-[var(--color-text-muted)] space-y-0.5">
              <div>{about.publishedAt}</div>
              <div>Updated {about.updatedAt}</div>
            </div>
          </header>

          <div className="prose text-sm max-w-none space-y-6">
            <p>{about.greeting}</p>

            {about.sections.map((section) => (
              <div key={section.id} className="pt-2">
                <h3
                  id={section.id}
                  className="group relative text-base font-bold text-[var(--color-heading)] mb-3 flex items-center"
                >
                  <a
                    href={`#${section.id}`}
                    className="header-anchor"
                    aria-hidden="true"
                  >
                    #
                  </a>
                  <span># {section.title}</span>
                </h3>

                {section.note && (
                  <div className="callout-note">
                    <div className="callout-title">Note</div>
                    <div className="text-xs text-[var(--color-text)]">
                      {section.note}
                    </div>
                  </div>
                )}

                <div
                  className="text-xs sm:text-sm text-[var(--color-text)] leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: section.content
                      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--color-accent)] underline">$1</a>'),
                  }}
                />

                {section.footnote && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-2">
                    {section.footnote}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Comments section */}
          {about.comments?.enabled && (
            <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-[var(--color-heading)]">
                  Comments{" "}
                  <span className="text-xs font-normal text-[var(--color-text-muted)]">
                    {about.comments.total}
                  </span>
                </h3>
                <button className="text-xs font-medium text-[var(--color-accent)] hover:underline">
                  Use Twikoo
                </button>
              </div>

              <div className="space-y-4">
                {about.comments.items?.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.avatar}
                      alt={item.author}
                      className="w-7 h-7 rounded-full border border-[var(--color-border)] object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-[var(--color-heading)]">
                          {item.author}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                          {item.date}
                        </span>
                      </div>
                      <div className="text-[var(--color-text)]">
                        {item.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop TOC */}
        {headings.length > 0 && (
          <aside className="hidden lg:block w-52 shrink-0 sticky top-12 pl-4 border-l border-[var(--color-border)]">
            <TableOfContents headings={headings} />
          </aside>
        )}
      </div>
    </div>
  );
}
