"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface LazyLoadSectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
}

/**
 * LazyLoadSection component that only renders children when they're about to enter the viewport.
 * This reduces initial load time by deferring component rendering until needed.
 */
export default function LazyLoadSection({
  children,
  fallback = <div className="min-h-screen" />,
  rootMargin = "800px", // Start loading 800px before entering viewport
  threshold = 0.01,
}: LazyLoadSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true);
            setHasLoaded(true);
            // Once loaded, we can disconnect the observer
            if (sectionRef.current) {
              observer.unobserve(sectionRef.current);
            }
          }
        });
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      observer.disconnect();
    };
  }, [hasLoaded, rootMargin, threshold]);

  return (
    <div ref={sectionRef}>
      {isVisible ? children : fallback}
    </div>
  );
}
