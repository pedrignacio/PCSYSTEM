import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Products from "@/sections/Products";

export const metadata = {
  title: "Productos | PCSystem - Ciber y Servicio Técnico",
  description: "Descubre nuestro catálogo de productos: componentes de PC, periféricos, accesorios gaming, merchandising anime y más.",
};

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <Products />
      </main>
      <Footer />
    </>
  );
}
