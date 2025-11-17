"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiPhone, FiLogIn, FiLogOut, FiShield } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { name: "Inicio", href: "/" },
  { name: "Productos", href: "/productos" },
  { name: "Servicios", href: "/#servicios" },
  { name: "Nosotros", href: "/#nosotros" },
  { name: "Ubicación", href: "/#ubicacion" },
  { name: "Contacto", href: "/#contacto" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-800/90 backdrop-blur-md border-b border-dark-700">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-hero.png"
            alt="PCSystem - Ciber y Servicio Técnico"
            width={240}
            height={80}
            className="h-14 w-auto object-contain brightness-110"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="text-gray-300 hover:text-primary-400 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://wa.me/56989142836"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-lg transition-colors duration-200 font-semibold"
          >
            <FiPhone />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl text-white"
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-800 border-t border-dark-700"
          >
            <ul className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-300 hover:text-primary-400 transition-colors duration-200 py-2"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              
              <li>
                <a
                  href="https://wa.me/56989142836"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg transition-colors duration-200 mt-4"
                >
                  <FiPhone />
                  <span>Contactar por WhatsApp</span>
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}