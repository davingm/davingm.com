import fs from "fs";
import path from "path";
import { generateRssFeed } from "../lib/feed";
import { generateSitemapXml } from "../lib/sitemap";

function generate() {
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Generate RSS feed
  const rssContent = generateRssFeed("zh");
  fs.writeFileSync(path.join(publicDir, "rss.xml"), rssContent, "utf8");
  console.log("✓ Generated public/rss.xml");

  // 2. Generate Sitemap
  const sitemapContent = generateSitemapXml();
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapContent, "utf8");
  console.log("✓ Generated public/sitemap.xml");
}

generate();
