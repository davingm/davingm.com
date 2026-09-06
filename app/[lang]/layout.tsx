import { getSiteConfig, getAllBlogPosts, getAllProjectPosts } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Language } from "@/lib/types";
import { SearchItem } from "@/components/SearchModal";
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
  const site = getSiteConfig(lang);

  return {
    title: {
      default: site.title,
      template: `%s | ${site.title}`,
    },
    description: site.description,
  };
}

export default async function LanguageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Language };
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

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="w-full max-w-3xl mx-auto px-5 sm:px-8">
        <Header lang={lang} site={site} searchItems={searchItems} />
      </div>
      <main className="flex-1 py-4 w-full">{children}</main>
      <div className="w-full max-w-3xl mx-auto px-5 sm:px-8">
        <Footer site={site} />
      </div>
    </div>
  );
}
