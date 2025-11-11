import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/PCSYSTEM' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/PCSYSTEM/' : '',
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;