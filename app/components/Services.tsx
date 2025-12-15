"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { orbitron, poppins } from "../fonts";

interface ServiceSection {
  title: string;
  description: string;
  color: string;
}

const sections: ServiceSection[] = [
  {
    title: "Designing",
    description: "Design that defines your identity and elevates user experience.",
    color: "from-violet-600 to-purple-800",
  },
  {
    title: "Development",
    description: "Design that defines your identity and elevates user experience.",
    color: "from-cyan-500 to-blue-700",
  },
  {
    title: "Search Engine Optimization ",
    description: "Strategic optimization that puts your brand in front of the right audience.",
    color: "from-emerald-500 to-teal-700",
  },
  {
    title: "Digital Marketing",
    description: "Data-driven campaigns that convert visitors into loyal customers.",
    color: "from-amber-500 to-orange-700",
  },
  {
    title: "Pay-Per-Click Advertising ",
    description: "Pay-Per-Click advertising for immediate, targeted results.",
    color: "from-rose-500 to-pink-700",
  },
  {
    title: "Social Media Optimization ",
    description: "Social Media Optimization to maximize engagement and reach.",
    color: "from-violet-500 to-purple-700",
  },
  {
    title: "Social Media Marketing ",
    description: "Social Media Marketing to boost your brand presence across platforms.",
    color: "from-pink-500 to-rose-700",
  },
  {
    title: "Answer Engine Optimization ",
    description: "Answer Engine Optimization for voice search and AI assistants.",
    color: "from-indigo-500 to-blue-800",
  },
  {
    title: "Generative Engine Optimization ",
    description: "Generative Engine Optimization for AI-powered search visibility.",
    color: "from-lime-500 to-green-700",
  },
  {
    title: "Branding",
    description: "Build a memorable brand identity that resonates with your audience.",
    color: "from-fuchsia-500 to-pink-700",
  },
  {
    title: "UI/UX",
    description: "User-centered design that delivers exceptional digital experiences.",
    color: "from-orange-500 to-amber-700",
  },
];


