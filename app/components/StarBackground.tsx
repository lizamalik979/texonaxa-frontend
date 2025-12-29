"use client";

import { useEffect, useRef, useCallback } from "react";
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

// Star color - bright blue head fading to lighter blue tail
const starColors: MeteorColor[] = [
  { head: { r: 80, g: 150, b: 255 }, tail: { r: 30, g: 80, b: 180 }, glow: { r: 50, g: 120, b: 255 } },
];

function rgbToHex(r: number, g: number, b: number): number {
  return (r << 16) + (g << 8) + b;
}

// Quadratic bezier curve calculation
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

// Background star interface
interface BackgroundStar {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  const hasTouch =
    "ontouchstart" in window ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);
  const prefersCoarse = window.matchMedia?.("(pointer: coarse)")?.matches;
  return Boolean(hasTouch || prefersCoarse);
};

export default function StarBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsCanvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const meteorsRef = useRef<Meteor[]>([]);
  const idCounterRef = useRef(0);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const isReadyRef = useRef(false);

  // Background stars effect
  useEffect(() => {
    const canvas = starsCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create stars
    const stars: BackgroundStar[] = [];
    const starCount = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 12000));

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 0.8 + 0.8,
        brightness: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.05 + 0.006,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        const alpha = star.brightness * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        if (star.size > 1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.15})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    if (typeof window !== "undefined" && (window.innerWidth < 1024 || isTouchDevice())) return;

    const initPixi = async () => {
      const app = new PIXI.Application();

      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      containerRef.current?.appendChild(app.canvas);
      appRef.current = app;
      isReadyRef.current = true;

      const handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      // Animation loop
      app.ticker.add(() => {
        const toRemove: Meteor[] = [];

        meteorsRef.current.forEach((meteor) => {
          meteor.progress += meteor.speed;

          if (meteor.progress >= 1) {
            toRemove.push(meteor);
            return;
          }

          if (meteor.progress < 0) {
            return;
          }

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
    if (!appRef.current) return;

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
    appRef.current!.stage.addChild(graphics);

    const meteor: Meteor = {
      id: idCounterRef.current++,
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
    if (!appRef.current || !isReadyRef.current) return;

    const MAX_METEORS = 6;
    if (meteorsRef.current.length >= MAX_METEORS) return;

    // Always create only 1 meteor
    createSingleMeteor(x, y, 0, 0);
  }, [createSingleMeteor]);

  // Use window event listeners for mouse tracking
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024 || isTouchDevice()) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      lastPosRef.current = { x, y };

      if (!hoverTimeoutRef.current && isReadyRef.current) {
        spawnMeteor(x, y);

        hoverTimeoutRef.current = setInterval(() => {
          if (lastPosRef.current) {
            spawnMeteor(lastPosRef.current.x, lastPosRef.current.y);
          }
        }, 8000);
      }
    };

    const handleMouseLeave = () => {
      if (hoverTimeoutRef.current) {
        clearInterval(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      lastPosRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (hoverTimeoutRef.current) {
        clearInterval(hoverTimeoutRef.current);
      }
    };
  }, [spawnMeteor]);

  return (
    <>
      {/* Visual layer - behind content */}
      <div className="fixed inset-0 w-full h-full overflow-hidden bg-black z-0">
        {/* Smoky gradient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(20, 30, 60, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 30%, rgba(30, 20, 50, 0.3) 0%, transparent 45%),
              radial-gradient(ellipse at 60% 80%, rgba(15, 25, 45, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse at 10% 70%, rgba(25, 15, 40, 0.25) 0%, transparent 40%),
              linear-gradient(180deg, rgba(5, 5, 15, 1) 0%, rgba(0, 0, 0, 1) 100%)
            `
          }}
        />

        {/* Twinkling stars canvas */}
        <canvas
          ref={starsCanvasRef}
          className="absolute inset-0 pointer-events-none"
        />

        {/* PixiJS container for shooting stars */}
        <div
          ref={containerRef}
          className="absolute inset-0 pointer-events-none"
        />
      </div>

    </>
  );
}
