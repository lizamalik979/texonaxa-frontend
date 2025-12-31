"use client";

import { useState, useEffect, useRef } from "react";
import { poppins } from "../fonts";
import { useSection } from "../contexts/SectionContext";

const stats = [
  {
    number: 80,
    label: "Team",
    format: (n: number) => n.toString(),
  },
  {
    number: 230,
    label: "Projects",
    format: (n: number) => n.toString(),
  },
  {
    number: 9,
    label: "Years",
    format: (n: number) => n.toString().padStart(2, "0"),
  },
  {
    number: 25,
    label: "Industries",
    format: (n: number) => n.toString(),
  },
];

export default function OurStory() {
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { setActiveSection } = useSection();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            // Animate each number
            stats.forEach((stat, index) => {
              const duration = 2000; // 2 seconds
              const steps = 60;
              const increment = stat.number / steps;
              const stepDuration = duration / steps;
              
              let currentStep = 0;
              
              const timer = setInterval(() => {
                currentStep++;
                const currentValue = Math.min(
                  Math.floor(increment * currentStep),
                  stat.number
                );
                
                setCounts((prev) => {
                  const newCounts = [...prev];
                  newCounts[index] = currentValue;
                  return newCounts;
                });
                
                if (currentStep >= steps) {
                  clearInterval(timer);
                  // Ensure final value is set
                  setCounts((prev) => {
                    const newCounts = [...prev];
                    newCounts[index] = stat.number;
                    return newCounts;
                  });
                }
              }, stepDuration);
            });
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <section 
      ref={sectionRef} 
      className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8"
      onMouseEnter={() => setActiveSection("ourStory")}
      onMouseLeave={() => setActiveSection("default")}
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex justify-center mb-8 sm:mb-12 md:mb-16">
          <h2 className={poppins.className}>
            <span className="text-amber-200 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium capitalize">Our </span>
            <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium capitalize">Story, By Numbers</span>
          </h2>
        </div>

        {/* Statistics Grid */}
        <div className="flex flex-row flex-wrap items-center justify-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center basis-1/2 sm:basis-1/4 relative py-8 sm:py-16 md:py-24 lg:py-32">
              {/* Number with Plus Sign */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex justify-center items-center mb-2 sm:mb-3 md:mb-4 gap-1 sm:gap-2">
                <span className={`text-gray-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light ${poppins.className}`}>
                  {stat.format(counts[index])}
                </span>
                <span className="text-amber-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light">+</span>
              </div>
              
              {/* Label */}
              <p className={`text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal ${poppins.className}`}>
                {stat.label}
              </p>

              {/* Vertical Divider - Hidden on mobile, shown on larger screens */}
              {index < stats.length - 1 && (
                <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 h-12 sm:h-16 md:h-64 lg:h-82 w-[0.5px] bg-gray-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}