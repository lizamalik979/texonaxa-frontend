"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeD from "../ThreeD";
import { poppins } from "../../fonts";
import { useFooterMenu } from "../../contexts/FooterMenuContext";

export default function Footer() {
  const { menuData, contactDetails } = useFooterMenu();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (menuData.length > 0 && expandedSections.size === 0) {
      const sectionsToExpand = new Set<string>();
      const itemsToExpand = new Set<string>();
      
      menuData.forEach((menuItem, index) => {
        sectionsToExpand.add(`section-${index}`);
        
        if (menuItem.child_menu && Array.isArray(menuItem.child_menu) && menuItem.child_menu.length > 0) {
          itemsToExpand.add(`section-${index}-item-0`);
        }
      });
      
      setExpandedSections(sectionsToExpand);
      setExpandedItems(itemsToExpand);
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
      <div className="max-w-[1100px] mx-auto">
        {/* Desktop Layout - Multi-column with expandable sections */}
        <div 
          className="hidden lg:grid gap-x-6 md:gap-x-8 lg:gap-x-10 gap-y-6 md:gap-y-8"
          style={{ gridTemplateColumns: `repeat(${Math.min(menuData.length, 6)}, minmax(0, 1fr))` }}
        >
          {menuData.map((menuItem, index) => {
            const sectionId = `section-${index}`;
            const isExpanded = expandedSections.has(sectionId);
            const hasChild = hasChildren(menuItem);

            return (
              <div key={sectionId} className="flex flex-col gap-4 items-start text-left">
                {/* Section Header - Parent: 22px */}
                <div className="flex items-start justify-start gap-2 w-full">
                  {menuItem.url && menuItem.url.trim() !== "" ? (
                    <Link
                      href={menuItem.url}
                      className={`text-neutral-400 font-medium leading-tight uppercase hover:text-white transition-colors ${poppins.className}`}
                      style={{ fontSize: '22px' }}
                    >
                      {menuItem.title}
                    </Link>
                  ) : (
                    <h3 className={`text-neutral-400 font-medium leading-tight uppercase ${poppins.className}`} style={{ fontSize: '22px' }}>
                      {menuItem.title}
                    </h3>
                  )}
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
                        <div className="flex flex-col gap-2 items-start w-full">
                          {menuItem.child_menu.map((childItem, childIndex) => {
                            const itemId = `${sectionId}-item-${childIndex}`;
                            const hasSubChild = hasChildren(childItem);
                            const isItemExpanded = expandedItems.has(itemId);

                            return (
                              <div key={itemId} className="flex flex-col gap-1.5 items-start w-full">
                                {/* Child Item - First Child: 20px */}
                                <div className="flex items-center justify-start gap-2 w-full">
                                  {childItem.url ? (
                                    <Link
                                      href={childItem.url}
                                      className={`text-white font-medium leading-relaxed hover:text-amber-200 transition-colors ${poppins.className}`}
                                      style={{ fontSize: '20px' }}
                                    >
                                      {childItem.title}
                                    </Link>
                                  ) : (
                                    <span className={`text-white font-medium leading-relaxed ${poppins.className}`} style={{ fontSize: '20px' }}>
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
                                    <div className="flex flex-col gap-1.5 items-start w-full">
                                      {childItem.sub_child_menu.map((subChildItem, subChildIndex) => {
                                        const subItemId = `${itemId}-sub-${subChildIndex}`;
                                        const hasSubSubChild = hasChildren(subChildItem);
                                        const isSubItemExpanded = expandedItems.has(subItemId);

                                        return (
                                          <div key={subItemId} className="flex flex-col gap-1 items-start w-full">
                                            <div className="flex items-center justify-start gap-2 w-full">
                                              {subChildItem.url ? (
                                                <Link
                                                  href={subChildItem.url}
                                                  className={`text-white/90 font-medium leading-relaxed hover:text-white transition-colors ${poppins.className}`}
                                                  style={{ fontSize: '16px' }}
                                                >
                                                  {subChildItem.title}
                                                </Link>
                                              ) : (
                                                <span className={`text-white/90 font-medium leading-relaxed ${poppins.className}`} style={{ fontSize: '16px' }}>
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
                                                <div className="flex flex-col gap-1 items-start w-full">
                                                  {subChildItem.sub_sub_child_menu.map((subSubChildItem, subSubChildIndex) => (
                                                    <div key={`${subItemId}-subsub-${subSubChildIndex}`} className="w-full text-left">
                                                      {subSubChildItem.url ? (
                                                        <Link
                                                          href={subSubChildItem.url}
                                                          className={`text-white/80 font-medium leading-relaxed hover:text-white transition-colors ${poppins.className}`}
                                                          style={{ fontSize: '16px' }}
                                                        >
                                                          {subSubChildItem.title}
                                                        </Link>
                                                      ) : (
                                                        <span className={`text-white/80 font-medium leading-relaxed ${poppins.className}`} style={{ fontSize: '16px' }}>
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
                {/* Section Header - Parent: 18px */}
                <div className="flex items-center justify-between">
                  {menuItem.url && menuItem.url.trim() !== "" ? (
                    <Link
                      href={menuItem.url}
                      className={`text-neutral-400 font-medium leading-tight uppercase hover:text-white transition-colors ${poppins.className}`}
                      style={{ fontSize: '18px' }}
                    >
                      {menuItem.title}
                    </Link>
                  ) : (
                    <h3 className={`text-neutral-400 font-medium leading-tight uppercase ${poppins.className}`} style={{ fontSize: '18px' }}>
                      {menuItem.title}
                    </h3>
                  )}
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
                        <div className="flex flex-col gap-2 items-start">
                          {menuItem.child_menu.map((childItem, childIndex) => {
                            const itemId = `${sectionId}-item-${childIndex}`;
                            const hasSubChild = hasChildren(childItem);
                            const isItemExpanded = expandedItems.has(itemId);

                            return (
                              <div key={itemId} className="flex flex-col gap-1 border-l border-white/10 pl-4">
                                {/* Child Item - First Child: 16px */}
                                <div className="flex items-center justify-between">
                                  {childItem.url ? (
                                    <Link
                                      href={childItem.url}
                                      className={`text-white font-medium leading-relaxed hover:text-amber-200 transition-colors ${poppins.className}`}
                                      style={{ fontSize: '16px' }}
                                    >
                                      {childItem.title}
                                    </Link>
                                  ) : (
                                    <span className={`text-white font-medium leading-relaxed ${poppins.className}`} style={{ fontSize: '16px' }}>
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
                                                  className={`text-white/90 font-medium leading-relaxed hover:text-white transition-colors ${poppins.className}`}
                                                  style={{ fontSize: '14px' }}
                                                >
                                                  {subChildItem.title}
                                                </Link>
                                              ) : (
                                                <span className={`text-white/90 font-medium leading-relaxed ${poppins.className}`} style={{ fontSize: '14px' }}>
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
                                                          className={`text-white/80 font-medium leading-relaxed hover:text-white transition-colors ${poppins.className}`}
                                                          style={{ fontSize: '14px' }}
                                                        >
                                                          {subSubChildItem.title}
                                                        </Link>
                                                      ) : (
                                                        <span className={`text-white/80 font-medium leading-relaxed ${poppins.className}`} style={{ fontSize: '14px' }}>
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

        {/* Contact Details Section - Desktop */}
        {contactDetails.length > 0 && (
          <div className="hidden lg:block mt-8 pt-8 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactDetails.map((contact, index) => {
                const hasSubChild = contact.sub_child && Array.isArray(contact.sub_child) && contact.sub_child.length > 0;
                const isSocial = contact.type?.toLowerCase() === 'social';
                
                return (
                  <div key={`contact-${index}`} className="flex flex-col gap-3">
                    {/* Contact Title - Show for all types - 22px */}
                    {contact.url && contact.url.trim() !== "" ? (
                      <Link
                        href={contact.url}
                        className={`text-neutral-400 font-medium leading-tight uppercase hover:text-white transition-colors ${poppins.className}`}
                        style={{ fontSize: '22px' }}
                      >
                        {contact.title}
                      </Link>
                    ) : (
                      <h4 className={`text-neutral-400 font-medium leading-tight uppercase ${poppins.className}`} style={{ fontSize: '22px' }}>
                        {contact.title}
                      </h4>
                    )}

                    {/* Social Type - Icons Only in Flex Row */}
                    {isSocial && hasSubChild && contact.sub_child && (
                      <div className="flex flex-row gap-4">
                        {contact.sub_child.map((subChild, subIndex) => {
                          const isSubChildSocial = subChild.type?.toLowerCase() === 'social';
                          return (
                            <div key={`contact-sub-${index}-${subIndex}`}>
                              {subChild.image && subChild.image.trim() !== "" ? (
                                <Link
                                  href={subChild.url || '#'}
                                  className="block hover:opacity-80 transition-opacity size-7"
                                >
                                  <Image
                                    src={subChild.image}
                                    alt={subChild.title}
                                    // width={24}
                                    // height={24}
                                    width={30}
                                    height={30}
                                    className="object-contain size-7"
                                  />
                                </Link>
                              ) : subChild.url && subChild.url.trim() !== "" ? (
                                <Link
                                  href={subChild.url}
                                  className="block w-6 h-6 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                />
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Social Type - Single Icon (if no sub_child) */}
                    {isSocial && !hasSubChild && (
                      <div className="flex flex-row gap-3">
                        {contact.image && contact.image.trim() !== "" ? (
                          <Link
                            href={contact.url || '#'}
                            className="block hover:opacity-80 transition-opacity"
                          >
                            <Image
                              src={contact.image}
                              alt={contact.title}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          </Link>
                        ) : contact.url && contact.url.trim() !== "" ? (
                          <Link
                            href={contact.url}
                            className="block w-6 h-6 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          />
                        ) : null}
                      </div>
                    )}

                    {/* Contact Value (if no sub_child and not social) - 20px */}
                    {!hasSubChild && !isSocial && contact.value && (
                      <div className="flex items-center gap-2">
                        {contact.image && contact.image.trim() !== "" ? (
                          <Image
                            src={contact.image}
                            alt={contact.title}
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        ) : null}
                        {contact.url && contact.url.trim() !== "" ? (
                          <Link
                            href={contact.url}
                            className={`text-white hover:text-amber-200 transition-colors ${poppins.className}`}
                            style={{ fontSize: '20px' }}
                          >
                            {contact.value}
                          </Link>
                        ) : (
                          <span className={`text-white ${poppins.className}`} style={{ fontSize: '20px' }}>
                            {contact.value}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Contact Sub Children (if not social) - 16px */}
                    {hasSubChild && !isSocial && contact.sub_child && (
                      <div className="flex flex-col gap-2">
                        {contact.sub_child.map((subChild, subIndex) => (
                          <div key={`contact-sub-${index}-${subIndex}`} className="flex items-center gap-2">
                            {subChild.image && subChild.image.trim() !== "" ? (
                              <Image
                                src={subChild.image}
                                alt={subChild.title}
                                width={20}
                                height={20}
                                className="object-contain"
                              />
                            ) : null}
                            {subChild.url && subChild.url.trim() !== "" ? (
                              <Link
                                href={subChild.url}
                                className={`text-white hover:text-amber-200 transition-colors ${poppins.className}`}
                                style={{ fontSize: '16px' }}
                              >
                                {subChild.title}
                              </Link>
                            ) : (
                              <span className={`text-white ${poppins.className}`} style={{ fontSize: '16px' }}>
                                {subChild.title}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Contact Details Section - Mobile */}
        {contactDetails.length > 0 && (
          <div className="lg:hidden mt-8 pt-8 border-t border-white/10">
            <div className="flex flex-col gap-4">
              {contactDetails.map((contact, index) => {
                const hasSubChild = contact.sub_child && Array.isArray(contact.sub_child) && contact.sub_child.length > 0;
                const isSocial = contact.type?.toLowerCase() === 'social';
                
                return (
                  <div key={`mobile-contact-${index}`} className="flex flex-col gap-2">
                    {/* Contact Title - Show for all types - 18px */}
                    {contact.url && contact.url.trim() !== "" ? (
                      <Link
                        href={contact.url}
                        className={`text-neutral-400 font-medium leading-tight uppercase hover:text-white transition-colors ${poppins.className}`}
                        style={{ fontSize: '18px' }}
                      >
                        {contact.title}
                      </Link>
                    ) : (
                      <h4 className={`text-neutral-400 font-medium leading-tight uppercase ${poppins.className}`} style={{ fontSize: '18px' }}>
                        {contact.title}
                      </h4>
                    )}

                    {/* Social Type - Icons Only in Flex Row */}
                    {isSocial && hasSubChild && contact.sub_child && (
                      <div className="flex flex-row gap-3">
                        {contact.sub_child.map((subChild, subIndex) => {
                          const isSubChildSocial = subChild.type?.toLowerCase() === 'social';
                          return (
                            <div key={`mobile-contact-sub-${index}-${subIndex}`}>
                              {subChild.image && subChild.image.trim() !== "" ? (
                                <Link
                                  href={subChild.url || '#'}
                                  className="block hover:opacity-80 transition-opacity"
                                >
                                  <Image
                                    src={subChild.image}
                                    alt={subChild.title}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                  />
                                </Link>
                              ) : subChild.url && subChild.url.trim() !== "" ? (
                                <Link
                                  href={subChild.url}
                                  className="block w-6 h-6 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                />
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Social Type - Single Icon (if no sub_child) */}
                    {isSocial && !hasSubChild && (
                      <div className="flex flex-row gap-3">
                        {contact.image && contact.image.trim() !== "" ? (
                          <Link
                            href={contact.url || '#'}
                            className="block hover:opacity-80 transition-opacity"
                          >
                            <Image
                              src={contact.image}
                              alt={contact.title}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          </Link>
                        ) : contact.url && contact.url.trim() !== "" ? (
                          <Link
                            href={contact.url}
                            className="block w-6 h-6 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          />
                        ) : null}
                      </div>
                    )}

                    {/* Contact Value (if no sub_child and not social) - 16px */}
                    {!hasSubChild && !isSocial && contact.value && (
                      <div className="flex items-center gap-2">
                        {contact.image && contact.image.trim() !== "" ? (
                          <Image
                            src={contact.image}
                            alt={contact.title}
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        ) : null}
                        {contact.url && contact.url.trim() !== "" ? (
                          <Link
                            href={contact.url}
                            className={`text-white hover:text-amber-200 transition-colors ${poppins.className}`}
                            style={{ fontSize: '16px' }}
                          >
                            {contact.value}
                          </Link>
                        ) : (
                          <span className={`text-white ${poppins.className}`} style={{ fontSize: '16px' }}>
                            {contact.value}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Contact Sub Children (if not social) - 16px */}
                    {hasSubChild && !isSocial && contact.sub_child && (
                      <div className="flex flex-col gap-2">
                        {contact.sub_child.map((subChild, subIndex) => (
                          <div key={`mobile-contact-sub-${index}-${subIndex}`} className="flex items-center gap-2">
                            {subChild.image && subChild.image.trim() !== "" ? (
                              <Image
                                src={subChild.image}
                                alt={subChild.title}
                                width={20}
                                height={20}
                                className="object-contain"
                              />
                            ) : null}
                            {subChild.url && subChild.url.trim() !== "" ? (
                              <Link
                                href={subChild.url}
                                className={`text-white hover:text-amber-200 transition-colors ${poppins.className}`}
                                style={{ fontSize: '16px' }}
                              >
                                {subChild.title}
                              </Link>
                            ) : (
                              <span className={`text-white ${poppins.className}`} style={{ fontSize: '16px' }}>
                                {subChild.title}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div>
        <ThreeD />
      </div>
    </footer>
  );
}
