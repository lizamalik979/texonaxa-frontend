"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { poppins } from "../../fonts";
import Spline from "@splinetool/react-spline";

const SPLINE_URL = "https://prod.spline.design/jeCE9g-t7Gk8oO9M/scene.splinecode";

export default function Loader() {
  const [showSpline, setShowSpline] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [timerPassed, setTimerPassed] = useState(false);

  useEffect(() => {
    // Show Spline only after minimum delay
    const splineTimer = setTimeout(() => {
      setTimerPassed(true);
      // Only show if Spline is also loaded
      if (splineLoaded) {
        // Small delay for smooth transition
        setTimeout(() => {
          setShowSpline(true);
        }, 200);
      }
    }, 1500);

    return () => {
      clearTimeout(splineTimer);
    };
  }, [splineLoaded]);

  const handleLoad = () => {
    setSplineLoaded(true);
    // Only show if timer has also passed
    if (timerPassed) {
      // Small delay for smooth transition
      setTimeout(() => {
        setShowSpline(true);
      }, 200);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="flex items-center justify-center">
        {/* TEX - fade in animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white ${poppins.className} flex items-center`}
        >
          TEX
        </motion.div>

        {/* Spline - hidden until both loaded and timer passed */}
        <div
          className={`relative flex items-center overflow-hidden transition-all duration-1000 ease-in-out ${
            showSpline ? 'w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32' : 'w-0 h-0'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={showSpline ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ 
              opacity: { duration: 1.5, ease: [0.4, 0, 0.2, 1] },
              scale: { duration: 1.5, ease: [0.4, 0, 0.2, 1] }
            }}
            className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 aspect-square"
            style={{ 
              visibility: showSpline ? 'visible' : 'hidden',
              pointerEvents: showSpline ? 'auto' : 'none'
            }}
          >
            <Spline 
              scene={SPLINE_URL}
              onLoad={handleLoad}
            />
          </motion.div>
        </div>

        {/* NAXA - fade in animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white ${poppins.className} flex items-center`}
        >
          NAXA
        </motion.div>
      </div>
    </div>
  );
}

