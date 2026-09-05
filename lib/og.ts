export interface OgImageOptions {
  title: string;
  subtitle?: string;
  author?: string;
  siteName?: string;
  tag?: string;
}

export function generateOgSvg({
  title,
  subtitle,
  author = "Kin",
  siteName = "Kin's Blog",
  tag,
}: OgImageOptions): string {
  // Clean text for XML
  const clean = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const safeTitle = clean(title);
  const safeSubtitle = subtitle ? clean(subtitle) : "";
  const safeSite = clean(siteName);
  const safeAuthor = clean(author);
  const safeTag = tag ? clean(tag) : "";

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dot-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1.5" fill="#374151" fill-opacity="0.25" />
    </pattern>
    <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2ABC89" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#1D1F20" />
  <rect width="1200" height="630" fill="url(#dot-grid)" />

  <!-- Outer Border -->
  <rect x="40" y="40" width="1120" height="550" rx="16" fill="none" stroke="#2D3134" stroke-width="2" />

  <!-- Top bar / Brand -->
  <g transform="translate(80, 100)">
    <!-- Custom Icon (Minimalist Terminal / Diamond) -->
    <rect x="0" y="0" width="36" height="36" rx="8" fill="url(#brand-grad)" />
    <path d="M12 18 L18 12 L24 18 L18 24 Z" fill="#1D1F20" />
    <text x="50" y="25" font-family="-apple-system, BlinkMacSystemFont, 'Geist Sans', 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="600" fill="#2ABC89" letter-spacing="-0.5">${safeSite}</text>
    ${safeTag
      ? `<rect x="900" y="2" width="${Math.min(140, safeTag.length * 12 + 20)}" height="28" rx="6" fill="#FB7185" fill-opacity="0.15" stroke="#FB7185" stroke-opacity="0.4" stroke-width="1" />
           <text x="910" y="21" font-family="sans-serif" font-size="13" font-weight="600" fill="#FB7185">${safeTag.substring(0, 15)}</text>`
      : ""
    }
  </g>

  <!-- Main Title -->
  <g transform="translate(80, 260)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Geist Sans', 'Segoe UI', Roboto, sans-serif" font-size="48" font-weight="700" fill="#F3F4F6" letter-spacing="-0.02em">
      <tspan x="0" dy="0">${safeTitle.slice(0, 36)}</tspan>
      ${safeTitle.length > 36 ? `<tspan x="0" dy="60">${safeTitle.slice(36, 75)}</tspan>` : ""}
    </text>
    ${safeSubtitle
      ? `<text x="0" y="${safeTitle.length > 36 ? 120 : 65}" font-family="sans-serif" font-size="22" fill="#9CA3AF">${safeSubtitle.slice(0, 75)}</text>`
      : ""
    }
  </g>

  <!-- Bottom Info -->
  <g transform="translate(80, 520)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Geist Sans', 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="500" fill="#9CA3AF">by ${safeAuthor}</text>
    <text x="940" y="0" font-family="monospace" font-size="16" fill="#6B7280">davingm.com</text>
  </g>
</svg>`;
}
