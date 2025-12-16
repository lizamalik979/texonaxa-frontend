"use client"
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { poppins } from "../../fonts";
import Logo from "../../../public/images/logo.svg";

const SPLINE_URL = "https://prod.spline.design/kqiu73VsJPWPhPJf/scene.splinecode";

const navItems = [
  { label: "Services", href: "/web-development" },
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "#contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      // Check multiple sources for scroll position to be robust against global CSS layout quirks
      const currentScrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      setShow3D(currentScrollY > 10);
    };

    // Use capture: true to catch scroll events from children (like body or a wrapper) 
    // if the window itself isn't technically scrolling due to height: 100%
    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });

    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll, { capture: true });
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 relative h-12 w-32">
          {/* Static Logo - Fades out on scroll */}
          <div
            className={`absolute inset-0 flex items-center justify-start transition-opacity duration-500 z-10 ${show3D ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <Image src={Logo} alt="Tex Naxa Logo" priority className="h-8 w-auto" />
          </div>

          {/* 3D Spline Model - Fades in on scroll */}
          <div
            className={`absolute top-[-50px] left-[-40px] w-[150px] h-[150px] pointer-events-none transition-opacity duration-500 z-20 ${show3D ? 'opacity-100' : 'opacity-0'}`}
          >
            <Spline scene={SPLINE_URL} />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-white">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-sm sm:text-base font-medium hover:text-amber-200 transition-colors ${poppins.className}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm md:hidden"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-[9999] w-[80%] max-w-sm bg-black border-l border-white/10 shadow-2xl md:hidden flex flex-col"
              >
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                  <span className={`text-lg font-semibold text-white ${poppins.className}`}>Menu</span>
                  <button
                    className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col gap-2 p-6">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`block py-3 px-4 text-xl font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all ${poppins.className}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}