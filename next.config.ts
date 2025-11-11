import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Solo usar basePath en producción
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/PCSYSTEM',
    assetPrefix: '/PCSYSTEM/',
  }),
};

export default nextConfig;