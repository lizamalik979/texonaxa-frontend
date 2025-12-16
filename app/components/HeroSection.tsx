"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { orbitron, poppins } from "../fonts";
import { GalaxyCanvas } from "./ui/galaxy";

export default function HeroSection() {
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

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8 py-20 overflow-hidden">
      <GalaxyCanvas />
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
