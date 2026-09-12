import { SiteConfig } from "@/lib/types";
import Image from "next/image";

export function Footer({ site }: { site: SiteConfig }) {
  return (
    <footer className="relative mt-20 pt-8 pb-12 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)] flex items-center justify-between flex-wrap gap-4 font-mono">
      <div className="pointer-events-none absolute inset-x-0 bottom-full translate-y-[2px]">
        <Image
          src="/anime-footer-new.png"
          alt=""
          width={2170}
          height={725}
          className="block h-auto w-full"
          aria-hidden="true"
        />
      </div>

      <div>
        <span>{site.generator || "made with nextjs v16.3.4"}</span>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--color-heading)] hover:underline"
        >
          Feed
        </a>
        <a
          href="/sitemap.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--color-heading)] hover:underline"
        >
          Sitemap
        </a>
        {site.commit && (
          <a
            href={site.social.github ? `${site.social.github}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-heading)] hover:underline font-mono"
          >
            {site.commit}
          </a>
        )}
      </div>
    </footer>
  );
}
