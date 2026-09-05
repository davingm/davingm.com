import { getAllProjectPosts, getProjectPostBySlug, getSiteConfig } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { Language } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  const languages: Language[] = ["zh", "en", "id"];
  const params: { lang: string; slug: string }[] = [];

  languages.forEach((lang) => {
    const projects = getAllProjectPosts(lang);
    projects.forEach((proj) => {
      params.push({ lang, slug: proj.slug });
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
  const project = getProjectPostBySlug(slug, lang);
  const site = getSiteConfig(lang);

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Projects`,
    description: project.summary || site.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = (await params) as { lang: Language; slug: string };
  const project = getProjectPostBySlug(slug, lang);

  if (!project) {
    notFound();
  }

  const html = await renderMarkdown(project.content);

  return (
    <article className="space-y-8">
      <Link
        href={`/${lang}/projects`}
        className="text-xs font-mono text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
      >
        &larr; {lang === "zh" ? "返回项目列表" : lang === "id" ? "Kembali ke proyek" : "Back to projects"}
      </Link>

      <header className="border-b border-[var(--color-border)] pb-6 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-heading)]">
              {project.title}
            </h1>
            <p className="text-xs font-mono text-[var(--color-text-muted)] mt-1">
              {project.publishedAt}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded bg-[var(--color-accent)] text-white font-medium hover:opacity-90"
              >
                Live Demo &rarr;
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded border border-[var(--color-border)] hover:bg-[var(--color-quote-bg)] font-medium"
              >
                GitHub Repo
              </a>
            )}
          </div>
        </div>

        {project.summary && (
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            {project.summary}
          </p>
        )}

        {/* Multi-image showcase gallery */}
        {project.images.length > 0 && (
          <div className="pt-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Screenshots
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.images.map((img, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-code-bg)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team list */}
        {project.team && project.team.length > 0 && (
          <div className="pt-4 border-t border-[var(--color-border)]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Team & Contributors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.team.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]"
                >
                  {member.avatar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full border border-[var(--color-border)] object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[var(--color-heading)] truncate">
                      {member.github ? (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[var(--color-accent)] hover:underline"
                        >
                          {member.name}
                        </a>
                      ) : (
                        member.name
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)] truncate">
                      {member.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Markdown Body */}
      <div
        className="prose text-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
