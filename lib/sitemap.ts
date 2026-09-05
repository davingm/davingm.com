import { getAllBlogPosts, getAllProjectPosts } from "./content";
import { Language } from "./types";

export function generateSitemapXml(): string {
  const siteUrl = "https://davingm.com";
  const languages: Language[] = ["zh", "en", "id"];
  const staticPages = ["", "posts", "archive", "about", "projects", "links"];

  const urls: { loc: string; lastmod?: string; changefreq: string; priority: string }[] = [];

  // Static pages for each language
  languages.forEach((lang) => {
    staticPages.forEach((page) => {
      const path = page ? `${lang}/${page}` : lang;
      urls.push({
        loc: `${siteUrl}/${path}`,
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: page === "" ? "daily" : "weekly",
        priority: page === "" ? "1.0" : "0.8",
      });
    });

    // Blog posts
    const blogPosts = getAllBlogPosts(lang);
    blogPosts.forEach((post) => {
      urls.push({
        loc: `${siteUrl}/${lang}/posts/${post.slug}`,
        lastmod: post.publishedAt,
        changefreq: "monthly",
        priority: "0.7",
      });
    });

    // Project posts
    const projects = getAllProjectPosts(lang);
    projects.forEach((proj) => {
      urls.push({
        loc: `${siteUrl}/${lang}/projects/${proj.slug}`,
        lastmod: proj.publishedAt,
        changefreq: "monthly",
        priority: "0.6",
      });
    });
  });

  const urlElements = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}
