import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/PCSYSTEM',
  assetPrefix: '/PCSYSTEM/',
};

export default nextConfig;