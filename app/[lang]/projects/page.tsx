import { getProjectsData, getAllProjectPosts } from "@/lib/content";
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
    title: lang === "zh" ? "项目" : lang === "id" ? "Proyek" : "Projects",
    description: "Open source projects, libraries, and applications.",
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Language };
  const data = getProjectsData(lang);
  const projectPosts = getAllProjectPosts(lang);

  return (
    <PageContainer>
      <div className="space-y-10">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-heading)] mb-3">
          {data.title}
        </h2>
        <div className="text-xs font-mono text-[var(--color-text-muted)] space-y-0.5">
          <div>{data.publishedAt}</div>
          <div>Updated {data.updatedAt}</div>
        </div>
      </header>

      {/* Featured / Roles list (as seen in image.png) */}
      {data.featured.length > 0 && (
        <section className="space-y-2 text-sm text-[var(--color-text)]">
          <ul className="list-disc list-inside space-y-1.5">
            {data.featured.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent)] underline hover:opacity-80 font-medium mr-2"
                >
                  {item.name}
                </a>
                <span className="text-[var(--color-text-muted)]">— {item.role}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Major Projects Showcase with Multi-Images */}
      {projectPosts.length > 0 && (
        <section className="pt-6 space-y-10 border-t border-[var(--color-border)]">
          <h3 className="text-lg font-bold text-[var(--color-heading)]">
            {lang === "zh" ? "精选项目展示" : lang === "id" ? "Proyek Unggulan" : "Featured Project Showcase"}
          </h3>

          <div className="grid grid-cols-1 gap-8">
            {projectPosts.map((project) => (
              <article
                key={project.slug}
                className="border border-[var(--color-border)] bg-[var(--color-card)] rounded-xl p-5 sm:p-6 space-y-4 hover:border-[var(--color-accent)] transition-colors"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h4 className="text-lg font-bold text-[var(--color-heading)]">
                      <Link
                        href={`/${lang}/projects/${project.slug}`}
                        className="hover:text-[var(--color-accent)] underline-offset-4 hover:underline"
                      >
                        {project.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 font-mono">
                      {project.publishedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2.5 py-1 rounded bg-[var(--color-accent)] text-white font-medium hover:opacity-90"
                      >
                        Demo &rarr;
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2.5 py-1 rounded border border-[var(--color-border)] hover:bg-[var(--color-quote-bg)] font-medium"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {project.summary}
                </p>

                {/* Multi-images gallery preview */}
                {project.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {project.images.slice(0, 4).map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-video rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-code-bg)]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`${project.title} preview ${i + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {project.tech && (
                  <div className="pt-2 text-xs font-mono text-[var(--color-text-muted)]">
                    <span className="font-semibold text-[var(--color-heading)]">Stack: </span>
                    {project.tech}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Comments section */}
      <div className="pt-8 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[var(--color-heading)]">
            Comments
          </h3>
          <button className="text-xs font-medium text-[var(--color-accent)] hover:underline">
            Use Twikoo
          </button>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          {lang === "zh" ? "暂无评论。" : lang === "id" ? "Belum ada komentar." : "No comments yet."}
        </p>
      </div>
      </div>
    </PageContainer>
  );
}
