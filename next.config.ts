import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  // Solo usar export para GitHub Pages, standalone para Render
  output: isGitHubPages ? 'export' : 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: isGitHubPages,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Solo usar basePath para GitHub Pages
  ...(isGitHubPages && {
    basePath: '/PCSYSTEM',
    assetPrefix: '/PCSYSTEM/',
  }),
};

export default nextConfig;