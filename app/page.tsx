import Header from "@/components/Header";
import Hero from "@/sections/Hero";
import Services from "@/sections/Services";
import Contact from "@/sections/Contact";
import Location from "@/sections/Location";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Contact />
        <Location />
      </main>
    </>
  );
}