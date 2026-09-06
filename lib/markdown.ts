import { marked } from "marked";
import { createHighlighter } from "shiki";

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

const highlighterPromise = createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: ["vue", "html", "javascript", "typescript", "css", "jsx"],
});

function getHighlightLanguage(language: string) {
  const normalized = language.toLowerCase().trim();

  if (normalized === "vue") return "vue";
  if (["html", "xml"].includes(normalized)) return "html";
  if (["ts", "typescript"].includes(normalized)) return "typescript";
  if (["css", "scss", "less"].includes(normalized)) return "css";
  if (["jsx", "react", "reactjs"].includes(normalized)) return "jsx";

  // Keep one predictable color language for Java, C/C++, Rust, and other formats.
  return "javascript";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function headingToId(rawText: string): string {
  // Strip markdown inline tokens: bold, italic, code, links — same as renderer's plainText
  const plain = rawText
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
  return plain
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function extractHeadings(markdown: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  // Normalize Windows CRLF → LF agar split bersih
  const lines = markdown.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  for (const line of lines) {
    const trimmed = line.trimEnd(); // buang \r sisa
    const match = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].trim();
      // Display text: strip markdown syntax only
      const text = rawText.replace(/[*_`]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
      const id = headingToId(rawText);
      headings.push({ id, text, level });
    }
  }

  return headings;
}

export async function renderMarkdown(markdown: string): Promise<string> {
  // Configure marked renderer
  const renderer = new marked.Renderer();
  const codeBlocks: { text: string; language: string }[] = [];

  renderer.heading = ({ tokens, depth }) => {
    const raw = tokens.map((t) => t.raw).join("");
    const id = headingToId(raw);
    return `<h${depth} id="${id}" class="group relative flex items-center"><a href="#${id}" class="header-anchor" aria-hidden="true">#</a><span>${raw}</span></h${depth}>`;
  };

  renderer.code = ({ text, lang }) => {
    const index = codeBlocks.push({ text, language: lang || "text" }) - 1;
    return `<!--MARKDOWN_CODE_BLOCK_${index}-->`;
  };

  renderer.blockquote = ({ tokens }) => {
    const body = tokens.map((t) => t.raw).join("");
    return `<blockquote class="my-4 border-l-2 border-[var(--color-accent)] pl-4 py-1 italic text-[var(--color-text-muted)] bg-[var(--color-quote-bg)] rounded-r">${body}</blockquote>`;
  };

  renderer.table = ({ header, rows }) => {
    const headerHtml = header.map((cell) => `<th class="border border-[var(--color-border)] px-4 py-2 text-left font-semibold">${cell.text}</th>`).join("");
    const rowsHtml = rows
      .map(
        (row) =>
          `<tr class="border-b border-[var(--color-border)]">${row
            .map((cell) => `<td class="border border-[var(--color-border)] px-4 py-2">${cell.text}</td>`)
            .join("")}</tr>`
      )
      .join("");

    return `<div class="overflow-x-auto my-4"><table class="w-full text-left border-collapse border border-[var(--color-border)]"><thead><tr class="bg-[var(--color-code-header)]">${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
  };

  marked.setOptions({
    gfm: true,
    breaks: true,
    renderer,
  });

  const rendered = await marked.parse(markdown);
  const highlighter = await highlighterPromise;
  const blocks = await Promise.all(
    codeBlocks.map(({ text, language }) => {
      const highlighted = highlighter.codeToHtml(text, {
        lang: getHighlightLanguage(language),
        themes: { light: "github-light", dark: "github-dark" },
      });
      const safeLanguage = escapeHtml(language);

      return `<div class="code-block-wrapper my-4 relative rounded-md border border-[var(--color-border)] bg-[var(--color-code-bg)] overflow-hidden font-mono text-sm" data-code-block>
        <div class="flex items-center justify-between gap-3 px-3 py-1.5 text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border)] bg-[var(--color-code-header)]">
          <span>${safeLanguage}</span>
          <button type="button" class="code-copy-button" data-code-copy aria-label="Copy code">Copy</button>
        </div>
        <div class="code-block-content overflow-x-auto">${highlighted}</div>
      </div>`;
    }),
  );

  return rendered.replace(
    /<!--MARKDOWN_CODE_BLOCK_(\d+)-->/g,
    (_, index: string) => blocks[Number(index)] || "",
  );
}
