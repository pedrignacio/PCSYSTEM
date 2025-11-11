"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Products from "@/sections/Products";

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
