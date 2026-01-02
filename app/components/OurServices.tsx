"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { poppins } from "../fonts";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ContactLeadForm from "./contact/ContactLeadForm";
import { useSection } from "../contexts/SectionContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function OurServices() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const { setActiveSection } = useSection();

  const cards = [
    {
      id: 1,
      title: "Web Development",
      image: "/images/service/a.svg",
      href: "/services/web-development",
    },
    {
      id: 2,
      title: "UI/UX Design",
      image: "/images/service/b.svg",
      href: "/services/mobile-apps",
    },
    {
      id: 3,
      title: "Digital Marketing",
      image: "/images/service/c.svg",
      href: "/services/digital-strategy",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Intersection Observer to detect when heading exits top of viewport
  useEffect(() => {
    if (!headingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When heading is NOT intersecting (has scrolled past top), start animation
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            setShouldAnimate(true);
          } else {
            setShouldAnimate(false);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px',
      }
    );

    observer.observe(headingRef.current);

    return () => {
      if (headingRef.current) {
        observer.unobserve(headingRef.current);
      }
    };
  }, []);


  useEffect(() => {
    if (!containerRef.current || !cardsRef.current || !isMounted) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    let scrollTriggerInstance: ScrollTrigger | null = null;
    let animationInstance: gsap.core.Tween | null = null;

    // Wait for next frame to ensure DOM is ready
    const setupScrollTrigger = () => {
      const cards = cardsRef.current?.children;
      if (!cards || cards.length === 0) {
        // Retry if cards aren't ready
        setTimeout(setupScrollTrigger, 50);
        return;
      }

      const cardWidth = 450;
      const gap = 48; // gap-12 = 48px
      const totalWidth = (cardWidth * cards.length) + (gap * (cards.length - 1));
      const centerOffset = (window.innerWidth - totalWidth) / 2; // Center all cards
      
      // Kill any existing ScrollTriggers for this element
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
        scrollTriggerInstance = null;
      }
      if (animationInstance) {
        animationInstance.kill();
        animationInstance = null;
      }
      
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });

      if (!containerRef.current) return;
      
      // Set initial position - center all cards so all 3 are visible
      gsap.set(cardsRef.current, { 
        x: centerOffset,
        opacity: 1,
        scale: 1
      });
      
      const containerHeight = window.innerHeight * 2; // Scroll distance for exit animation
      
      // Only animate if shouldAnimate is true (heading has exited top)
      if (shouldAnimate) {
        animationInstance = gsap.to(cardsRef.current, {
          x: window.innerWidth, // Move cards off screen to the right
          opacity: 0,
          scale: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top", // Start when container reaches top
            end: () => `+=${containerHeight}`, // Scroll distance
            scrub: 2, // Smooth animation
            invalidateOnRefresh: true,
            refreshPriority: 1,
            onUpdate: () => {
            },
          }
        });
      } else {
        // Keep cards centered and visible
        gsap.set(cardsRef.current, {
          x: centerOffset,
          opacity: 1,
          scale: 1
        });
      }
      
      scrollTriggerInstance = animationInstance?.scrollTrigger || null;
      
      // THE TRICK: Watch for when section enters view and reset if needed
      const checkAndReset = () => {
        if (!scrollTriggerInstance || !containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        const isAtTop = rect.top >= 0 && rect.top < window.innerHeight * 0.3;
        
        // If section is in view near top and trigger thinks we're at end, reset!
        if (isInView && isAtTop && scrollTriggerInstance.progress >= 0.95) {
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
          
          // Kill and recreate
          if (scrollTriggerInstance) scrollTriggerInstance.kill();
          if (animationInstance) animationInstance.kill();
          
          const cardWidthReset = 450;
          const gapReset = 48;
          const totalWidthReset = (cardWidthReset * cards.length) + (gapReset * (cards.length - 1));
          const centerOffsetReset = (window.innerWidth - totalWidthReset) / 2;
          
          gsap.set(cardsRef.current, { 
            x: centerOffsetReset,
            opacity: 1,
            scale: 1
          });
          
          if (shouldAnimate) {
            animationInstance = gsap.to(cardsRef.current, {
              x: window.innerWidth,
              opacity: 0,
              scale: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: `${currentScroll} top`,
                end: `${currentScroll + containerHeight} top`,
                scrub: 2,
                invalidateOnRefresh: true,
                refreshPriority: 1,
              }
            });
          }
          
          scrollTriggerInstance = animationInstance?.scrollTrigger || null;
        }
      };
      
      // Check on scroll
      const handleScroll = () => {
        requestAnimationFrame(checkAndReset);
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Also check periodically
      const checkInterval = setInterval(checkAndReset, 500);
      
      // Store cleanup
      (setupScrollTrigger as any).cleanup = () => {
        window.removeEventListener('scroll', handleScroll);
        clearInterval(checkInterval);
      };
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      setTimeout(setupScrollTrigger, 100);
    });

    // Handle window resize
    const handleResize = () => {
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
    
    // Refresh ScrollTrigger when layout might change (e.g., Services becomes sticky)
    const handleLayoutChange = () => {
      if (containerRef.current && window.innerWidth >= 768) {
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Use ResizeObserver to detect when other sections change layout
    const resizeObserver = new ResizeObserver(() => {
      handleLayoutChange();
    });
    if (containerRef.current) {
      resizeObserver.observe(document.body);
    }
    
    // Also listen for scroll events to detect when page height changes
    // This helps catch when Services adds the spacer
    let lastPageHeight = document.documentElement.scrollHeight;
    const checkPageHeight = () => {
      const currentHeight = document.documentElement.scrollHeight;
      if (Math.abs(currentHeight - lastPageHeight) > 100) {
        lastPageHeight = currentHeight;
        handleLayoutChange();
      }
    };
    
    // Check periodically for page height changes
    const heightCheckInterval = setInterval(checkPageHeight, 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      clearInterval(heightCheckInterval);
      
      // Cleanup scroll listener and interval from setupScrollTrigger
      if ((setupScrollTrigger as any).cleanup) {
        (setupScrollTrigger as any).cleanup();
      }
      
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, [isMounted, cards.length, shouldAnimate]);

  return (
    <div 
      className="relative min-h-screen"
      onMouseEnter={() => setActiveSection("ourServices")}
      onMouseLeave={() => setActiveSection("default")}
    >
      {/* Header Section */}
      <div className="px-4 md:px-8 pt-12 md:pt-16 lg:pt-20 mb-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 
            ref={headingRef}
            className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 ${poppins.className}`}
          >
            Our Services
          </h2>
          <p className={`max-w-7xl mx-auto text-white text-base md:text-xl opacity-80 ${poppins.className}`}>
            Transform your brand with our innovative digital solutions that captivate and engage your audience.
          </p>
        </div>
      </div>

      {/* Desktop: Horizontal scroll container */}
      <div className="hidden xl:block h-[120vh]" ref={containerRef}>
        <div className="sticky top-0 py-12 md:py-20 flex items-center overflow-hidden">
          <div
            ref={cardsRef}
            className="flex gap-12 px-8"
            style={{ 
              width: isMounted ? `${cards.length * 450}px` : `${cards.length * 360}px`,
              willChange: 'transform'
            }}
        >
            {cards.map((card) => (
              <div
                key={card.id}
                className={`group relative w-[450px] h-[450px] rounded-2xl overflow-hidden transform transition-all duration-300 ease-out ${
                  hoveredCard === card.id 
                    ? 'scale-[1.02]' 
                    : 'opacity-70'
                }`}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
            >
                {/* Service Image */}
                <div className="absolute inset-0">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="450px"
                  />
                </div>
                
                {/* Black gradient overlay at bottom for text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-[5]"></div>
                
                {/* Purple glow effect for active card */}
                {/* {hoveredCard === card.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-purple-600/30 rounded-2xl"></div>
                )} */}
                
                {/* Glow shadow for active card */}
                {hoveredCard === card.id && (
                  <div 
                    className="absolute inset-0 rounded-2xl pointer-events-none z-[6]"
                    style={{
                      boxShadow: '0 0 40px 10px rgba(147, 51, 234, 0.4), 0 0 80px 20px rgba(147, 51, 234, 0.2)'
                    }}
                  ></div>
                )}

                {/* Content - positioned at bottom */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8 text-white">
                  <div className="space-y-4">
                    {/* Title */}
                    <h3 className={`text-xl md:text-3xl font-semibold ${poppins.className}`}>
                      {card.title}
                    </h3>

                    {/* More Details Button */}
                    <button 
                      onClick={() => setShowContactForm(true)}
                      className={`hero-cta-button rounded-lg w-fit text-black text-md sm:text-xl font-medium text-center cursor-pointer flex items-center justify-center ${poppins.className}`}
                    >
                      More details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet/Desktop up to 1280px: Swiper with pagination dots */}
      <div className="xl:hidden px-4 pb-20">
        <Swiper
          modules={[Pagination]}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          pagination={{ 
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white/30 !opacity-100',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white'
          }}
          className="!pb-12"
        >
          {cards.map((card) => (
            <SwiperSlide key={card.id}>
              <div className="group relative w-full aspect-square rounded-2xl overflow-hidden transform transition-all duration-300 ease-out">
                {/* Service Image */}
                <div className="absolute inset-0">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>

                {/* Black gradient overlay at bottom for text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-[5]"></div>

                {/* Content - positioned at bottom */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                  <div className="space-y-4">
                    {/* Title */}
                    <h3 className={`text-xl font-bold ${poppins.className}`}>
                      {card.title}
                    </h3>

                    {/* More Details Button */}
                    <button 
                      onClick={() => setShowContactForm(true)}
                      className={`hero-cta-button w-fit text-black text-xl sm:text-2xl font-medium text-center cursor-pointer flex items-center justify-center ${poppins.className}`}
                    >
                      More details
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
              onClick={() => setShowContactForm(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/95 rounded-3xl p-4 sm:p-6 border border-white/10">
                {/* Form */}
                <ContactLeadForm onClose={() => setShowContactForm(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
