"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeD from "../ThreeD";
import { poppins } from "../../fonts";
import { useHeaderMenu } from "../../contexts/HeaderMenuContext";
import { ChildMenu, SubChildMenu } from "../../types/header";

export default function Footer() {
  const { menuData } = useHeaderMenu();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Expand first section by default on desktop when menu data is loaded
    if (menuData.length > 0 && expandedSections.size === 0) {
      setExpandedSections(new Set([`section-0`]));
    }
  }, [menuData]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
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
    <footer className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-[1000px] mx-auto">
        {/* Desktop Layout - Multi-column with expandable sections */}
        <div className="hidden lg:grid grid-cols-5 gap-x-6 md:gap-x-8 lg:gap-x-10 gap-y-6 md:gap-y-8">
          {menuData.map((menuItem, index) => {
            const sectionId = `section-${index}`;
            const isExpanded = expandedSections.has(sectionId);
            const hasChild = hasChildren(menuItem);

            return (
              <div key={sectionId} className="flex flex-col gap-4 items-start text-left">
                {/* Section Header */}
                <div className="flex items-start justify-start gap-2 w-full">
                  <h3 className={`text-neutral-400 text-base font-medium leading-tight uppercase ${poppins.className}`}>
                    {menuItem.title}
                  </h3>
                  {hasChild && (
                    <button
                      onClick={() => toggleSection(sectionId)}
                      className="text-neutral-400 hover:text-white transition-colors flex-shrink-0"
                      aria-label={isExpanded ? "Collapse section" : "Expand section"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Section Content */}
                {hasChild && menuItem.child_menu && (
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-2 items-center">
                          {menuItem.child_menu.map((childItem, childIndex) => {
                            const itemId = `${sectionId}-item-${childIndex}`;
                            const hasSubChild = hasChildren(childItem);
                            const isItemExpanded = expandedItems.has(itemId);

                            return (
                              <div key={itemId} className="flex flex-col gap-1.5 items-center w-full">
                                {/* Child Item */}
                                <div className="flex items-center justify-center gap-2 w-full">
                                  {childItem.url ? (
                                    <Link
                                      href={childItem.url}
                                      className={`text-white text-sm font-medium leading-relaxed hover:text-amber-200 transition-colors ${poppins.className}`}
                                    >
                                      {childItem.title}
                                    </Link>
                                  ) : (
                                    <span className={`text-white text-sm font-medium leading-relaxed ${poppins.className}`}>
                                      {childItem.title}
                                    </span>
                                  )}
                                  {hasSubChild && (
                                    <button
                                      onClick={() => toggleItem(itemId)}
                                      className="text-neutral-400 hover:text-white transition-colors flex-shrink-0"
                                      aria-label={isItemExpanded ? "Collapse" : "Expand"}
                                    >
                                      {isItemExpanded ? (
                                        <ChevronUp className="w-3 h-3" />
                                      ) : (
                                        <ChevronDown className="w-3 h-3" />
                                      )}
                                    </button>
                                  )}
                                </div>

                                {/* Sub-Child Items */}
                                {hasSubChild && isItemExpanded && childItem.sub_child_menu && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden w-full"
                                  >
                                    <div className="flex flex-col gap-1.5 items-center">
                                      {childItem.sub_child_menu.map((subChildItem, subChildIndex) => {
                                        const subItemId = `${itemId}-sub-${subChildIndex}`;
                                        const hasSubSubChild = hasChildren(subChildItem);
                                        const isSubItemExpanded = expandedItems.has(subItemId);

                                        return (
                                          <div key={subItemId} className="flex flex-col gap-1 items-center w-full">
                                            <div className="flex items-center justify-center gap-2 w-full">
                                              {subChildItem.url ? (
                                                <Link
                                                  href={subChildItem.url}
                                                  className={`text-white/90 text-xs font-medium leading-relaxed hover:text-white transition-colors ${poppins.className}`}
                                                >
                                                  {subChildItem.title}
                                                </Link>
                                              ) : (
                                                <span className={`text-white/90 text-xs font-medium leading-relaxed ${poppins.className}`}>
                                                  {subChildItem.title}
                                                </span>
                                              )}
                                              {hasSubSubChild && subChildItem.sub_sub_child_menu && Array.isArray(subChildItem.sub_sub_child_menu) && (
                                                <button
                                                  onClick={() => toggleItem(subItemId)}
                                                  className="text-neutral-400 hover:text-white transition-colors flex-shrink-0"
                                                  aria-label={isSubItemExpanded ? "Collapse" : "Expand"}
                                                >
                                                  {isSubItemExpanded ? (
                                                    <ChevronUp className="w-3 h-3" />
                                                  ) : (
                                                    <ChevronDown className="w-3 h-3" />
                                                  )}
                                                </button>
                                              )}
                                            </div>

                                            {/* Sub-Sub-Child Items */}
                                            {hasSubSubChild && isSubItemExpanded && subChildItem.sub_sub_child_menu && Array.isArray(subChildItem.sub_sub_child_menu) && (
                                              <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden w-full"
                                              >
                                                <div className="flex flex-col gap-1 items-center">
                                                  {subChildItem.sub_sub_child_menu.map((subSubChildItem, subSubChildIndex) => (
                                                    <div key={`${subItemId}-subsub-${subSubChildIndex}`} className="w-full text-center">
                                                      {subSubChildItem.url ? (
                                                        <Link
                                                          href={subSubChildItem.url}
                                                          className={`text-white/80 text-xs font-medium leading-relaxed hover:text-white transition-colors ${poppins.className}`}
                                                        >
                                                          {subSubChildItem.title}
                                                        </Link>
                                                      ) : (
                                                        <span className={`text-white/80 text-xs font-medium leading-relaxed ${poppins.className}`}>
                                                          {subSubChildItem.title}
                                                        </span>
                                                      )}
                                                    </div>
                                                  ))}
                                                </div>
                                              </motion.div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Layout - Vertical accordion */}
        <div className="lg:hidden flex flex-col gap-4">
          {menuData.map((menuItem, index) => {
            const sectionId = `mobile-section-${index}`;
            const isExpanded = expandedSections.has(sectionId);
            const hasChild = hasChildren(menuItem);

            return (
              <div key={sectionId} className="border-b border-white/10 pb-4 last:border-b-0">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <h3 className={`text-neutral-400 text-xl font-medium leading-tight uppercase ${poppins.className}`}>
                    {menuItem.title}
                  </h3>
                  {hasChild && (
                    <button
                      onClick={() => toggleSection(sectionId)}
                      className="text-neutral-400 hover:text-white transition-colors"
                      aria-label={isExpanded ? "Collapse section" : "Expand section"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Section Content */}
                {hasChild && menuItem.child_menu && (
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden mt-3"
                      >
                        <div className="flex flex-col gap-2">
                          {menuItem.child_menu.map((childItem, childIndex) => {
                            const itemId = `${sectionId}-item-${childIndex}`;
                            const hasSubChild = hasChildren(childItem);
                            const isItemExpanded = expandedItems.has(itemId);

                            return (
                              <div key={itemId} className="flex flex-col gap-1 border-l border-white/10 pl-4">
                                {/* Child Item */}
                                <div className="flex items-center justify-between">
                                  {childItem.url ? (
                                    <Link
                                      href={childItem.url}
                                      className={`text-white text-base font-medium leading-relaxed hover:text-amber-200 transition-colors ${poppins.className}`}
                                    >
                                      {childItem.title}
                                    </Link>
                                  ) : (
                                    <span className={`text-white text-base font-medium leading-relaxed ${poppins.className}`}>
                                      {childItem.title}
                                    </span>
                                  )}
                                  {hasSubChild && (
                                    <button
                                      onClick={() => toggleItem(itemId)}
                                      className="text-neutral-400 hover:text-white transition-colors ml-2"
                                      aria-label={isItemExpanded ? "Collapse" : "Expand"}
                                    >
                                      {isItemExpanded ? (
                                        <ChevronUp className="w-4 h-4" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4" />
                                      )}
                                    </button>
                                  )}
                                </div>

                                {/* Sub-Child Items */}
                                {hasSubChild && isItemExpanded && childItem.sub_child_menu && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden pl-4 mt-2"
                                  >
                                    <div className="flex flex-col gap-1">
                                      {childItem.sub_child_menu.map((subChildItem, subChildIndex) => {
                                        const subItemId = `${itemId}-sub-${subChildIndex}`;
                                        const hasSubSubChild = hasChildren(subChildItem);
                                        const isSubItemExpanded = expandedItems.has(subItemId);

                                        return (
                                          <div key={subItemId} className="flex flex-col gap-1 border-l border-white/10 pl-4">
                                            <div className="flex items-center justify-between">
                                              {subChildItem.url ? (
                                                <Link
                                                  href={subChildItem.url}
                                                  className={`text-white/90 text-sm font-medium leading-relaxed hover:text-white transition-colors ${poppins.className}`}
                                                >
                                                  {subChildItem.title}
                                                </Link>
                                              ) : (
                                                <span className={`text-white/90 text-sm font-medium leading-relaxed ${poppins.className}`}>
                                                  {subChildItem.title}
                                                </span>
                                              )}
                                              {hasSubSubChild && subChildItem.sub_sub_child_menu && Array.isArray(subChildItem.sub_sub_child_menu) && (
                                                <button
                                                  onClick={() => toggleItem(subItemId)}
                                                  className="text-neutral-400 hover:text-white transition-colors ml-2"
                                                  aria-label={isSubItemExpanded ? "Collapse" : "Expand"}
                                                >
                                                  {isSubItemExpanded ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                  ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                  )}
                                                </button>
                                              )}
                                            </div>

                                            {/* Sub-Sub-Child Items */}
                                            {hasSubSubChild && isSubItemExpanded && subChildItem.sub_sub_child_menu && Array.isArray(subChildItem.sub_sub_child_menu) && (
                                              <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden pl-4 mt-1"
                                              >
                                                <div className="flex flex-col gap-1">
                                                  {subChildItem.sub_sub_child_menu.map((subSubChildItem, subSubChildIndex) => (
                                                    <div key={`${subItemId}-subsub-${subSubChildIndex}`} className="border-l border-white/10 pl-4">
                                                      {subSubChildItem.url ? (
                                                        <Link
                                                          href={subSubChildItem.url}
                                                          className={`text-white/80 text-sm font-medium leading-relaxed hover:text-white transition-colors ${poppins.className}`}
                                                        >
                                                          {subSubChildItem.title}
                                                        </Link>
                                                      ) : (
                                                        <span className={`text-white/80 text-sm font-medium leading-relaxed ${poppins.className}`}>
                                                          {subSubChildItem.title}
                                                        </span>
                                                      )}
                                                    </div>
                                                  ))}
                                                </div>
                                              </motion.div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="hidden md:block">
        <ThreeD />
      </div>
    </footer>
  );
}
