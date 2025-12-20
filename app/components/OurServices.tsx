"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { poppins } from "../fonts";
import Link from "next/link";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function OurServices() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    {
      id: 1,
      title: "Web Development",
      placeholderColor: "bg-gradient-to-br from-purple-900/40 to-blue-900/40",
      href: "/services/web-development",
    },
    {
      id: 2,
      title: "Web Development",
      placeholderColor: "bg-gradient-to-br from-gray-700/40 to-gray-800/40",
      href: "/services/mobile-apps",
    },
    {
      id: 3,
      title: "Web Development",
      placeholderColor: "bg-gradient-to-br from-gray-700/40 to-gray-800/40",
      href: "/services/digital-strategy",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !cardsRef.current || !isMounted) return;

    // Wait for next frame to ensure DOM is ready
    const setupScrollTrigger = () => {
      const cards = cardsRef.current?.children;
      if (!cards || cards.length === 0) {
        // Retry if cards aren't ready
        setTimeout(setupScrollTrigger, 50);
        return;
      }

      const isMobile = window.innerWidth < 768;
      
      // Only setup horizontal scroll on desktop
      if (isMobile) {
        return;
      }

      const cardWidth = 500;
      const gap = 48; // gap-12 = 48px
      const totalWidth = (cardWidth * cards.length) + (gap * (cards.length - 1));
      const centerOffset = (window.innerWidth - cardWidth) / 2;
      const edgeOffset = window.innerWidth - cardWidth;

      // Kill any existing ScrollTriggers for this element
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });

      // Create horizontal scroll animation (desktop only)
      gsap.fromTo(
        cardsRef.current,
        { x: edgeOffset },
        {
          x: -(totalWidth - cardWidth - centerOffset),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "60% top",
            scrub: 2,
            invalidateOnRefresh: true,
          }
        }
      );

      // Refresh ScrollTrigger after setup
      ScrollTrigger.refresh();
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      setTimeout(setupScrollTrigger, 100);
    });

    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
      // Re-setup if switching between mobile/desktop
      if (window.innerWidth >= 768) {
        setTimeout(setupScrollTrigger, 100);
      } else {
        // Kill ScrollTriggers on mobile
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.vars.trigger === containerRef.current) {
            trigger.kill();
          }
        });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMounted, cards.length]);

  return (
    <div className="relative min-h-screen">
      {/* Header Section */}
      <div className="px-4 md:px-8 mb-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 ${poppins.className}`}>
            Our Services
          </h2>
          <p className={`max-w-7xl mx-auto text-white text-base md:text-xl opacity-80 ${poppins.className}`}>
            Transform your brand with our innovative digital solutions that captivate and engage your audience.
          </p>
        </div>
      </div>

      {/* Desktop: Horizontal scroll container */}
      <div className="hidden md:block h-[120vh]" ref={containerRef}>
        <div className="sticky top-0 py-20 flex items-center overflow-hidden">
          <div
            ref={cardsRef}
            className="flex gap-12 px-8"
            style={{ 
              width: isMounted ? `${cards.length * 500}px` : `${cards.length * 400}px`,
              willChange: 'transform'
            }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className={`group relative w-[500px] h-[500px] rounded-2xl overflow-hidden transform transition-all duration-300 ease-out ${
                  hoveredCard === card.id 
                    ? 'scale-[1.02]' 
                    : 'opacity-70'
                }`}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Placeholder color background */}
                <div className={`absolute inset-0 ${card.placeholderColor}`}></div>
                
                {/* Purple glow effect for active card */}
                {hoveredCard === card.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-purple-600/30 rounded-2xl"></div>
                )}
                
                {/* Glow shadow for active card */}
                {hoveredCard === card.id && (
                  <div 
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      boxShadow: '0 0 40px 10px rgba(147, 51, 234, 0.4), 0 0 80px 20px rgba(147, 51, 234, 0.2)'
                    }}
                  ></div>
                )}

                {/* Content - positioned at bottom */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8 text-white">
                  <div className="space-y-4">
                    {/* Title */}
                    <h3 className={`text-xl md:text-3xl font-bold ${poppins.className}`}>
                      {card.title}
                    </h3>

                    {/* More Details Button */}
                    <Link href={card.href}>
                      <button className={`w-fit py-3 px-6 bg-amber-200 rounded-lg hover:scale-105 transition-all duration-300 ${poppins.className}`}>
                        <span className="text-black text-base font-medium">
                          More details
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Column layout */}
      <div className="md:hidden px-4 pb-20">
        <div className="flex flex-col gap-6 max-w-md mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`group relative w-full h-[400px] rounded-2xl overflow-hidden transform transition-all duration-300 ease-out ${
                hoveredCard === card.id 
                  ? 'scale-[1.02]' 
                  : 'opacity-70'
              }`}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Placeholder color background */}
              <div className={`absolute inset-0 ${card.placeholderColor}`}></div>
              
              {/* Purple glow effect for active card */}
              {hoveredCard === card.id && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-purple-600/30 rounded-2xl"></div>
              )}
              
              {/* Glow shadow for active card */}
              {hoveredCard === card.id && (
                <div 
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    boxShadow: '0 0 40px 10px rgba(147, 51, 234, 0.4), 0 0 80px 20px rgba(147, 51, 234, 0.2)'
                  }}
                ></div>
              )}

              {/* Content - positioned at bottom */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                <div className="space-y-4">
                  {/* Title */}
                  <h3 className={`text-xl font-bold ${poppins.className}`}>
                    {card.title}
                  </h3>

                  {/* More Details Button */}
                  <Link href={card.href}>
                    <button className={`w-fit py-3 px-6 bg-amber-200 rounded-lg hover:scale-105 transition-all duration-300 ${poppins.className}`}>
                      <span className="text-black text-base font-medium">
                        More details
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
