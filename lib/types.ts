export type Language = "zh" | "en" | "id";

export interface NavItem {
  name: string;
  path: string;
}

export interface SiteConfig {
  title: string;
  author: string;
  avatar?: string;
  tagline: string;
  url: string;
  description: string;
  bio: string;
  commit: string;
  generator: string;
  nav: NavItem[];
  social: {
    github?: string;
    twitter?: string;
  };
}

export interface BlogPost {
  slug: string;
  lang: Language;
  title: string;
  subtitle?: string;
  summary: string;
  image?: string;
  publishedAt: string;
  tag: string;
  tags: string[];
  content: string;
  html?: string;
  readingTime?: number;
}

export interface ProjectTeamMember {
  name: string;
  role: string;
  avatar?: string;
  github?: string;
}

export interface ProjectPost {
  slug: string;
  lang: Language;
  title: string;
  publishedAt: string;
  summary: string;
  images: string[];
  team?: ProjectTeamMember[];
  link?: string;
  github?: string;
  demo?: string;
  tech?: string;
  content: string;
  html?: string;
}

export interface FriendLink {
  name: string;
  desc: string;
  url: string;
  avatar?: string;
  stack?: string;
}

export interface LinksData {
  title: string;
  publishedAt: string;
  updatedAt: string;
  description: string;
  links: FriendLink[];
}

export interface CommentItem {
  author: string;
  avatar: string;
  date: string;
  content: string;
}

export interface AboutData {
  title: string;
  publishedAt: string;
  updatedAt: string;
  content: string;
  comments?: {
    enabled: boolean;
    total: number;
    provider?: string;
    items?: CommentItem[];
  };
}

export interface FeaturedProject {
  name: string;
  role: string;
  url: string;
}

export interface ProjectsData {
  title: string;
  publishedAt: string;
  updatedAt: string;
  featured: FeaturedProject[];
  comments?: {
    enabled: boolean;
    total: number;
  };
}
