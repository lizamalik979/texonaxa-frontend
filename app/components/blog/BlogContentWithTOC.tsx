"use client";

import { useState, useEffect } from 'react';
import { Poppins } from 'next/font/google';
import BlogContentSections from './BlogContentSection';
import BlogFaq from './BlogFaq';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ["300", "400", "500", "600", "700"],
});

interface ContentSection {
  id: string;
  title: string;
  section_content: string;
}

interface TOCItem {
  id: string;
  text: string;
}

interface BlogContentWithTOCProps {
  contentSections: ContentSection[];
  additionalFields?: Record<string, any>;
  additionalFieldSections?: Record<string, ContentSection[]>;
  faqItems?: Array<{ question: string; answer: string }>;
}

// Helper function to generate ID from text (matches parseBlogContent logic)
function generateId(text: string, index: number): string {
  return `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

export default function BlogContentWithTOC({
  contentSections,
  additionalFields,
  additionalFieldSections,
  faqItems,
}: BlogContentWithTOCProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Generate TOC items from content sections and additionalFields
  useEffect(() => {
    const items: TOCItem[] = [];
    let headingIndex = 0;

    // Add headings from content sections
    contentSections.forEach((section) => {
      if (section.title && section.id) {
        items.push({
          id: section.id,
          text: section.title,
        });
        headingIndex++;
      }
    });

    // Add headings from additionalFields labels
    if (additionalFields) {
      Object.entries(additionalFields).forEach(([key, field], index) => {
        if (field && typeof field === 'object' && field.label) {
          const labelText = field.label.trim();
          // Use the same calculation as in rendering: h2Count + index
          const h2Count = contentSections.filter(s => s.title).length;
          const id = generateId(labelText, h2Count + index);
          items.push({
            id,
            text: labelText,
          });
        }
      });
    }

    setTocItems(items);
  }, [contentSections, additionalFields]);

  // Track active heading with IntersectionObserver
  useEffect(() => {
    if (tocItems.length === 0) return;

    let observer: IntersectionObserver | null = null;

    const setupObserver = (attempts = 0) => {
      // Clean up previous observer
      if (observer) {
        observer.disconnect();
      }

      observer = new IntersectionObserver(
        (entries) => {
          let mostVisibleEntry: IntersectionObserverEntry | null = null;
          let maxRatio = 0;

          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              mostVisibleEntry = entry;
            }
          }

          if (mostVisibleEntry) {
            const target = mostVisibleEntry.target as HTMLElement;
            if (target && target.id) {
              setActiveId(target.id);
            }
          }
        },
        {
          rootMargin: '-20% 0px -70% 0px',
          threshold: [0, 0.25, 0.5, 0.75, 1],
        }
      );

      // Try to observe all headings
      let foundCount = 0;
      tocItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element && observer) {
          observer.observe(element);
          foundCount++;
        }
      });

      // Retry if not all elements found
      if (foundCount < tocItems.length && attempts < 5) {
        setTimeout(() => setupObserver(attempts + 1), 200);
      }
    };

    setupObserver();

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [tocItems]);

  // Handle smooth scroll with offset
  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Retry function to find and scroll to element
    const scrollToElement = (attempts = 0) => {
      const element = document.getElementById(id);
      
      if (element) {
        // Method 1: Use scrollIntoView with block start, then adjust offset
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Method 2: Also use window.scrollTo with offset for precise positioning
        setTimeout(() => {
          const offset = 120; // Navbar height + margin
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth',
          });
        }, 10);

        setActiveId(id);
      } else if (attempts < 10) {
        // Retry if element not found (might still be rendering)
        setTimeout(() => scrollToElement(attempts + 1), 100);
      } else {
        // Final fallback: use hash navigation
        window.location.hash = id;
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            const offset = 120;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: Math.max(0, offsetPosition),
              behavior: 'smooth',
            });
            setActiveId(id);
          }
        }, 200);
      }
    };

    scrollToElement();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative">
      {/* Main Content - Left Side */}
      <div className="flex-1 min-w-0 w-full lg:max-w-none">
        {/* Content Sections */}
        <div className="blog-content-wrapper">
      {contentSections.map((section, index) => (
        <div key={section.id || `section-${index}`} className="mb-8">
          {section.title && (
            <h2
              id={section.id}
              className="text-2xl font-bold text-white mb-4"
              style={{ scrollMarginTop: '120px' }}
            >
              {section.title}
            </h2>
          )}
          {section.section_content && (
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: section.section_content }}
            />
          )}
        </div>
      ))}
    </div>

        {/* Additional Fields */}
        {additionalFields && Object.keys(additionalFields).length > 0 && (
          <div className="mt-12 space-y-8">
            {Object.entries(additionalFields).map(([key, field], index) => {
              const h2Count = contentSections.filter(s => s.title).length;
              const fieldId = field.label 
                ? generateId(field.label, h2Count + index)
                : '';
              
              return (
                <div key={key} className="border-t border-white/10 pt-8" data-field-key={key}>
                  {field.label && (
                    <h2 
                      id={fieldId}
                      className={`text-2xl font-bold text-white mb-4 ${poppins.className}`}
                      style={{ scrollMarginTop: '120px' }}
                    >
                      {field.label}
                    </h2>
                  )}
                  {field.value && additionalFieldSections?.[key] && (
                    <BlogContentSections sections={additionalFieldSections[key]} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* FAQ Section */}
        {faqItems && faqItems.length > 0 && (
          <BlogFaq faqItems={faqItems} />
        )}
      </div>

      {/* Table of Contents - Right Side */}
      {tocItems.length > 0 && (
        <aside className="hidden lg:block w-64 flex-shrink-0 self-start sticky top-28">
          <div className=" max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain">
            <div className="pb-4">
              <h3 className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 ${poppins.className}`}>
                ON THIS PAGE
              </h3>
              <nav>
                <ul className="space-y-1">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleTocClick(e, item.id)}
                        className={`block px-3 py-1.5 text-sm rounded transition-all duration-200 ${
                          activeId === item.id
                            ? 'text-white font-medium'
                            : 'text-gray-400 hover:text-gray-300'
                        } ${poppins.className}`}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

