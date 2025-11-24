"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/sections/Services";
import FeaturedCarousel from "@/components/FeaturedCarousel";
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
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-dark-900 via-dark-800 to-dark-900">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[200px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
          
          <div className="container mx-auto px-4 relative z-10 pt-24 pb-20">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              {/* Logo o Imagen destacada */}
              <div className="mb-8 flex justify-center">
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  <div className="absolute inset-0 bg-linear-to-r from-primary-500 to-purple-500 rounded-full blur-3xl opacity-40 animate-pulse" />
                  <img  
                    src="/logo-hero.png" 
                    alt="PCSystem Logo" 
                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
                <span className="block bg-linear-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  Bienvenido a
                </span>
                <span className="block mt-2 bg-linear-to-r from-primary-400 via-primary-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
                  PCSystem
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-3xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Tu <span className="text-primary-400 font-semibold">aliado tecnológico</span> en Hualpén
                <br />
                <span className="text-lg md:text-xl text-gray-400">
                  Servicio técnico, ciber y tienda de componentes
                </span>
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto pt-8">
                <div className="bg-dark-800/50 backdrop-blur-sm border border-primary-500/30 rounded-2xl p-6 hover:border-primary-500/60 transition-all duration-300 hover:scale-105">
                  <div className="mb-3">
                    <svg className="w-12 h-12 text-primary-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Servicio Técnico</h3>
                  <p className="text-sm text-gray-400">Reparación y mantenimiento especializado</p>
                </div>
                <div className="bg-dark-800/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/60 transition-all duration-300 hover:scale-105">
                  <div className="mb-3">
                    <svg className="w-12 h-12 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Tienda Tech</h3>
                  <p className="text-sm text-gray-400">Componentes y accesorios</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <button
                  onClick={() => {
                    const element = document.getElementById('servicios');
                    if (element) {
                      const headerOffset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                  }}
                  className="group px-8 py-4 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 text-lg cursor-pointer"
                >
                  <span className="flex items-center justify-center gap-2">
                    Explorar Servicios
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                <a
                  href="/"
                  className="px-8 py-4 bg-dark-700/80 backdrop-blur-sm hover:bg-dark-600 text-white font-bold rounded-xl transition-all duration-300 border-2 border-primary-500/30 hover:border-primary-500/60 hover:scale-105 text-lg"
                >
                  Ver Productos
                </a>
                <a
                  href="https://wa.me/56989142836"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-green-600/30 hover:shadow-green-600/50 hover:scale-105 text-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </span>
                </a>
              </div>

              {/* Scroll Indicator */}
              <div className="pt-16 animate-bounce">
                <button
                  type="button"
                  title="Ir a Servicios"
                  aria-label="Ir a Servicios"
                  onClick={() => {
                    const element = document.getElementById('servicios');
                    if (element) {
                      const headerOffset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                  }}
                  className="inline-block cursor-pointer"
                >
                  <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <FeaturedCarousel />
        </div>

        <Services />
        <About />
        <Contact />
        <Location />
      </main>
      <Footer />
    </>
  );
}