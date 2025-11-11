import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/sections/Hero";
import Services from "@/sections/Services";
import About from "@/sections/About";
import Contact from "@/sections/Contact";
import Location from "@/sections/Location";
import SuspenseWrapper from "@/components/SuspenseWrapper";

export default function Home() {
  return (
    <SuspenseWrapper>
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Contact />
        <Location />
      </main>
      <Footer />
    </SuspenseWrapper>
  );
}