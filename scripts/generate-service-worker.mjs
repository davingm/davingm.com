import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "out");
const publicDir = path.join(root, "public");
const serviceWorkerTemplate = path.join(publicDir, "service-worker.js");
const serviceWorkerOutput = path.join(outputDir, "service-worker.js");
const precacheExtensions = new Set([".html", ".js", ".css", ".woff", ".woff2", ".ttf", ".otf"]);
const precachePaths = new Set(["/off.gif"]);

function collectFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
  });
}

if (!fs.existsSync(outputDir) || !fs.existsSync(serviceWorkerTemplate)) {
  throw new Error("Static export or service worker template is missing.");
}

for (const filePath of collectFiles(outputDir)) {
  const relativePath = `/${path.relative(outputDir, filePath).replaceAll("\\", "/")}`;
  const extension = path.extname(filePath).toLowerCase();

  if (
    precacheExtensions.has(extension) &&
    (extension === ".html" || relativePath.startsWith("/_next/static/"))
  ) {
    precachePaths.add(relativePath);
  }
}

const template = fs.readFileSync(serviceWorkerTemplate, "utf8");
const generatedWorker = template.replace(
  "__PRECACHE_URLS__",
  JSON.stringify([...precachePaths].sort()),
);

fs.writeFileSync(serviceWorkerOutput, generatedWorker, "utf8");
console.log(`[offline] Generated service worker with ${precachePaths.size} cached files.`);
