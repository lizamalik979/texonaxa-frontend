"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

// Star color palettes
const starColors: MeteorColor[] = [
  { head: { r: 200, g: 240, b: 255 }, tail: { r: 100, g: 200, b: 255 }, glow: { r: 80, g: 180, b: 255 } },
  { head: { r: 255, g: 240, b: 200 }, tail: { r: 255, g: 180, b: 80 }, glow: { r: 255, g: 150, b: 50 } },
  { head: { r: 240, g: 200, b: 255 }, tail: { r: 180, g: 100, b: 255 }, glow: { r: 150, g: 80, b: 220 } },
  { head: { r: 255, g: 220, b: 220 }, tail: { r: 255, g: 120, b: 150 }, glow: { r: 255, g: 100, b: 130 } },
  { head: { r: 255, g: 250, b: 220 }, tail: { r: 255, g: 200, b: 100 }, glow: { r: 255, g: 180, b: 80 } },
  { head: { r: 220, g: 255, b: 230 }, tail: { r: 100, g: 255, b: 180 }, glow: { r: 80, g: 220, b: 150 } },
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

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const meteorsRef = useRef<Meteor[]>([]);
  const idCounterRef = useRef(0);
  const [clickHint, setClickHint] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

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
      setIsReady(true);

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

          const start = { x: meteor.startX, y: meteor.startY };
          const control = { x: meteor.controlX, y: meteor.controlY };
          const end = { x: meteor.endX, y: meteor.endY };
          const { color } = meteor;

          // Current position on curve
          const currentPos = getQuadraticPoint(meteor.progress, start, control, end);

          // Add to trail
          meteor.trail.push({ x: currentPos.x, y: currentPos.y });

          // Fade out effect
          const fadeStart = 0.4;
          const fadeOut = meteor.progress > fadeStart 
            ? 1 - ((meteor.progress - fadeStart) / (1 - fadeStart))
            : 1;
          const fade = Math.pow(fadeOut, 1.5);

          // Limit trail length
          const maxTrailLength = Math.floor(60 * fade) + 10;
          while (meteor.trail.length > maxTrailLength) {
            meteor.trail.shift();
          }

          // Clear and redraw
          meteor.graphics.clear();

          if (fade <= 0 || meteor.trail.length < 2) return;

          const trailLength = meteor.trail.length;

          const glowColor = rgbToHex(color.glow.r, color.glow.g, color.glow.b);
          const headColor = rgbToHex(color.head.r, color.head.g, color.head.b);

          // Subtle ambient aura along entire trail
          for (let i = 1; i < trailLength; i += 4) {
            const point = meteor.trail[i];
            const t = i / trailLength;
            const auraSize = (12 + t * 20) * fade;
            const auraOpacity = 0.02 * fade;
            
            meteor.graphics.circle(point.x, point.y, auraSize);
            meteor.graphics.fill({ color: glowColor, alpha: auraOpacity });
          }

          // Draw outer glow along entire trail
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

          // Draw the main tail - line segments
          for (let i = 1; i < trailLength; i++) {
            const prev = meteor.trail[i - 1];
            const curr = meteor.trail[i];
            
            const t = i / trailLength;
            const opacity = Math.pow(t, 2) * 0.9 * fade;
            const width = (Math.pow(t, 1.2) * 3.5 + 0.3) * fade;
            
            const r = Math.floor(color.tail.r + (color.head.r - color.tail.r) * t);
            const g = Math.floor(color.tail.g + (color.head.g - color.tail.g) * t);
            const b = Math.floor(color.tail.b + (color.head.b - color.tail.b) * t);
            
            if (opacity > 0.01 && width > 0.1) {
              meteor.graphics.moveTo(prev.x, prev.y);
              meteor.graphics.lineTo(curr.x, curr.y);
              meteor.graphics.stroke({ color: rgbToHex(r, g, b), alpha: opacity, width, cap: "round" });
            }
          }

          // Draw bright core along last part of trail
          for (let i = Math.floor(trailLength * 0.7); i < trailLength; i++) {
            const prev = meteor.trail[i - 1];
            const curr = meteor.trail[i];
            const t = (i - trailLength * 0.7) / (trailLength * 0.3);
            const coreOpacity = Math.pow(t, 1.5) * 0.8 * fade;
            const coreWidth = (Math.pow(t, 1) * 2 + 0.3) * fade;
            
            if (coreOpacity > 0.01) {
              meteor.graphics.moveTo(prev.x, prev.y);
              meteor.graphics.lineTo(curr.x, curr.y);
              meteor.graphics.stroke({ color: 0xffffff, alpha: coreOpacity, width: coreWidth, cap: "round" });
            }
          }

          // Bright head glow - outer
          meteor.graphics.circle(currentPos.x, currentPos.y, 8 * fade);
          meteor.graphics.fill({ color: glowColor, alpha: 0.25 * fade });

          // Bright head glow - middle
          meteor.graphics.circle(currentPos.x, currentPos.y, 5 * fade);
          meteor.graphics.fill({ color: headColor, alpha: 0.5 * fade });

          // Bright head glow - inner
          meteor.graphics.circle(currentPos.x, currentPos.y, 3 * fade);
          meteor.graphics.fill({ color: 0xffffff, alpha: 0.7 * fade });

          // Bright white core
          meteor.graphics.circle(currentPos.x, currentPos.y, 1.5 * fade);
          meteor.graphics.fill({ color: 0xffffff, alpha: fade });
        });

        // Remove finished meteors
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

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!appRef.current || !isReady) return;

    // Limit max concurrent meteors for performance
    const MAX_METEORS = 12;
    if (meteorsRef.current.length >= MAX_METEORS) return;

    setClickHint(false);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Spawn 1 meteor per click
    const meteorCount = 1;

    for (let m = 0; m < meteorCount; m++) {
      // Start exactly from click point (tiny offset for multiple meteors)
      const offsetX = meteorCount > 1 ? (Math.random() - 0.5) * 10 : 0;
      const offsetY = meteorCount > 1 ? (Math.random() - 0.5) * 10 : 0;
      const startX = clickX + offsetX;
      const startY = clickY + offsetY;

      // Disney-style arc: direction based on click position
      const distance = 3500 + Math.random() * 2000;
      const screenMidX = window.innerWidth / 2;
      
      // If click is on left side, go right. If on right side, go left.
      const goingRight = startX < screenMidX;
      const directionX = goingRight ? 1 : -1;
      
      // End point: down and to the opposite side
      const endX = startX + directionX * distance * (0.6 + Math.random() * 0.4);
      const endY = startY + distance * (0.5 + Math.random() * 0.4);
      
      // Control point: big sweeping arc (curves up then down)
      const curveStrength = 450 + Math.random() * 250;
      const controlX = startX + directionX * distance * 0.35;
      const controlY = startY - curveStrength;

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
        progress: 0,
        speed: 0.002 + Math.random() * 0.002,
        color,
        trail: [],
        graphics,
      };

      meteorsRef.current.push(meteor);
    }
  }, [isReady]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/images/backgroundImage.svg')` }}
      />
      
      {/* PixiJS container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 cursor-crosshair"
        onClick={handleClick}
      />

      {clickHint && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-pulse">
            <div className="text-7xl mb-6">✦</div>
            <p className="text-white/40 text-lg font-light tracking-[0.3em] uppercase">
              Click anywhere
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
