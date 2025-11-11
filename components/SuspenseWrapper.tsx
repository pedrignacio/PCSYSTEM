"use client";

import { Suspense, useState, useEffect } from "react";
import Loading from "./Loading";
import { AnimatePresence } from "framer-motion";

interface SuspenseWrapperProps {
  children: React.ReactNode;
}

export default function SuspenseWrapper({ children }: SuspenseWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de recursos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // También escuchar cuando la página esté completamente cargada
    const handleLoad = () => {
      setTimeout(() => setIsLoading(false), 500);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Loading key="loading" />}
      </AnimatePresence>
      
      <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </div>
    </>
  );
}