import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/sections/Hero";
import Services from "@/sections/Services";
import About from "@/sections/About";
import Contact from "@/sections/Contact";
import Location from "@/sections/Location";
import Script from "next/script";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://pcsystem.cl/#localbusiness",
        "name": "PCSystem",
        "image": "https://pcsystem.cl/logo-header.png",
        "description": "Servicio técnico de computadores, notebooks y consolas en Hualpén. Reparación, mantenimiento, instalación de redes y cámaras de seguridad.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Pasaje 7 #2609 La Floresta 3",
          "addressLocality": "Hualpén",
          "addressRegion": "Región del Biobío",
          "postalCode": "4600000",
          "addressCountry": "CL"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -36.7830,
          "longitude": -73.0900
        },
        "url": "https://pcsystem.cl",
        "telephone": "+56989142836",
        "email": "contacto@pcsystem.cl",
        "priceRange": "$$",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Saturday",
            "opens": "09:00",
            "closes": "14:00"
          }
        ],
        "sameAs": [
          "https://facebook.com/CiberHualpen",
          "https://instagram.com/pcsystems.cl",
          "https://wa.me/56989142836"
        ]
      },
      {
        "@type": "ComputerStore",
        "@id": "https://pcsystem.cl/#store",
        "name": "PCSystem Hualpén",
        "description": "Tienda de componentes PC, accesorios gaming y productos tecnológicos en Hualpén.",
        "url": "https://pcsystem.cl/#productos"
      },
      {
        "@type": "Service",
        "@id": "https://pcsystem.cl/#service",
        "serviceType": "Servicio Técnico de Computadores",
        "provider": {
          "@id": "https://pcsystem.cl/#localbusiness"
        },
        "areaServed": {
          "@type": "City",
          "name": "Hualpén"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Servicios Técnicos",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Servicio Técnico PC y Notebooks"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Servicio Técnico Consolas"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Instalación de Redes"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Instalación Cámaras de Seguridad"
              }
            }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://pcsystem.cl/#website",
        "url": "https://pcsystem.cl",
        "name": "PCSystem Hualpén",
        "description": "Servicio técnico y tienda de tecnología en Hualpén",
        "publisher": {
          "@id": "https://pcsystem.cl/#localbusiness"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://pcsystem.cl/#productos?q={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "inLanguage": "es-CL"
      }
    ]
  };

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Contact />
        <Location />
      </main>
      <Footer />
    </>
  );
}