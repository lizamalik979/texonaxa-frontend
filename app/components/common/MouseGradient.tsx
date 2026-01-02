"use client";

import { useEffect, useState, useRef } from "react";
import { useSection } from "../../contexts/SectionContext";

const sectionGradients: Record<string, string> = {
  hero: "radial-gradient(circle, rgba(240, 175, 78, 0.25) 0%, rgba(147, 51, 234, 0.2) 30%, transparent 70%)",
  about: "radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(236, 72, 153, 0.2) 30%, transparent 70%)", // yellow to pink
  services: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.2) 30%, transparent 70%)", // violet to blue
  ourServices: "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, rgba(59, 130, 246, 0.2) 30%, transparent 70%)", // purple to blue
  digitalGrowth: "radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, rgba(251, 191, 36, 0.2) 30%, transparent 70%)", // green to yellow
  ourStory: "radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(240, 175, 78, 0.2) 30%, transparent 70%)", // amber gradient
  trustedBy: "radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(139, 92, 246, 0.2) 30%, transparent 70%)", // blue to violet
  testimonials: "radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, rgba(139, 92, 246, 0.2) 30%, transparent 70%)", // pink to violet
  workTogether: "radial-gradient(circle, rgba(240, 175, 78, 0.25) 0%, rgba(147, 51, 234, 0.2) 30%, transparent 70%)", // amber to purple
  default: "radial-gradient(circle, rgba(240, 175, 78, 0.2) 0%, rgba(147, 51, 234, 0.15) 30%, transparent 70%)",
};

export default function MouseGradient() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { activeSection } = useSection();
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const isTouchDevice = 
      "ontouchstart" in window ||
      (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);
    
    setIsMobile(isTouchDevice || window.innerWidth < 768);

    // Desktop: Mouse move tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Mobile: Touch/Click tracking
    const handleTouchStart = (e: TouchEvent) => {
      // Clear any existing timeout when starting a new touch
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      const touch = e.touches[0];
      if (touch) {
        setMousePosition({ x: touch.clientX, y: touch.clientY });
        setIsVisible(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        setMousePosition({ x: touch.clientX, y: touch.clientY });
        setIsVisible(true);
      }
    };

    const handleTouchEnd = () => {
      // Hide gradient after 1 second on mobile
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    };

    // Always add mouse events (for desktop)
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Add touch events for mobile
    if (isTouchDevice) {
      window.addEventListener("touchstart", handleTouchStart, { passive: true });
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (isTouchDevice) {
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  const gradient = sectionGradients[activeSection] || sectionGradients.default;
  const size = isMobile ? "200px" : "600px";
  const blur = isMobile ? "20px" : "40px";

  return (
    <div
      className="fixed pointer-events-none z-[9999] mix-blend-screen"
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
        background: gradient,
        borderRadius: "50%",
        transition: "background 0.5s ease, opacity 0.3s ease",
        filter: `blur(${blur})`,
      }}
    />
  );
}

