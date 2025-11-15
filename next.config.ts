import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  // Solo usar export para GitHub Pages, standalone para Render
  output: isGitHubPages ? 'export' : 'standalone',
  trailingSlash: true,
  
  // Optimizaciones de imágenes
  images: {
    unoptimized: isGitHubPages,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Agregar placeholders
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Para futuras imágenes de Supabase
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  
  // Compresión
  compress: true,
  
  // Headers para SEO y seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ]
  },
  
  // Solo usar basePath para GitHub Pages
  ...(isGitHubPages && {
    basePath: '/PCSYSTEM',
    assetPrefix: '/PCSYSTEM/',
  }),
};

// Define the Product interface
interface Product {
  image?: string;
  CATEGORIA: string;
  NOMBRE: string;
}

const getProductImage = (product: Product) => {
  // Si el producto tiene imagen real, usarla
  if (product.image && product.image !== '') {
    return product.image;
  }

  // Crear placeholder más atractivo con colores basados en categoría
  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      'Computadores & Cables': '1a73e8',
      'Consolas y Videojuegos': 'ea4335',
      'Electrónica & Audio': '34a853',
      'Smartphones / Accesorios': 'fbbc04',
      'Almacenamiento': '9aa0a6',
      'Peluches': 'ff69b4',
      'Juguetes y Figuras': 'ff6347',
      'Bolsos y Modas': 'dda0dd',
      'Otros': '6c757d',
      'Impresión': '20c997',
      'Iluminación': 'ffc107',
      'Herramientas': 'fd7e14',
      'Papelería y Oficina': '6f42c1',
      'Transformadores': 'dc3545'
    };
    
    return categoryColors[category] || '6c757d';
  };

  const color = getCategoryColor(product.CATEGORIA);
  const productName = encodeURIComponent(product.NOMBRE.substring(0, 15));
  
  return `https://placehold.co/400x300/${color}/ffffff?text=${productName}&font=roboto`;
};

export default nextConfig;