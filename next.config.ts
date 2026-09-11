import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  compiler: {
    // Remove console.* calls in production builds
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // Tree-shake only used icons/svg from these packages
    optimizePackageImports: ["lucide-react", "simple-icons"],
  },
};

export default nextConfig;
