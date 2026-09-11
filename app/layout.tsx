import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { MarkdownCodeCopy } from "@/components/MarkdownCodeCopy";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  // Only preload mono font when actually needed (code blocks)
  preload: false,
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1D1F20" },
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://davingm.com"),
  title: {
    default: "Kin's Blog",
    template: "%s — Kin's Blog",
  },
  description: "纯 SSG 静态博客，极简设计，专注内容与性能。",
  authors: [{ name: "Kin", url: "https://davingm.com" }],
  creator: "Kin",
  publisher: "Kin",
  icons: {
    icon: [
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/images/site.webmanifest",
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/zh",
      "en-US": "/en",
      "id-ID": "/id",
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://davingm.com",
    title: "Kin's Blog",
    description: "纯 SSG 静态博客，极简设计，专注内容与性能。",
    siteName: "Kin's Blog",
    images: [
      {
        url: "/images/og/ogimage-new.png",
        width: 1200,
        height: 630,
        alt: "Kin's Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kin's Blog",
    description: "纯 SSG 静态博客，极简设计，专注内容与性能。",
    images: ["/images/og/ogimage-new.png"],
  },
};

// Minimal theme init — runs before paint to prevent flash
// Intentionally minified: no whitespace, no comments in output HTML
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="manifest" href="/images/site.webmanifest" />
        {/* Theme init: must be blocking to prevent dark/light flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col font-sans transition-colors duration-150`}
      >
        {children}
        <MarkdownCodeCopy />
        {/* Google Analytics — deferred, off critical path */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8299K8G21E"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-8299K8G21E');
        `}</Script>
      </body>
    </html>
  );
}
