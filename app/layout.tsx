import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PCSystem | Ciber y Servicio Técnico en Hualpén",
  description: "Ciber, soporte técnico, mantenimiento de computadores y venta de accesorios en Floresta 3, Hualpén, Chile.",
  keywords: ["ciber", "servicio técnico", "Hualpén", "reparación computadores", "PCSystem"],
  authors: [{ name: "PCSystem" }],
  openGraph: {
    title: "PCSystem | Ciber y Servicio Técnico",
    description: "Tu aliado tecnológico en Hualpén",
    url: "https://pcsystem.cl",
    siteName: "PCSystem",
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-dark-900 text-white antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}