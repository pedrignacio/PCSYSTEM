import { Inter } from "next/font/google";
import "./globals.css";
// import { Analytics } from "@vercel/analytics/react"; ← COMENTAR ESTA LÍNEA
import WhatsAppWidget from "@/components/WhatsAppWidget";

// Optimizar fuente
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
});

export const metadata = {
  title: 'PCSystem Hualpén - Servicio Técnico PC, Notebooks y Consolas | Reparaciones Profesionales',
  description: 'Servicio técnico especializado en PC, notebooks y consolas en Hualpén. Instalación de redes, cámaras de seguridad, productos electrónicos y merchandising anime. ¡Diagnóstico gratuito!',
  keywords: [
    'servicio técnico Hualpén',
    'reparación PC notebooks',
    'servicio técnico consolas',
    'instalación redes computadores',
    'cámaras seguridad Hualpén',
    'productos electrónicos',
    'merchandising anime',
    'diagnóstico gratuito',
    'PCSystem',
    'Concepción',
    'Biobío'
  ].join(', '),
  authors: [{ name: 'PCSystem Hualpén' }],
  creator: 'PCSystem Hualpén',
  publisher: 'PCSystem Hualpén',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pedrignacio.github.io/PCSYSTEM'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PCSystem Hualpén - Servicio Técnico y Reparaciones Profesionales',
    description: 'Tu centro de confianza para reparaciones de PC, notebooks, consolas y más en Hualpén. Diagnóstico gratuito y servicio profesional.',
    url: 'https://pedrignacio.github.io/PCSYSTEM',
    siteName: 'PCSystem Hualpén',
    images: [
      {
        url: '/logo-hero.png',
        width: 1200,
        height: 630,
        alt: 'PCSystem Hualpén - Servicio Técnico',
      },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PCSystem Hualpén - Servicio Técnico y Reparaciones',
    description: 'Reparaciones profesionales de PC, notebooks y consolas en Hualpén. ¡Diagnóstico gratuito!',
    images: ['/logo-hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  // Icons y theme
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  themeColor: '#1a1a2e',
  // Viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-dark-900 text-white antialiased`}>
        {children}
        <WhatsAppWidget />
        {/* <Analytics /> ← COMENTAR ESTA LÍNEA */}
      </body>
    </html>
  );
}