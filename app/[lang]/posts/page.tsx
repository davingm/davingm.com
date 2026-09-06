import { getAllBlogPosts, getAllCategories } from "@/lib/content";
import { Language } from "@/lib/types";
import { PostsList } from "./PostsList";
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
    title: lang === "zh" ? "文章" : lang === "id" ? "Artikel" : "Posts",
    description: "All published blog posts and articles.",
  };
}

export default async function PostsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Language };
  const posts = getAllBlogPosts(lang);
  const categories = getAllCategories(lang);

  return (
    <PageContainer>
      <div className="space-y-10">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-heading)]">
          Posts
        </h2>

        <PostsList lang={lang} posts={posts} categories={categories} />
      </div>
    </PageContainer>
  );
}
