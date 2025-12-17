"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { orbitron, poppins } from "../fonts";
import * as PIXI from "pixi.js";

interface MeteorColor {
  head: { r: number; g: number; b: number };
  tail: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
}

interface TrailPoint {
  x: number;
  y: number;
}

interface Meteor {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  controlX: number;
  controlY: number;
  progress: number;
  speed: number;
  color: MeteorColor;
  trail: TrailPoint[];
  graphics: PIXI.Graphics;
}

const starColors: MeteorColor[] = [
  { head: { r: 80, g: 150, b: 255 }, tail: { r: 30, g: 80, b: 180 }, glow: { r: 50, g: 120, b: 255 } },
];

function rgbToHex(r: number, g: number, b: number): number {
  return (r << 16) + (g << 8) + b;
}

function getQuadraticPoint(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) {
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
  return { x, y };
}

const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  const hasTouch =
    "ontouchstart" in window ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);
  const prefersCoarse = window.matchMedia?.("(pointer: coarse)")?.matches;
  return Boolean(hasTouch || prefersCoarse);
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const starsContainerRef = useRef<HTMLDivElement>(null);
  const starsAppRef = useRef<PIXI.Application | null>(null);
  const meteorsRef = useRef<Meteor[]>([]);
  const starsIdCounterRef = useRef(0);
  const starsHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const starsLastPosRef = useRef<{ x: number; y: number } | null>(null);
  const starsIsReadyRef = useRef(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isInteractionReady, setIsInteractionReady] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.5,
        ease: "easeOut" as const,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Disable interactions for 1 second after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInteractionReady(true);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer to pause video when out of viewport
  useEffect(() => {
    if (!sectionRef.current || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Pause when less than 10% visible
          const visible = entry.intersectionRatio > 0.1;
          setIsVisible(visible);
          
          if (videoRef.current) {
            if (visible) {
              videoRef.current.play().catch(() => {
                // Handle autoplay restrictions
              });
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: "-10% 0px -10% 0px", // Trigger when 10% from top/bottom
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // 3D tilt effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Don't respond to cursor if interactions aren't ready
      if (!isInteractionReady) {
        setMousePosition({ x: 0, y: 0 });
        return;
      }

      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate mouse position relative to center (-1 to 1)
      const rawX = (e.clientX - centerX) / (rect.width / 2);
      const rawY = (e.clientY - centerY) / (rect.height / 2);
      
      // Calculate distance from center (0 to ~1.414 for corners)
      const distance = Math.sqrt(rawX * rawX + rawY * rawY);
      
      // Dampening function: reduce rotation as we approach corners
      // At center (distance = 0): full rotation
      // At corners (distance = 1.414): reduced rotation (about 40% of max)
      const dampeningFactor = Math.max(0.4, 1 - (distance * 0.4));
      
      // Apply dampening to reduce wobble at corners
      const x = rawX * dampeningFactor;
      const y = rawY * dampeningFactor;
      
      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => {
      if (!isInteractionReady) return;
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePosition({ x: 0, y: 0 });
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      section.addEventListener("mouseenter", handleMouseEnter);
      section.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (section) {
        section.removeEventListener("mousemove", handleMouseMove);
        section.removeEventListener("mouseenter", handleMouseEnter);
        section.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isInteractionReady]);

  // Initialize PixiJS for falling stars - wait for video and content to render first
  useEffect(() => {
    if (!starsContainerRef.current || starsAppRef.current) return;
    if (typeof window !== "undefined" && (window.innerWidth < 1024 || isTouchDevice())) return;

    // Wait for video and content to render before initializing stars
    const initPixi = async () => {
      // Wait for video to be ready
      const waitForVideo = () => {
        return new Promise<void>((resolve) => {
          if (videoRef.current) {
            if (videoRef.current.readyState >= 2) {
              // Video is loaded enough
              resolve();
            } else {
              videoRef.current.addEventListener('loadeddata', () => resolve(), { once: true });
              // Fallback timeout
              setTimeout(() => resolve(), 2000);
            }
          } else {
            // No video ref yet, wait a bit
            setTimeout(() => resolve(), 1000);
          }
        });
      };

      // Wait for video and add extra delay for content rendering
      await waitForVideo();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Additional 1s for content to render

      const app = new PIXI.Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        antialias: false, // Disable antialiasing for better performance
        resolution: Math.min(window.devicePixelRatio || 1, 2), // Cap resolution at 2x for performance
        autoDensity: true,
      });

      // Style the canvas to ensure it's visible
      app.canvas.style.position = "absolute";
      app.canvas.style.top = "0";
      app.canvas.style.left = "0";
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";
      app.canvas.style.pointerEvents = "none";
      
      starsContainerRef.current?.appendChild(app.canvas);
      starsAppRef.current = app;
      starsIsReadyRef.current = true;

      const handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      app.ticker.add(() => {
        const toRemove: Meteor[] = [];
        meteorsRef.current.forEach((meteor) => {
          meteor.progress += meteor.speed;
          if (meteor.progress >= 1) {
            toRemove.push(meteor);
            return;
          }
          if (meteor.progress < 0) return;

          const start = { x: meteor.startX, y: meteor.startY };
          const control = { x: meteor.controlX, y: meteor.controlY };
          const end = { x: meteor.endX, y: meteor.endY };
          const { color } = meteor;
          const currentPos = getQuadraticPoint(meteor.progress, start, control, end);
          meteor.trail.push({ x: currentPos.x, y: currentPos.y });

          const fadeStart = 0.5;
          const fadeOut = meteor.progress > fadeStart
            ? 1 - ((meteor.progress - fadeStart) / (1 - fadeStart))
            : 1;
          const fade = Math.pow(fadeOut, 2);
          const maxTrailLength = Math.floor(120 * fade) + 20;
          while (meteor.trail.length > maxTrailLength) {
            meteor.trail.shift();
          }

          meteor.graphics.clear();
          if (fade <= 0 || meteor.trail.length < 2) return;

          const trailLength = meteor.trail.length;
          const glowColor = rgbToHex(color.glow.r, color.glow.g, color.glow.b);
          const headColor = rgbToHex(color.head.r, color.head.g, color.head.b);

          for (let i = 1; i < trailLength; i += 4) {
            const point = meteor.trail[i];
            const t = i / trailLength;
            const auraSize = (12 + t * 20) * fade;
            const auraOpacity = 0.02 * fade;
            meteor.graphics.circle(point.x, point.y, auraSize);
            meteor.graphics.fill({ color: glowColor, alpha: auraOpacity });
          }

          for (let i = 1; i < trailLength; i++) {
            const prev = meteor.trail[i - 1];
            const curr = meteor.trail[i];
            const t = i / trailLength;
            const glowOpacity = Math.pow(t, 2) * 0.1 * fade;
            const glowWidth = (Math.pow(t, 0.8) * 12 + 1) * fade;
            if (glowOpacity > 0.01) {
              meteor.graphics.moveTo(prev.x, prev.y);
              meteor.graphics.lineTo(curr.x, curr.y);
              meteor.graphics.stroke({ color: glowColor, alpha: glowOpacity, width: glowWidth, cap: "round" });
            }
          }

          for (let i = 1; i < trailLength; i++) {
            const prev = meteor.trail[i - 1];
            const curr = meteor.trail[i];
            const t = i / trailLength;
            const opacity = Math.pow(t, 2) * 0.9 * fade;
            const width = (Math.pow(t, 1.2) * 2 + 0.2) * fade;
            const r = Math.floor(color.tail.r + (color.head.r - color.tail.r) * t);
            const g = Math.floor(color.tail.g + (color.head.g - color.tail.g) * t);
            const b = Math.floor(color.tail.b + (color.head.b - color.tail.b) * t);
            if (opacity > 0.01 && width > 0.1) {
              meteor.graphics.moveTo(prev.x, prev.y);
              meteor.graphics.lineTo(curr.x, curr.y);
              meteor.graphics.stroke({ color: rgbToHex(r, g, b), alpha: opacity, width, cap: "round" });
            }
          }

          for (let i = Math.floor(trailLength * 0.7); i < trailLength; i++) {
            const prev = meteor.trail[i - 1];
            const curr = meteor.trail[i];
            const t = (i - trailLength * 0.7) / (trailLength * 0.3);
            const coreOpacity = Math.pow(t, 1.5) * 0.8 * fade;
            const coreWidth = (Math.pow(t, 1) * 1.2 + 0.2) * fade;
            if (coreOpacity > 0.01) {
              meteor.graphics.moveTo(prev.x, prev.y);
              meteor.graphics.lineTo(curr.x, curr.y);
              meteor.graphics.stroke({ color: 0xffffff, alpha: coreOpacity, width: coreWidth, cap: "round" });
            }
          }

          meteor.graphics.circle(currentPos.x, currentPos.y, 6 * fade);
          meteor.graphics.fill({ color: glowColor, alpha: 0.22 * fade });
          meteor.graphics.circle(currentPos.x, currentPos.y, 4 * fade);
          meteor.graphics.fill({ color: headColor, alpha: 0.5 * fade });
          meteor.graphics.circle(currentPos.x, currentPos.y, 2.5 * fade);
          meteor.graphics.fill({ color: 0xffffff, alpha: 0.7 * fade });
          meteor.graphics.circle(currentPos.x, currentPos.y, 1.3 * fade);
          meteor.graphics.fill({ color: 0xffffff, alpha: fade });
        });

        toRemove.forEach((meteor) => {
          app.stage.removeChild(meteor.graphics);
          meteor.graphics.destroy();
          meteorsRef.current = meteorsRef.current.filter((m) => m.id !== meteor.id);
        });
      });

      return () => {
        window.removeEventListener("resize", handleResize);
        app.destroy(true);
      };
    };

    initPixi();
  }, []);

  const createSingleMeteor = useCallback((x: number, y: number, delayProgress: number = 0, angleOffset: number = 0) => {
    if (!starsAppRef.current) return;

    const startX = x;
    const startY = y;
    const baseAngle = 45 * (Math.PI / 180);
    const angle = baseAngle + angleOffset;
    const distance = 2000 + Math.random() * 400;
    const screenMidX = window.innerWidth / 2;
    const directionX = startX > screenMidX ? -1 : 1;
    const travel = distance * 0.7;
    const endX = startX + Math.cos(angle) * travel * directionX;
    const endY = startY + Math.sin(angle) * travel;
    const controlX = startX + Math.cos(angle) * travel * 0.5 * directionX;
    const controlY = startY + Math.sin(angle) * travel * 0.5;
    const color = starColors[Math.floor(Math.random() * starColors.length)];
    const graphics = new PIXI.Graphics();
    graphics.blendMode = "add";
    starsAppRef.current!.stage.addChild(graphics);

    const meteor: Meteor = {
      id: starsIdCounterRef.current++,
      startX,
      startY,
      endX,
      endY,
      controlX,
      controlY,
      progress: -delayProgress,
      speed: 0.0015 + Math.random() * 0.002,
      color,
      trail: [],
      graphics,
    };

    meteorsRef.current.push(meteor);
  }, []);

  const spawnMeteor = useCallback((x: number, y: number) => {
    if (!starsAppRef.current || !starsIsReadyRef.current) return;
    const MAX_METEORS = 6;
    if (meteorsRef.current.length >= MAX_METEORS) return;
    
    // Always spawn only 1 meteor
    createSingleMeteor(x, y, 0, 0);
  }, [createSingleMeteor]);

  // Mouse tracking for falling stars - only in HeroSection (optimized)
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024 || isTouchDevice()) {
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    let throttleTimeout: NodeJS.Timeout | null = null;
    let lastRect: DOMRect | null = null;
    let hoverDelayTimeout: NodeJS.Timeout | null = null;
    let canSpawnStars = false;

    const handleMouseMove = (e: MouseEvent) => {
      // Don't respond to cursor if interactions aren't ready
      if (!isInteractionReady) return;

      // Throttle mouse move events to reduce lag
      if (throttleTimeout) return;
      
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
      }, 50); // Throttle to every 50ms

      if (!sectionRef.current || !starsIsReadyRef.current) return;

      // Cache rect to avoid recalculating on every move
      if (!lastRect) {
        lastRect = sectionRef.current.getBoundingClientRect();
      }

      const x = e.clientX;
      const y = e.clientY;

      // Check if mouse is within HeroSection bounds
      const isInsideSection = 
        x >= lastRect.left && 
        x <= lastRect.right && 
        y >= lastRect.top && 
        y <= lastRect.bottom;

      if (!isInsideSection) {
        // Clear interval if mouse leaves section
        if (starsHoverTimeoutRef.current) {
          clearInterval(starsHoverTimeoutRef.current);
          starsHoverTimeoutRef.current = null;
        }
        if (hoverDelayTimeout) {
          clearTimeout(hoverDelayTimeout);
          hoverDelayTimeout = null;
        }
        starsLastPosRef.current = null;
        lastRect = null; // Reset cache
        canSpawnStars = false;
        return;
      }

      starsLastPosRef.current = { x, y };

      // Wait 3 seconds before starting hover effect
      if (!canSpawnStars && !hoverDelayTimeout) {
        hoverDelayTimeout = setTimeout(() => {
          canSpawnStars = true;
          hoverDelayTimeout = null;
          
          // Start spawning after delay
          if (starsLastPosRef.current && !starsHoverTimeoutRef.current) {
            spawnMeteor(starsLastPosRef.current.x, starsLastPosRef.current.y);
            starsHoverTimeoutRef.current = setInterval(() => {
              if (starsLastPosRef.current) {
                spawnMeteor(starsLastPosRef.current.x, starsLastPosRef.current.y);
              }
            }, 3000);
          }
        }, 3000); // 3 second delay
      }

      // Only spawn if delay has passed
      if (canSpawnStars && !starsHoverTimeoutRef.current) {
        spawnMeteor(x, y);
        starsHoverTimeoutRef.current = setInterval(() => {
          if (starsLastPosRef.current) {
            spawnMeteor(starsLastPosRef.current.x, starsLastPosRef.current.y);
          }
        }, 3000);
      }
    };

    const handleMouseEnter = () => {
      // Reset rect cache when entering
      lastRect = null;
      canSpawnStars = false;
    };

    const handleMouseLeave = () => {
      if (starsHoverTimeoutRef.current) {
        clearInterval(starsHoverTimeoutRef.current);
        starsHoverTimeoutRef.current = null;
      }
      if (hoverDelayTimeout) {
        clearTimeout(hoverDelayTimeout);
        hoverDelayTimeout = null;
      }
      starsLastPosRef.current = null;
      lastRect = null;
      canSpawnStars = false;
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
        throttleTimeout = null;
      }
    };

    // Listen to mouse move on the section only
    section.addEventListener("mousemove", handleMouseMove, { passive: true });
    section.addEventListener("mouseenter", handleMouseEnter);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseenter", handleMouseEnter);
      section.removeEventListener("mouseleave", handleMouseLeave);
      if (starsHoverTimeoutRef.current) {
        clearInterval(starsHoverTimeoutRef.current);
      }
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, [spawnMeteor, isInteractionReady]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-8 py-20 overflow-hidden"
      style={{
        pointerEvents: isInteractionReady ? 'auto' : 'none',
      }}
    >
      {/* Video Background with 3D Effect */}
      <div 
        ref={videoContainerRef}
        className="absolute inset-0 z-[1] w-full h-full pointer-events-none overflow-hidden"
        style={{
          perspective: "1000px",
          backgroundColor: "#000", // Fallback background color
        }}
      >
        <div
          style={{
            transform: `perspective(1000px) rotateY(${mousePosition.x * 6}deg) rotateX(${-mousePosition.y * 6}deg) scale(${isHovering ? 0.95 : 0.92}) translateZ(${isHovering ? 10 : 0}px)`,
            transition: isHovering ? "transform 0.15s ease-out" : "transform 0.5s ease-out",
            transformStyle: "preserve-3d",
            width: "120%", // Reduced since less wobble means less coverage needed
            height: "120%",
            position: "absolute",
            top: "-10%", // Adjusted offset for smaller container
            left: "-10%",
            transformOrigin: "center center",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              opacity: 1,
              width: "100%",
              height: "100%",
              filter: "none",
            }}
          >
            <source src="/videos/video2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      {/* Falling Stars above video */}
      <div
        ref={starsContainerRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ 
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
        }}
      />
      <motion.div
        className="relative z-20 flex flex-col items-center w-full max-w-[1440px] mx-auto gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Heading */}
        <motion.h1
          className={`text-center text-neutral-50 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight ${orbitron.className}`}
        >
          <motion.span
            className="block"
            variants={itemVariants}
          >
            We Build Digital Experiences
          </motion.span>
          <motion.span
            className="flex items-center justify-center gap-3 md:gap-5 mt-4"
            variants={itemVariants}
          >
            <motion.div variants={imageVariants}>
            <Image 
              src="/images/bg.svg" 
              alt="Team" 
              width={140}
              height={50}
              className="rounded-full object-cover"
            />
            </motion.div>
            <span>That Perform</span>
          </motion.span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          className={`max-w-3xl opacity-80 text-center text-white text-base md:text-lg lg:text-xl font-medium mt-4 ${poppins.className}`}
          variants={itemVariants}
        >
          Design, strategy, and technology working together to grow your brand fast and effectively.
        </motion.p>
        
        {/* CTA Button */}
        <motion.button
          className="mt-6 px-8 py-4 bg-amber-200 rounded-lg inline-flex justify-center items-center gap-2.5"
          variants={buttonVariants}
          whileHover="hover"
        >
          <span className={`text-center text-black text-lg md:text-xl lg:text-2xl font-medium ${poppins.className}`}>
            Start Project
          </span>
        </motion.button>
      </motion.div>
    </section>
  );
}
