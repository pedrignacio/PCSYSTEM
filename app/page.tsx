"use client";

import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Products from "@/sections/Products";
import { FiLoader } from "react-icons/fi";

function ProductsLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <FiLoader className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
        <p className="text-xl text-gray-300">Cargando productos...</p>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="pt-24 px-4 container mx-auto">
        <Suspense fallback={<ProductsLoader />}>
          <Products />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
