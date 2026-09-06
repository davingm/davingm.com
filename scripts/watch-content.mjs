import crypto from "crypto";
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import chokidar from "chokidar";
import matter from "gray-matter";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const root = process.cwd();
const contentRoot = path.join(root, "content");
const watchedPaths = [
  path.join(contentRoot, "blog"),
  path.join(contentRoot, "project"),
  path.join(contentRoot, "www"),
];
const signatures = new Map();
let ready = false;

function isManagedFile(filePath) {
  const relativePath = path.relative(contentRoot, filePath).replaceAll("\\", "/");
  const extension = path.extname(filePath).toLowerCase();

  if (relativePath.startsWith("blog/") || relativePath.startsWith("project/")) {
    return extension === ".md" || extension === ".mdx";
  }

  return /^www\/[^/]+\/(about\.md|links\.yml|projects\.yml)$/.test(relativePath);
}

function nowWithOffset() {
  const date = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const pad = (value) => String(value).padStart(2, "0");

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}+08:00`;
}

function metadataSignature(filePath, raw) {
  const extension = path.extname(filePath).toLowerCase();
  let metadata;
  let content = "";

  if (extension === ".md" || extension === ".mdx") {
    const parsed = matter(raw);
    metadata = { ...parsed.data };
    content = parsed.content;
  } else {
    metadata = yaml.load(raw) || {};
  }

  delete metadata.publishedAt;
  delete metadata.updatedAt;

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(metadata) + "\n" + content)
    .digest("hex");
}

function updateFields(raw, fields, isMarkdown) {
  const newline = raw.includes("\r\n") ? "\r\n" : "\n";
  const lines = raw.split(/\r?\n/);
  let start = 0;
  let end = lines.length - 1;

  if (isMarkdown) {
    if (lines[0] !== "---") {
      return [`---`, ...Object.entries(fields).map(([key, value]) => `${key}: "${value}"`), `---`, "", raw].join(newline);
    }

    end = lines.findIndex((line, index) => index > 0 && line === "---");
    if (end === -1) return raw;
  }

  for (const [key, value] of Object.entries(fields)) {
    const fieldIndex = lines.findIndex(
      (line, index) => index >= start && index < end && new RegExp(`^\\s*${key}\\s*:`).test(line),
    );

    if (fieldIndex >= 0) {
      const indentation = lines[fieldIndex].match(/^\s*/)?.[0] || "";
      lines[fieldIndex] = `${indentation}${key}: "${value}"`;
    } else {
      lines.splice(isMarkdown ? end : 0, 0, `${key}: "${value}"`);
      if (isMarkdown) end += 1;
    }
  }

  return lines.join(newline);
}

function processFile(filePath, { contentChanged = false } = {}) {
  if (!isManagedFile(filePath) || !fs.existsSync(filePath)) return;

  const raw = fs.readFileSync(filePath, "utf8");
  const extension = path.extname(filePath).toLowerCase();
  const isMarkdown = extension === ".md" || extension === ".mdx";
  const parsed = isMarkdown ? matter(raw).data : yaml.load(raw) || {};
  const fields = {};

  if (!parsed.publishedAt) fields.publishedAt = nowWithOffset();
  if (!parsed.updatedAt || contentChanged) fields.updatedAt = nowWithOffset();
  if (Object.keys(fields).length === 0) {
    signatures.set(filePath, metadataSignature(filePath, raw));
    return;
  }

  const next = updateFields(raw, fields, isMarkdown);
  if (next !== raw) {
    fs.writeFileSync(filePath, next, "utf8");
    console.log(`[content] updated ${path.relative(root, filePath)}`);
  }
  signatures.set(filePath, metadataSignature(filePath, next));
}

function handleFile(filePath, options) {
  if (!isManagedFile(filePath)) return;

  const raw = fs.readFileSync(filePath, "utf8");
  const signature = metadataSignature(filePath, raw);
  if (options.initialize) {
    signatures.set(filePath, signature);
    return;
  }
  const previousSignature = signatures.get(filePath);

  if (options.contentChanged && previousSignature === signature) return;
  processFile(filePath, options);
}

const watcher = chokidar.watch(watchedPaths, {
  ignored: /(^|[\\/])\../,
  ignoreInitial: false,
  awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 },
});

watcher
  .on("add", (filePath) => handleFile(filePath, { contentChanged: false, initialize: !ready }))
  .on("change", (filePath) => handleFile(filePath, { contentChanged: true }))
  .on("unlink", (filePath) => signatures.delete(filePath))
  .on("ready", () => {
    ready = true;
    console.log("[content] watching blog, project, about, links and projects metadata");
  })
  .on("error", (error) => console.error("[content] watcher error", error));