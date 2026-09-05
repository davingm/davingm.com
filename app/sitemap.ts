import { MetadataRoute } from "next";
import { getAllBlogPosts, getAllProjectPosts } from "@/lib/content";
import { Language } from "@/lib/types";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://davingm.com";
  const languages: Language[] = ["zh", "en", "id"];
  const staticPages = ["", "posts", "archive", "about", "projects", "links"];

  const entries: MetadataRoute.Sitemap = [];

  // Root entry
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  });

  languages.forEach((lang) => {
    staticPages.forEach((page) => {
      const path = page ? `${lang}/${page}` : lang;
      entries.push({
        url: `${baseUrl}/${path}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 0.9 : 0.8,
      });
    });

    const posts = getAllBlogPosts(lang);
    posts.forEach((post) => {
      entries.push({
        url: `${baseUrl}/${lang}/posts/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });

    const projects = getAllProjectPosts(lang);
    projects.forEach((proj) => {
      entries.push({
        url: `${baseUrl}/${lang}/projects/${proj.slug}`,
        lastModified: new Date(proj.publishedAt),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });
  });

  return entries;
}
