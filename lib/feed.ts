import { getAllBlogPosts, getSiteConfig } from "./content";
import { Language } from "./types";

export function generateRssFeed(lang: Language = "zh"): string {
  const site = getSiteConfig(lang);
  const posts = getAllBlogPosts(lang);
  const siteUrl = site.url || "https://davingm.com";

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${siteUrl}/${lang}/posts/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.summary || post.subtitle || ""}]]></description>
      <author>${site.author}</author>
      ${post.tags.map((t) => `<category>${t}</category>`).join("\n      ")}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${site.title}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${site.description}]]></description>
    <language>${lang === "zh" ? "zh-CN" : lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;
}
