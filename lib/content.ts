import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { load } from "js-yaml";
import {
  Language,
  SiteConfig,
  AnimeEntry,
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
      tagline: "Veni , Vidi, Vici.",
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
  const filePath = path.join(CONTENT_DIR, "www", lang, "about.md");
  if (fs.existsSync(filePath)) {
    const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
    return { ...data, content } as AboutData;
  }
  const fallback = path.join(CONTENT_DIR, "www", "zh", "about.md");
  if (fs.existsSync(fallback)) {
    const { data, content } = matter(fs.readFileSync(fallback, "utf8"));
    return { ...data, content } as AboutData;
  }
  return {
    title: "About",
    publishedAt: "2026-08-27 21:59:19",
    updatedAt: "2026-08-27 22:49:18",
    content: "",
  };
}

export function getLinksData(lang: Language = "zh"): LinksData {
  const filePath = path.join(CONTENT_DIR, "www", lang, "links.md");
  if (fs.existsSync(filePath)) {
    const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
    return { ...data, content } as LinksData;
  }
  const fallback = path.join(CONTENT_DIR, "www", "zh", "links.md");
  if (fs.existsSync(fallback)) {
    const { data, content } = matter(fs.readFileSync(fallback, "utf8"));
    return { ...data, content } as LinksData;
  }
  return {
    title: "Links",
    publishedAt: "2026-08-27 21:59:19",
    updatedAt: "2026-08-28 00:49:11",
    description: "",
    links: [],
    content: "",
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

export function getAllAnimeEntries(lang: Language = "zh"): AnimeEntry[] {
  const dir = path.join(CONTENT_DIR, "anime", lang);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));
  const entries = files.map((file) => {
    const filePath = path.join(dir, file);
    const { data } = matter(fs.readFileSync(filePath, "utf8"));
    const slug = file.replace(/\.mdx$/, "");

    if (!Number.isInteger(data.year) || data.year < 1900 || data.year > 9999) {
      throw new Error(`Invalid or missing year in ${filePath}`);
    }
    if (typeof data.watchedAt !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data.watchedAt)) {
      throw new Error(`Anime watchedAt must use YYYY-MM-DD format in ${filePath}`);
    }
    const watchedAtDate = new Date(`${data.watchedAt}T00:00:00Z`);
    if (
      Number.isNaN(watchedAtDate.getTime()) ||
      watchedAtDate.toISOString().slice(0, 10) !== data.watchedAt ||
      Number(data.watchedAt.slice(0, 4)) !== data.year
    ) {
      throw new Error(`Anime watchedAt must be a valid date matching year in ${filePath}`);
    }
    if (typeof data.title !== "string" || !data.title.trim()) {
      throw new Error(`Invalid or missing title in ${filePath}`);
    }
    if (typeof data.description !== "string" || !data.description.trim()) {
      throw new Error(`Invalid or missing description in ${filePath}`);
    }
    if (!Array.isArray(data.images) || data.images.length < 1 || data.images.length > 5 ||
      data.images.some((image: unknown) => typeof image !== "string" || !image.trim())) {
      throw new Error(`Anime images must contain between 1 and 5 paths in ${filePath}`);
    }
    if (!Number.isInteger(data.rating) || data.rating < 0 || data.rating > 10) {
      throw new Error(`Anime rating must be an integer from 0 to 10 in ${filePath}`);
    }
    if (!Number.isInteger(data.episodeDurationMinutes) ||
      data.episodeDurationMinutes < 20 || data.episodeDurationMinutes > 40) {
      throw new Error(`Episode duration must be between 20 and 40 minutes in ${filePath}`);
    }
    if (!Array.isArray(data.categories) ||
      data.categories.some((category: unknown) => typeof category !== "string" || !category.trim())) {
      throw new Error(`Anime categories must be an array of non-empty strings in ${filePath}`);
    }
    if (data.pinned !== undefined && typeof data.pinned !== "boolean") {
      throw new Error(`Anime pinned must be true or false in ${filePath}`);
    }

    return {
      slug,
      year: data.year as number,
      watchedAt: data.watchedAt as string,
      title: data.title.trim() as string,
      description: data.description.trim() as string,
      images: data.images as string[],
      rating: data.rating as number,
      episodeDurationMinutes: data.episodeDurationMinutes as number,
      categories: data.categories as string[],
      pinned: data.pinned === true,
    };
  });

  return entries.sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) ||
      b.year - a.year ||
      b.watchedAt.localeCompare(a.watchedAt) ||
      a.title.localeCompare(b.title),
  );
}
