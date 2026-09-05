import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const matter = require("gray-matter");

const cwd = process.cwd();
const publicDir = path.join(cwd, "public");
const contentDir = path.join(cwd, "content");

function getSiteConfig(lang = "zh") {
  const filePath = path.join(contentDir, "www", lang, "site.yml");
  if (fs.existsSync(filePath)) {
    return yaml.load(fs.readFileSync(filePath, "utf8"));
  }
  return {
    title: "Kin's Blog",
    author: "Kin",
    tagline: "Now or never .",
    url: "https://davingm.com",
    description: "纯 SSG 静态博客",
  };
}

function getAllBlogPosts(lang = "zh") {
  const dir = path.join(contentDir, "blog", lang);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
  return files.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title || slug,
      summary: data.summary || data.subtitle || "",
      publishedAt: data.publishedAt || "2026-01-01",
      tag: data.tag || "",
    };
  }).sort((a, b) => (new Date(b.publishedAt).getTime() || 0) - (new Date(a.publishedAt).getTime() || 0));
}

function getAllProjectPosts(lang = "zh") {
  const dir = path.join(contentDir, "project", lang);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
  return files.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title || slug,
      publishedAt: data.publishedAt || "2026-01-01",
    };
  });
}

function generateRss() {
  const site = getSiteConfig("zh");
  const posts = getAllBlogPosts("zh");
  const siteUrl = site.url || "https://davingm.com";

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${siteUrl}/zh/posts/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.summary}]]></description>
      <author>${site.author}</author>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${site.title}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${site.description}]]></description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;
}

function generateSitemap() {
  const baseUrl = "https://davingm.com";
  const languages = ["zh", "en", "id"];
  const staticPages = ["", "posts", "archive", "about", "projects", "links"];

  const urls = [];
  languages.forEach((lang) => {
    staticPages.forEach((page) => {
      const pathStr = page ? `${lang}/${page}` : lang;
      urls.push({
        loc: `${baseUrl}/${pathStr}`,
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: page === "" ? "daily" : "weekly",
        priority: page === "" ? "1.0" : "0.8",
      });
    });

    const blogPosts = getAllBlogPosts(lang);
    blogPosts.forEach((post) => {
      urls.push({
        loc: `${baseUrl}/${lang}/posts/${post.slug}`,
        lastmod: post.publishedAt,
        changefreq: "monthly",
        priority: "0.7",
      });
    });

    const projects = getAllProjectPosts(lang);
    projects.forEach((proj) => {
      urls.push({
        loc: `${baseUrl}/${lang}/projects/${proj.slug}`,
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

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, "rss.xml"), generateRss(), "utf8");
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), generateSitemap(), "utf8");
console.log("✓ Generated public/rss.xml and public/sitemap.xml successfully");
