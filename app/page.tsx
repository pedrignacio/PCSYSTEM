import Header from "@/components/Header";
import Hero from "@/sections/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* Aquí irán las demás secciones: Servicios, Nosotros, Contacto, etc. */}
      </main>
    </>
  );
}