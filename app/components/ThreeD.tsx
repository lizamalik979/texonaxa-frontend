"use client";
import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { poppins } from "../fonts";

const World = dynamic(() => import("./ui/globe").then((m) => m.World), {
  ssr: false,
});

export default function ThreeD() {
  const globeConfig = {
    pointSize: 4,
    globeColor: "#0e274b",
    showAtmosphere: true,
    atmosphereColor: "#dfe9ff",
    atmosphereAltitude: 0.1,
    emissive: "#0b1d35",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "#E9B01B",
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    landColor: "#d28F14",
    landSwellColor: "#f0af4e",
    landHighlightColor: "#d28F14",
    landShadowColor: "#8B5A2B",
    landGradientStrength: 0.95,
    landAltitude: 0.05,
    landAltitudeVariance: 0.03,
    landLightDirection: [-0.2, 0.95, 0.3] as [number, number, number],
    landMountainHeight: 0.08,
    landMountainFrequency: 1.65,
    landRidgeContrast: 2.6,
    landAmbientShadow: 0.65,
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 1.0,
  };
  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  const sampleArcs = [
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -1.303396,
      endLng: 36.852443,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: -15.785493,
      startLng: -47.909029,
      endLat: 36.162809,
      endLng: -115.119411,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -33.8688,
      startLng: 151.2093,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: 21.3099,
      startLng: -157.8581,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
   
  ];

  return (
    <section className="w-full text-white px-4 sm:px-6 lg:px-8 overflow-hidden py-10 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">

        {/* Flex container for Text - Globe - Text */}
        <div className="w-full flex items-center justify-center  relative h-[300px] sm:h-[400px]">

          {/* TAXA - Left Side */}
          <div className="flex-1 flex justify-end">
            <h2
              className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold bg-gradient-to-b from-white to-black bg-clip-text text-transparent z-10 ${poppins.className}`}
            >
              TAXA
            </h2>
          </div>

          {/* Globe - Center */}
          <motion.div
            className="w-full h-full max-w-[220px] max-h-[220px] sm:max-w-[350px] sm:max-h-[350px] z-30 relative flex items-center justify-center shrink-0"
            initial={{ 
              opacity: 0, 
              scale: 0.3,
              y: 100
            }}
            whileInView={{ 
              opacity: 1,
              scale: 1,
              y: 0
            }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
              duration: 2.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              opacity: { 
                duration: 2,
                ease: "easeOut"
              },
              scale: { 
                duration: 2.5,
                ease: [0.34, 1.56, 0.64, 1]
              },
              y: {
                duration: 2.5,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            }}
          >
            <div className="w-full h-full aspect-square relative">
              <World data={sampleArcs} globeConfig={globeConfig} />
            </div>
          </motion.div>

          {/* NOVA - Right Side */}
          <div className="flex-1 flex justify-start">
            <h2
              className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold bg-gradient-to-b from-white to-black bg-clip-text text-transparent z-10 ${poppins.className}`}
            >
              NOVA
            </h2>
          </div>

        </div>

        {/* Copyright text */}
        <p className={`text-center text-sm sm:text-base text-white/50 ${poppins.className} mt-8`}>
          @2025 Taxa Nova. Click for privacy & term & condition
        </p>
      </div>
    </section>
  );
}
