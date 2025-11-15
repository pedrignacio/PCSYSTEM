"use client";

<<<<<<< HEAD
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
=======
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  const navItems = [
    { label: "Inicio", href: "#inicio", id: "inicio" },
    { label: "Servicios", href: "#servicios", id: "servicios" },
    { label: "Nosotros", href: "#nosotros", id: "nosotros" },
    { label: "Ubicación", href: "#ubicacion", id: "ubicacion" },
    { label: "Contacto", href: "#contacto", id: "contacto" }
  ];

  // Optimizar scroll handlers con useCallback
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setScrolled(scrollY > 50);

    // Detect active section
    const sections = navItems.map(item => document.getElementById(item.id));
    const scrollPosition = scrollY + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section && section.offsetTop <= scrollPosition) {
        setActiveSection(navItems[i].id);
        break;
      }
    }
  }, []);

  // Throttle scroll events
  useEffect(() => {
    let ticking = false;
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  const handleNavClick = useCallback((href: string) => {
    setIsMenuOpen(false);
    
    // Smooth scroll
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-dark-900/95 backdrop-blur-md border-b border-dark-700" 
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
>>>>>>> 9fe723e0fad47433b91dcfda8692ce21f2e132da
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
<<<<<<< HEAD
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
=======
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">PCSystem</h1>
              <p className="text-xs text-gray-400">Hualpén</p>
            </div>
>>>>>>> 9fe723e0fad47433b91dcfda8692ce21f2e132da
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                  activeSection === item.id
                    ? "text-primary-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400"
                    layoutId="activeSection"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="https://wa.me/56989142836"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-300 font-medium"
            >
              WhatsApp
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`md:hidden overflow-hidden ${
            scrolled ? "bg-dark-900/95 backdrop-blur-md" : "bg-dark-900/90"
          }`}
          initial={false}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <nav className="py-4 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href)}
                className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  activeSection === item.id
                    ? "text-primary-400 bg-primary-400/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="px-4 pt-4">
              <a
                href="https://wa.me/56989142836"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center px-6 py-3 rounded-lg transition-colors duration-300 font-medium"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
}