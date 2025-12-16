"use client";

import { useEffect, useRef, useState } from "react";
import { poppins } from "../../fonts";

interface AboutSectionProps {
  aboutBadgeTitle?: string;
  aboutHeading?: string;
  aboutDescription?: string;
  aboutStats?: {
    statTitle?: string;
    statValue?: number;
  }[];
}

export default function AboutSection({
  aboutBadgeTitle,
  aboutHeading,
  aboutDescription,
  aboutStats = [],
}: AboutSectionProps) {
  const [counts, setCounts] = useState<number[]>(() =>
    aboutStats.map(() => 0)
  );
  const hasAnimatedRef = useRef(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCounts(aboutStats.map(() => 0));
    hasAnimatedRef.current = false;
  }, [aboutStats]);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || !aboutStats.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            aboutStats.forEach((stat, index) => {
              const target = stat.statValue ?? 0;
              const duration = 1500;
              const start = performance.now();

              const step = (timestamp: number) => {
                const progress = Math.min((timestamp - start) / duration, 1);
                const currentValue = Math.floor(target * progress);
                setCounts((prev) => {
                  const next = [...prev];
                  next[index] = currentValue;
                  return next;
                });
                if (progress < 1) {
                  requestAnimationFrame(step);
                } else {
                  setCounts((prev) => {
                    const next = [...prev];
                    next[index] = target;
                    return next;
                  });
                }
              };

              requestAnimationFrame(step);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionEl);

    return () => observer.disconnect();
  }, [aboutStats]);

  const formatValue = (value: number) => {
    if (value < 10) return value.toString().padStart(2, "0");
    return value.toString();
  };

  return (
    <section
      ref={sectionRef}
      className="w-full pt-16 sm:py-20 px-6 sm:px-8 md:px-10"
    >
      <div className="max-w-6xl mx-auto text-white flex flex-col items-center gap-8 sm:gap-10">
        {/* Badge */}
        {aboutBadgeTitle && (
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-white/30 bg-transparent text-white text-sm font-medium">
            {aboutBadgeTitle}
          </div>
        )}

        {/* Heading */}
        {aboutHeading && (
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-semibold text-center ${poppins.className}`}
          >
            {aboutHeading}
          </h2>
        )}

        {/* Description */}
        {aboutDescription && (
          <p
            className={`max-w-4xl text-center text-base sm:text-lg md:text-xl leading-relaxed text-white/90 ${poppins.className}`}
          >
            {aboutDescription}
          </p>
        )}

        {/* Stats */}
        {aboutStats?.length ? (
          <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-center">
            {aboutStats.map((stat, index) => (
              <div
                key={`${stat.statTitle}-${index}`}
                className={`flex flex-col items-center gap-3 py-10 sm:py-12 ${
                  index !== 0 ? "lg:border-l lg:border-white/20" : ""
                }`}
              >
                <div className="flex items-baseline justify-center gap-2">
                  <span
                    className={`text-4xl sm:text-8xl font-light ${poppins.className}`}
                  >
                    {formatValue(counts[index] ?? 0)}
                  </span>
                  <span className="text-amber-200 text-4xl sm:text-5xl font-light">
                    +
                  </span>
                </div>
                <p
                  className={`text-lg sm:text-xl font-normal text-white ${poppins.className}`}
                >
                  {stat.statTitle}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

