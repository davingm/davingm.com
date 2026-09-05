import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { load } from "js-yaml";
import {
  Language,
  SiteConfig,
  BlogPost,
  ProjectPost,
  LinksData,
  AboutData,
  ProjectsData,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getSiteConfig(lang: Language = "zh"): SiteConfig {
  const filePath = path.join(CONTENT_DIR, "www", lang, "site.yml");
  if (!fs.existsSync(filePath)) {
    const fallback = path.join(CONTENT_DIR, "www", "zh", "site.yml");
    if (fs.existsSync(fallback)) {
      return load(fs.readFileSync(fallback, "utf8")) as SiteConfig;
    }
    return {
      title: "Kin's Blog",
      author: "Kin",
      tagline: "Now or never .",
      url: "https://davingm.com",
      description: "纯 SSG 静态博客",
      bio: "Hi, 我是 Kin!",
      commit: "121c93e",
      generator: "made with nextjs v16.3.4",
      nav: [],
      social: {},
    };
  }
  return load(fs.readFileSync(filePath, "utf8")) as SiteConfig;
}

export function getAboutData(lang: Language = "zh"): AboutData {
  const filePath = path.join(CONTENT_DIR, "www", lang, "about.yml");
  if (fs.existsSync(filePath)) {
    return load(fs.readFileSync(filePath, "utf8")) as AboutData;
  }
  const fallback = path.join(CONTENT_DIR, "www", "zh", "about.yml");
  if (fs.existsSync(fallback)) {
    return load(fs.readFileSync(fallback, "utf8")) as AboutData;
  }
  return {
    title: "About",
    publishedAt: "2026-08-27 21:59:19",
    updatedAt: "2026-08-27 22:49:18",
    greeting: "Hi!",
    sections: [],
  };
}

export function getLinksData(lang: Language = "zh"): LinksData {
  const filePath = path.join(CONTENT_DIR, "www", lang, "links.yml");
  if (fs.existsSync(filePath)) {
    return load(fs.readFileSync(filePath, "utf8")) as LinksData;
  }
  const fallback = path.join(CONTENT_DIR, "www", "zh", "links.yml");
  if (fs.existsSync(fallback)) {
    return load(fs.readFileSync(fallback, "utf8")) as LinksData;
  }
  return {
    title: "Links",
    publishedAt: "2026-08-27 21:59:19",
    updatedAt: "2026-08-28 00:49:11",
    description: "",
    links: [],
  };
}

export function getProjectsData(lang: Language = "zh"): ProjectsData {
  const filePath = path.join(CONTENT_DIR, "www", lang, "projects.yml");
  if (fs.existsSync(filePath)) {
    return load(fs.readFileSync(filePath, "utf8")) as ProjectsData;
  }
  const fallback = path.join(CONTENT_DIR, "www", "zh", "projects.yml");
  if (fs.existsSync(fallback)) {
    return load(fs.readFileSync(fallback, "utf8")) as ProjectsData;
  }
  return {
    title: "Projects",
    publishedAt: "2026-08-27 21:59:19",
    updatedAt: "2026-08-27 22:49:18",
    featured: [],
  };
}

export function getAllBlogPosts(lang: Language = "zh"): BlogPost[] {
  const dir = path.join(CONTENT_DIR, "blog", lang);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);

    const tagStr = data.tag || "";
    const tags = tagStr
      .split(/[,，]/)
      .map((t: string) => t.trim())
      .filter(Boolean);

    // approximate reading time (200 words / chars per min)
    const words = content.trim().length;
    const readingTime = Math.max(1, Math.ceil(words / 400));

    return {
      slug,
      lang,
      title: data.title || slug,
      subtitle: data.subtitle || "",
      summary: data.summary || "",
      image: data.image || "",
      publishedAt: data.publishedAt || "2026-01-01",
      tag: tagStr,
      tags,
      content,
      readingTime,
    } as BlogPost;
  });

  return posts.sort((a, b) => (new Date(b.publishedAt).getTime() || 0) - (new Date(a.publishedAt).getTime() || 0));
}

export function getBlogPostBySlug(slug: string, lang: Language = "zh"): BlogPost | null {
  const posts = getAllBlogPosts(lang);
  const found = posts.find((p) => p.slug === slug);
  if (found) return found;

  // fallback to zh if not found in requested lang
  if (lang !== "zh") {
    const zhPosts = getAllBlogPosts("zh");
    return zhPosts.find((p) => p.slug === slug) || null;
  }
  return null;
}

export function getAllProjectPosts(lang: Language = "zh"): ProjectPost[] {
  const dir = path.join(CONTENT_DIR, "project", lang);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const projects = files.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);

    return {
      slug,
      lang,
      title: data.title || slug,
      publishedAt: data.publishedAt || "2026-01-01",
      summary: data.summary || "",
      images: Array.isArray(data.images) ? data.images : data.image ? [data.image] : [],
      team: Array.isArray(data.team) ? data.team : [],
      link: data.link || "",
      github: data.github || "",
      demo: data.demo || "",
      tech: data.tech || "",
      content,
    } as ProjectPost;
  });

  return projects.sort((a, b) => (new Date(b.publishedAt).getTime() || 0) - (new Date(a.publishedAt).getTime() || 0));
}

export function getProjectPostBySlug(slug: string, lang: Language = "zh"): ProjectPost | null {
  const list = getAllProjectPosts(lang);
  const found = list.find((p) => p.slug === slug);
  if (found) return found;

  if (lang !== "zh") {
    const zhList = getAllProjectPosts("zh");
    return zhList.find((p) => p.slug === slug) || null;
  }
  return null;
}

export function getAllCategories(lang: Language = "zh"): string[] {
  const posts = getAllBlogPosts(lang);
  const set = new Set<string>();
  posts.forEach((p) => {
    p.tags.forEach((t) => {
      if (t) set.add(t);
    });
  });
  return Array.from(set);
}

export function getGroupedArchivePosts(lang: Language = "zh"): Record<string, BlogPost[]> {
  const posts = getAllBlogPosts(lang);
  const grouped: Record<string, BlogPost[]> = {};

  posts.forEach((p) => {
    const year = p.publishedAt ? p.publishedAt.substring(0, 4) : "Other";
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(p);
  });

  return grouped;
}