const Services = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Intersection Observer for scroll detection
  useEffect(() => {
    if (isMobile) return;

    const observers: IntersectionObserver[] = [];

    triggerRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(index);
            }
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -80% 0px", // Trigger when element enters top 20% of viewport
          threshold: 0,
        }
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [isMobile]);

  const handlePrev = () => {
    const newIndex = activeSection > 0 ? activeSection - 1 : sections.length - 1;
    setActiveSection(newIndex);
    triggerRefs.current[newIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleNext = () => {
    const newIndex = activeSection < sections.length - 1 ? activeSection + 1 : 0;
    setActiveSection(newIndex);
    triggerRefs.current[newIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    }),
  };

  // Mobile view
  if (isMobile) {
    return (
      <motion.section
        className="min-h-screen py-16 px-6"
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className={`text-3xl md:text-4xl font-medium text-white mb-4 ${poppins.className}`}
            variants={fadeInUp}
            custom={0}
            initial="hidden"
            animate="visible"
          >
            Integrated Digital Solutions: Design, Code, & Growth
          </motion.h2>
          <motion.p
            className={`text-white/70 text-base mb-12 ${poppins.className}`}
            variants={fadeInUp}
            custom={0.1}
            initial="hidden"
            animate="visible"
          >
            At Taxa Nova, we deliver end-to-end digital excellence. We don&apos;t separate design from development or marketing from strategy
          </motion.p>

          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
          >
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm"
                variants={fadeInUp}
                custom={0.15 + index * 0.05}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className={`relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br ${section.color}`} />
                <h3 className={`text-xl font-bold text-white mb-2 ${poppins.className}`}>
                  {section.title}
                </h3>
                <p className={`text-white/70 text-sm ${poppins.className}`}>
                  {section.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    );
  }

  // Desktop view with sticky scroll
  return (
    <motion.section
      className="relative"
      initial="hidden"
      animate="visible"
    >
      {/* Scroll trigger sections - positioned at start, stacked vertically */}
      <div className="absolute top-0 left-0 right-0">
        {sections.map((_, index) => (
          <div
            key={index}
            ref={(el) => {
              triggerRefs.current[index] = el;
            }}
            className="absolute left-0 right-0 h-[50vh]"
            style={{ top: `${index * 50}vh` }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Sticky container that stays in view */}
      <div className="sticky top-0 h-screen flex flex-col justify-center">
        {/* Header */}
        <div className="pb-8 px-8 lg:px-16">
          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.h2
              className={`text-3xl md:text-4xl font-medium text-white mb-4 ${poppins.className}`}
              variants={fadeInUp}
              custom={0}
            >
              Integrated Digital Solutions: Design, Code, & Growth
            </motion.h2>
            <motion.p
              className={`text-white/70 text-xl lg:text-2xl max-w-7xl ${poppins.className}`}
              variants={fadeInUp}
              custom={0.1}
            >
              At Taxa Nova, we deliver end-to-end digital excellence. We don&apos;t separate design from development or marketing from strategy
            </motion.p>
          </motion.div>
        </div>

        {/* Main content area */}
        <div className="flex items-center px-8 lg:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-2 gap-8 lg:gap-16 w-full">
              {/* Left side - Navigation Carousel */}
              <motion.div
                className="flex flex-col justify-center items-center relative h-400px] overflow-hidden w-full"
                variants={fadeInUp}
                custom={0.15}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                {/* Carousel container - shows 5 items, active centered */}
                <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
                  {[-2, -1, 0, 1, 2].map((offset) => {
                    const index = activeSection + offset;

                    // Skip if index is out of bounds
                    if (index < 0 || index >= sections.length) {
                      return (
                        <div
                          key={`empty-${offset}`}
                          className="h-[70px] flex items-center justify-center"
                        />
                      );
                    }

                    const section = sections[index];
                    const isActive = offset === 0;
                    const distance = Math.abs(offset);

                    // Opacity: center = 1, 1 away = 0.4, 2 away = 0.15
                    const opacity = distance === 0 ? 1 : distance === 1 ? 0.4 : 0.15;

                    // Scale: center = 1, others slightly smaller
                    const scale = distance === 0 ? 1 : distance === 1 ? 0.95 : 0.9;

                    return (
                      <div
                        key={index}
                        className="h-[70px] flex items-center justify-center transition-all duration-700 ease-out"
                        style={{
                          opacity,
                          transform: `scale(${scale})`,
                        }}
                      >
                        {/* Left arrow - only visible for active */}
                        <button
                          onClick={handlePrev}
                          className={`flex items-center justify-center text-white transition-all duration-700 ease-out overflow-hidden ${isActive ? "opacity-100 w-12 mr-6" : "opacity-0 w-0 mr-0"
                            }`}
                          aria-label="Previous service"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="w-10 h-10 flex-shrink-0 "
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                        </button>

                        {/* Service title */}
                        <span
                          className={`text-center transition-all duration-700 ease-out cursor-default ${isActive ? "text-white" : "text-white/80"
                            }`}
                        >
                          <span className={`text-xl lg:text-2xl xl:text-3xl font-semibold whitespace-nowrap transition-all duration-700 ${poppins.className}`}>
                            {section.title}
                          </span>
                        </span>

                        {/* Right arrow - only visible for active */}
                        <button
                          onClick={handleNext}
                          className={`flex items-center justify-center text-white transition-all duration-700 ease-out overflow-hidden ${isActive ? "opacity-100 w-12 ml-6" : "opacity-0 w-0 ml-0"
                            }`}
                          aria-label="Next service"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="w-10 h-10 flex-shrink-0 "
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Right side - Image Card */}
              <motion.div
                className="flex items-center justify-center"
                variants={fadeInUp}
                custom={0.2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="relative w-full max-w-[486px]">
                  {/* Gradient glow behind the card */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-yellow-400/30 via-green-400/20 to-purple-500/30 rounded-3xl blur-2xl opacity-60" />

                  {/* Card */}
                  <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-yellow-200/90 via-green-200/80 to-blue-200/70 p-1">
                    <div className="relative aspect-square max-h-[485px] rounded-3xl overflow-hidden">
                      {/* Color placeholder */}
                      <div className="absolute inset-0">
                        {sections.map((section, index) => (
                          <div
                            key={index}
                            className={`absolute inset-0 bg-gradient-to-br ${section.color} transition-opacity duration-500 ${activeSection === index
                              ? "opacity-100"
                              : "opacity-0"
                              }`}
                          />
                        ))}
                      </div>

                      {/* Overlay with title and description */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                        <h3 className={`text-2xl lg:text-3xl font-bold text-white mb-2 ${orbitron.className}`}>
                          {sections[activeSection].title}
                        </h3>
                        <p className={`text-white/80 text-sm lg:text-base ${poppins.className}`}>
                          {sections[activeSection].description}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to match trigger height - 11 sections * 50vh each = 550vh */}
      <div className="h-[550vh]" />
    </motion.section>
  );
};

export default Services;
