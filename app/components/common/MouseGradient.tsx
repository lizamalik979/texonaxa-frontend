"use client";

import { useEffect, useState } from "react";
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
  const { activeSection } = useSection();

  useEffect(() => {
    // Only enable on desktop (non-touch devices)
    const isTouchDevice = 
      "ontouchstart" in window ||
      (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);
    
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  const gradient = sectionGradients[activeSection] || sectionGradients.default;

  return (
    <div
      className="fixed pointer-events-none z-[9999] mix-blend-screen"
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
        transform: "translate(-50%, -50%)",
        width: "600px",
        height: "600px",
        background: gradient,
        borderRadius: "50%",
        transition: "background 0.5s ease, opacity 0.3s ease",
        filter: "blur(40px)",
      }}
    />
  );
}

