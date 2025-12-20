"use client";

import { useState, useEffect, useRef } from 'react';
import { Poppins } from 'next/font/google';
import { List } from 'lucide-react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ["300", "400", "500", "600", "700"],
});

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Extract H2 headings from content
  useEffect(() => {
    if (!content) return;

    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Find all H2 elements
    const h2Elements = tempDiv.querySelectorAll('h2');
    const extractedHeadings: TOCItem[] = [];

    h2Elements.forEach((h2, index) => {
      // Generate ID from text content
      const text = h2.textContent || '';
      const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
      
      // Set the ID on the element if it doesn't have one
      if (!h2.id) {
        h2.id = id;
      }

      extractedHeadings.push({
        id: h2.id || id,
        text: text.trim(),
        level: 2,
      });
    });

    setHeadings(extractedHeadings);

    // Update the actual content in the DOM with IDs
    if (extractedHeadings.length > 0) {
      const contentWrapper = document.querySelector('.blog-content');
      if (contentWrapper) {
        const actualH2s = contentWrapper.querySelectorAll('h2');
        actualH2s.forEach((h2, index) => {
          if (extractedHeadings[index]) {
            h2.id = extractedHeadings[index].id;
          }
        });
      }
    }
  }, [content]);

  // Set up Intersection Observer to track active heading
  useEffect(() => {
    if (headings.length === 0) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px', // Trigger when heading is in top 30% of viewport
        threshold: 0,
      }
    );

    // Observe all headings
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings]);

  // Scroll to heading on click
  const handleClick = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Update active ID immediately
      setActiveId(id);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-8">
      <div className="bg-gradient-to-b from-[rgba(19,19,19,0.95)] to-[rgba(19,18,18,0.9)] border border-white/10 rounded-xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
          <List className="w-5 h-5 text-[#FEE39A]" />
          <h3 className={`text-lg font-bold text-white ${poppins.className}`}>
            Table of Contents
          </h3>
        </div>

        {/* TOC Items */}
        <nav className="space-y-2">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => handleClick(heading.id, e)}
              className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                activeId === heading.id
                  ? 'bg-[#FEE39A]/20 text-[#FEE39A] border-l-2 border-[#FEE39A]'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              } ${poppins.className}`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}