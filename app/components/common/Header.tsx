"use client"
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { poppins } from "../../fonts";
import Logo from "../../../public/images/logo.svg";
import { useHeaderMenu } from "../../contexts/HeaderMenuContext";
import { ChildMenu, SubChildMenu, SubSubChildMenu } from "../../types/header";

const SPLINE_URL = "https://prod.spline.design/jeCE9g-t7Gk8oO9M/scene.splinecode";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const { menuData } = useHeaderMenu();
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const [openMobileMenus, setOpenMobileMenus] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      setShow3D(currentScrollY > 10);
    };

    // Use capture: true to catch scroll events from children (like body or a wrapper) 
    // if the window itself isn't technically scrolling due to height: 100%
    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });

    // Initial check
    handleScroll();

    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setOpenDropdowns(new Set());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      
      // Check if this is a main menu dropdown (menu-0, menu-1, etc.)
      const isMainMenu = id.startsWith('menu-') && !id.includes('-child-') && !id.includes('-subchild-');
      
      if (isMainMenu) {
        // If opening a main menu, close all other main menu dropdowns
        if (newSet.has(id)) {
          // Closing this dropdown
          newSet.delete(id);
        } else {
          // Opening this dropdown - close all other main menu dropdowns first
          const mainMenuIds = Array.from(newSet).filter(dropdownId => 
            dropdownId.startsWith('menu-') && !dropdownId.includes('-child-') && !dropdownId.includes('-subchild-')
          );
          mainMenuIds.forEach(mainId => newSet.delete(mainId));
          newSet.add(id);
        }
      } else {
        // For nested dropdowns, just toggle normally
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
      }
      
      return newSet;
    });
  };

  const toggleMobileMenu = (id: string) => {
    setOpenMobileMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const hasChildren = (menu: { child_menu?: any; sub_child_menu?: any; sub_sub_child_menu?: any }): boolean => {
    if ('child_menu' in menu) {
      return menu.child_menu !== false && Array.isArray(menu.child_menu) && menu.child_menu.length > 0;
    }
    if ('sub_child_menu' in menu) {
      return menu.sub_child_menu !== false && Array.isArray(menu.sub_child_menu) && menu.sub_child_menu.length > 0;
    }
    if ('sub_sub_child_menu' in menu) {
      return menu.sub_sub_child_menu !== false && Array.isArray(menu.sub_sub_child_menu) && menu.sub_sub_child_menu.length > 0;
    }
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 relative h-12 w-32 flex-shrink-0">
          {/* Static Logo - Fades out on scroll */}
          <div
            className={`absolute inset-0 flex items-center justify-start transition-opacity duration-500 z-10 opacity-100 ${show3D ? 'md:opacity-0 md:pointer-events-none' : 'md:opacity-100'}`}
          >
            <Image src={Logo} alt="Tex Naxa Logo" priority className="h-8 w-auto" />
          </div>

          {/* 3D Spline Model - Fades in on scroll */}
          <div
            className={`hidden md:block absolute top-[-45px] left-[-40px] w-[150px] h-[150px] pointer-events-none transition-opacity duration-500 z-20 ${show3D ? 'opacity-100' : 'opacity-0'}`}
          >
            <Spline scene={SPLINE_URL} />
          </div>
        </Link>

        {/* Desktop Navigation - All links on the left */}
        <nav className="hidden lg:flex items-center gap-6 text-white">
          {menuData.map((menuItem, index) => {
            const menuId = `menu-${index}`;
            const hasChild = hasChildren(menuItem);
            const isOpen = openDropdowns.has(menuId);

            return (
              <div key={menuId} className="relative group" data-dropdown>
                <div className="flex items-center gap-1">
                  {menuItem.url ? (
                    <Link
                      href={menuItem.url}
                      className={`text-sm sm:text-base font-medium hover:text-amber-200 transition-colors ${poppins.className}`}
                    >
                      {menuItem.title}
                    </Link>
                  ) : (
                    <span className={`text-sm sm:text-base font-medium ${poppins.className}`}>
                      {menuItem.title}
                    </span>
                  )}
                  {hasChild && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(menuId);
                      }}
                      className="p-1 hover:text-amber-200 transition-colors"
                      aria-label="Toggle dropdown"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Dropdown Menu */}
                {hasChild && isOpen && menuItem.child_menu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl py-2 z-50"
                  >
                    {menuItem.child_menu.map((childItem, childIndex) => {
                      const childId = `${menuId}-child-${childIndex}`;
                      const hasSubChild = hasChildren(childItem);
                      const isChildOpen = openDropdowns.has(childId);

                      return (
                        <div key={childId} className="relative">
                          <div className="flex items-center justify-between px-4 py-2 hover:bg-white/10 transition-colors">
                            <div className="flex-1">
                              {childItem.url ? (
                                <Link
                                  href={childItem.url}
                                  className={`text-sm text-white/90 hover:text-white block ${poppins.className}`}
                                  onClick={() => setOpenDropdowns(new Set())}
                                >
                                  {childItem.title}
                                </Link>
                              ) : (
                                <span className={`text-sm text-white/90 block ${poppins.className}`}>
                                  {childItem.title}
                                </span>
                              )}
                            </div>
                            {hasSubChild && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDropdown(childId);
                                }}
                                className="p-1 hover:text-amber-200 transition-colors ml-2"
                                aria-label="Toggle nested dropdown"
                              >
                                <ChevronRight className={`w-4 h-4 transition-transform ${isChildOpen ? 'rotate-90' : ''}`} />
                              </button>
                            )}
                          </div>

                          {/* Nested Dropdown */}
                          {hasSubChild && isChildOpen && childItem.sub_child_menu && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="absolute left-full top-0 ml-2 w-64 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl py-2 z-50"
                            >
                              {childItem.sub_child_menu.map((subChildItem, subChildIndex) => {
                                const subChildId = `${childId}-subchild-${subChildIndex}`;
                                const hasSubSubChild = hasChildren(subChildItem);
                                const isSubChildOpen = openDropdowns.has(subChildId);

                                return (
                                  <div key={subChildId} className="relative">
                                    <div className="flex items-center justify-between px-4 py-2 hover:bg-white/10 transition-colors">
                                      <div className="flex-1">
                                        {subChildItem.url ? (
                                          <Link
                                            href={subChildItem.url}
                                            className={`text-sm text-white/90 hover:text-white block ${poppins.className}`}
                                            onClick={() => setOpenDropdowns(new Set())}
                                          >
                                            {subChildItem.title}
                                          </Link>
                                        ) : (
                                          <span className={`text-sm text-white/90 block ${poppins.className}`}>
                                            {subChildItem.title}
                                          </span>
                                        )}
                                      </div>
                                      {hasSubSubChild && subChildItem.sub_sub_child_menu && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDropdown(subChildId);
                                          }}
                                          className="p-1 hover:text-amber-200 transition-colors ml-2"
                                          aria-label="Toggle nested dropdown"
                                        >
                                          <ChevronRight className={`w-4 h-4 transition-transform ${isSubChildOpen ? 'rotate-90' : ''}`} />
                                        </button>
                                      )}
                                    </div>

                                    {/* Sub-Sub-Child Dropdown */}
                                    {hasSubSubChild && isSubChildOpen && subChildItem.sub_sub_child_menu && Array.isArray(subChildItem.sub_sub_child_menu) && (
                                      <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="absolute left-full top-0 ml-2 w-64 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl py-2 z-50"
                                      >
                                        {subChildItem.sub_sub_child_menu.map((subSubChildItem: SubSubChildMenu, subSubChildIndex: number) => (
                                          <div key={`${subChildId}-subsubchild-${subSubChildIndex}`}>
                                            {subSubChildItem.url ? (
                                              <Link
                                                href={subSubChildItem.url}
                                                className={`block px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors ${poppins.className}`}
                                                onClick={() => setOpenDropdowns(new Set())}
                                              >
                                                {subSubChildItem.title}
                                              </Link>
                                            ) : (
                                              <div className={`px-4 py-2 text-sm text-white/90 ${poppins.className}`}>
                                                {subSubChildItem.title}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </motion.div>
                                    )}
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            );
          })}
          
          {/* About us and Contact us - Now part of the left navigation */}
          <Link
            href="/about"
            className={`text-sm sm:text-base font-medium hover:text-amber-200 transition-colors ${poppins.className}`}
          >
            About us
          </Link>
          <Link
            href="/contact"
            className={`text-sm sm:text-base font-medium hover:text-amber-200 transition-colors ${poppins.className}`}
          >
            Contact us
          </Link>
        </nav>

        {/* Mobile Menu Button - Shows when screen < 1024px (lg breakpoint) */}
        <button
          className="lg:hidden text-white p-2 ml-auto"
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
                className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-[9999] w-[80%] max-w-sm bg-black border-l border-white/10 shadow-2xl lg:hidden flex flex-col"
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

                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-col p-6 gap-1">
                    {menuData.map((menuItem, index) => {
                      const menuId = `mobile-menu-${index}`;
                      const hasChild = hasChildren(menuItem);
                      const isOpen = openMobileMenus.has(menuId);

                      return (
                        <motion.div
                          key={menuId}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 + index * 0.05 }}
                          className="border-b border-white/10 last:border-b-0"
                        >
                          {/* Main Menu Item */}
                          <div className="flex items-center justify-between py-3">
                            <div className="flex-1">
                              {menuItem.url ? (
                                <Link
                                  href={menuItem.url}
                                  className={`block text-base font-medium text-white/90 hover:text-white transition-colors ${poppins.className}`}
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {menuItem.title}
                                </Link>
                              ) : (
                                <span className={`block text-base font-medium text-white/90 ${poppins.className}`}>
                                  {menuItem.title}
                                </span>
                              )}
                            </div>
                            {hasChild && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMobileMenu(menuId);
                                }}
                                className="p-2 hover:bg-white/10 rounded transition-colors ml-2"
                                aria-label="Toggle menu"
                              >
                                <ChevronRight className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                              </button>
                            )}
                          </div>

                          {/* Child Menu Items */}
                          {hasChild && isOpen && menuItem.child_menu && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-4"
                            >
                              {menuItem.child_menu.map((childItem, childIndex) => {
                                const childId = `${menuId}-child-${childIndex}`;
                                const hasSubChild = hasChildren(childItem);
                                const isChildOpen = openMobileMenus.has(childId);

                                return (
                                  <div key={childId} className="border-l border-white/10 pl-4 py-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        {childItem.url ? (
                                          <Link
                                            href={childItem.url}
                                            className={`block text-sm text-white/80 hover:text-white transition-colors ${poppins.className}`}
                                            onClick={() => setIsMenuOpen(false)}
                                          >
                                            {childItem.title}
                                          </Link>
                                        ) : (
                                          <span className={`block text-sm text-white/80 ${poppins.className}`}>
                                            {childItem.title}
                                          </span>
                                        )}
                                      </div>
                                      {hasSubChild && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleMobileMenu(childId);
                                          }}
                                          className="p-1 hover:bg-white/10 rounded transition-colors ml-2"
                                          aria-label="Toggle nested menu"
                                        >
                                          <ChevronRight className={`w-4 h-4 transition-transform ${isChildOpen ? 'rotate-90' : ''}`} />
                                        </button>
                                      )}
                                    </div>

                                    {/* Sub-Child Menu Items */}
                                    {hasSubChild && isChildOpen && childItem.sub_child_menu && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden pl-4 mt-2"
                                      >
                                        {childItem.sub_child_menu.map((subChildItem, subChildIndex) => {
                                          const subChildId = `${childId}-subchild-${subChildIndex}`;
                                          const hasSubSubChild = hasChildren(subChildItem);
                                          const isSubChildOpen = openMobileMenus.has(subChildId);

                                          return (
                                            <div key={subChildId} className="border-l border-white/10 pl-4 py-2">
                                              <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                  {subChildItem.url ? (
                                                    <Link
                                                      href={subChildItem.url}
                                                      className={`block text-sm text-white/70 hover:text-white transition-colors ${poppins.className}`}
                                                      onClick={() => setIsMenuOpen(false)}
                                                    >
                                                      {subChildItem.title}
                                                    </Link>
                                                  ) : (
                                                    <span className={`block text-sm text-white/70 ${poppins.className}`}>
                                                      {subChildItem.title}
                                                    </span>
                                                  )}
                                                </div>
                                                {hasSubSubChild && subChildItem.sub_sub_child_menu && (
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      toggleMobileMenu(subChildId);
                                                    }}
                                                    className="p-1 hover:bg-white/10 rounded transition-colors ml-2"
                                                    aria-label="Toggle nested menu"
                                                  >
                                                    <ChevronRight className={`w-4 h-4 transition-transform ${isSubChildOpen ? 'rotate-90' : ''}`} />
                                                  </button>
                                                )}
                                              </div>

                                              {/* Sub-Sub-Child Menu Items */}
                                              {hasSubSubChild && isSubChildOpen && subChildItem.sub_sub_child_menu && Array.isArray(subChildItem.sub_sub_child_menu) && (
                                                <motion.div
                                                  initial={{ height: 0, opacity: 0 }}
                                                  animate={{ height: "auto", opacity: 1 }}
                                                  exit={{ height: 0, opacity: 0 }}
                                                  transition={{ duration: 0.2 }}
                                                  className="overflow-hidden pl-4 mt-2"
                                                >
                                                  {subChildItem.sub_sub_child_menu.map((subSubChildItem: SubSubChildMenu, subSubChildIndex: number) => (
                                                    <div key={`${subChildId}-subsubchild-${subSubChildIndex}`} className="border-l border-white/10 pl-4 py-2">
                                                      {subSubChildItem.url ? (
                                                        <Link
                                                          href={subSubChildItem.url}
                                                          className={`block text-sm text-white/60 hover:text-white transition-colors ${poppins.className}`}
                                                          onClick={() => setIsMenuOpen(false)}
                                                        >
                                                          {subSubChildItem.title}
                                                        </Link>
                                                      ) : (
                                                        <span className={`block text-sm text-white/60 ${poppins.className}`}>
                                                          {subSubChildItem.title}
                                                        </span>
                                                      )}
                                                    </div>
                                                  ))}
                                                </motion.div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </motion.div>
                                    )}
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}

                    {/* About us and Contact us in Mobile Menu */}
                    <div className="border-t border-white/10 mt-4 pt-4">
                      <Link
                        href="/about"
                        className={`block py-3 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all ${poppins.className}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        About us
                      </Link>
                      <Link
                        href="/contact"
                        className={`block py-3 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all ${poppins.className}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Contact us
                      </Link>
                    </div>
                  </div>
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