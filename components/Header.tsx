"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiPhone, FiLogIn, FiLogOut, FiShield } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '../lib/supabase'

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
            src={`${
              process.env.NODE_ENV === "production" ? "/PCSYSTEM" : ""
            }/logo-header.png`}
            alt="PCSystem - Ciber y Servicio Técnico"
            width={180}
            height={60}
            className="h-12 w-auto object-contain"
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
          {isAuthenticated ? (
            <>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2.5 bg-primary-600/20 border border-primary-500/50 text-primary-400 hover:bg-primary-600/30 rounded-lg transition-all font-semibold"
              >
                <FiShield />
                <span>Admin</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 rounded-lg transition-all font-semibold"
              >
                <FiLogOut />
                <span>Salir</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-all font-semibold"
            >
              <FiLogIn />
              <span>Admin</span>
            </Link>
          )}
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
              
              {/* Mobile Auth Buttons */}
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 bg-primary-600/20 border border-primary-500/50 text-primary-400 px-5 py-3 rounded-lg transition-all font-semibold"
                    >
                      <FiShield />
                      <span>Panel Admin</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-red-600/20 border border-red-500/50 text-red-400 px-5 py-3 rounded-lg transition-all font-semibold"
                    >
                      <FiLogOut />
                      <span>Cerrar Sesión</span>
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 bg-gray-700 border border-gray-600 px-5 py-3 rounded-lg transition-all font-semibold"
                  >
                    <FiLogIn />
                    <span>Acceso Admin</span>
                  </Link>
                </li>
              )}
              
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