import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pcsystem.cl'),
  title: {
    default: "PCSystem | Ciber y Servicio Técnico en Hualpén, Chile",
    template: "%s | PCSystem Hualpén"
  },
  description: "Servicio técnico de computadores, notebooks y consolas en Hualpén. Reparación, mantenimiento, instalación de redes, cámaras de seguridad y venta de componentes PC. ¡Atención personalizada!",
  icons: {
    icon: '/logo-hero.png',
    shortcut: '/logo-hero.png',
    apple: '/logo-hero.png',
  },
  keywords: [
    "servicio técnico Hualpén",
    "reparación computadores Hualpén",
    "ciber Hualpén",
    "mantenimiento PC Concepción",
    "reparación notebook",
    "servicio técnico consolas",
    "instalación redes Hualpén",
    "cámaras de seguridad",
    "componentes PC",
    "PCSystem",
    "Floresta 3 Hualpén",
    "técnico computación Biobío"
  ],
  authors: [{ name: "PCSystem", url: "https://pcsystem.cl" }],
  creator: "PCSystem",
  publisher: "PCSystem",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "PCSystem | Servicio Técnico Computadores y Consolas en Hualpén",
    description: "Expertos en reparación de PC, notebooks y consolas. Instalación de redes y cámaras de seguridad. Venta de componentes y accesorios. ¡Visítanos en Hualpén!",
    url: "https://pcsystem.cl",
    siteName: "PCSystem Hualpén",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/logo-header.png",
        width: 1200,
        height: 630,
        alt: "PCSystem - Servicio Técnico en Hualpén"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PCSystem | Servicio Técnico en Hualpén",
    description: "Reparación de PC, notebooks y consolas. Instalación de redes. Tu aliado tecnológico en Hualpén.",
    images: ["/logo-header.png"],
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
    google: "google-site-verification-code", // Agregar código real
  },
  alternates: {
    canonical: "https://pcsystem.cl",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-dark-900 text-white antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}