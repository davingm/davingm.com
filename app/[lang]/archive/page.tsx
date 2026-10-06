import { getAllAnimeEntries, getGroupedArchivePosts } from "@/lib/content";
import { Language } from "@/lib/types";
import { PageContainer } from "@/components/PageContainer";
import { ArchiveViews } from "./ArchiveViews";
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
    description: "Anime and blog archive.",
  };
}

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Language };
  const grouped = getGroupedArchivePosts(lang);
  const animeEntries = getAllAnimeEntries(lang);

  return (
    <PageContainer>
      <div className="space-y-10">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-heading)]">
          Archive
        </h2>
        <ArchiveViews
          lang={lang}
          animeEntries={animeEntries}
          blogPostsByYear={grouped}
        />
      </div>
    </PageContainer>
  );
}
