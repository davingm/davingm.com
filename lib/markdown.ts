import { marked } from "marked";

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
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

  renderer.heading = ({ tokens, depth }) => {
    const raw = tokens.map((t) => t.raw).join("");
    const id = headingToId(raw);
    return `<h${depth} id="${id}" class="group relative flex items-center"><a href="#${id}" class="header-anchor" aria-hidden="true">#</a><span>${raw}</span></h${depth}>`;
  };

  renderer.code = ({ text, lang }) => {
    const language = lang || "text";
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<div class="code-block-wrapper my-4 relative rounded-md border border-[var(--color-border)] bg-[var(--color-code-bg)] overflow-hidden font-mono text-sm">
      <div class="flex items-center justify-between px-3 py-1.5 text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border)] bg-[var(--color-code-header)]">
        <span>${language}</span>
      </div>
      <pre class="p-4 overflow-x-auto"><code>${escaped}</code></pre>
    </div>`;
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

  return await marked.parse(markdown);
}
