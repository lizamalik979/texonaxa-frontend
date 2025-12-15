"use client";

import { motion } from "framer-motion";
import { poppins } from "../fonts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function DigitalGrowth() {
  const posts = [
    {
      date: "08.08.2021",
      title: "Nina Smith vibrant work collab with Nike Dunk",
      description: "Progressively incentivize cooperative systems through technically sound functionalities.",
    },
    {
      date: "15.09.2021",
      title: "Creative collaboration with innovative brands",
      description: "Transform your brand with cutting-edge digital solutions that drive engagement.",
    },
    {
      date: "22.10.2021",
      title: "Modern design trends in digital marketing",
      description: "Explore the latest trends that are shaping the future of digital experiences.",
    },
    {
      date: "05.11.2021",
      title: "Building sustainable digital ecosystems",
      description: "Creating long-term value through strategic digital transformation initiatives.",
    },
    {
      date: "12.12.2021",
      title: "The future of interactive web experiences",
      description: "Discover how interactive technologies are revolutionizing user engagement.",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    }),
  };

  return (
    <motion.section
      className="w-full py-20 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div className="max-w-7xl mx-auto" variants={fadeInUp} custom={0}>
        {/* Header */}
        <motion.div className="text-center mb-16" variants={fadeInUp} custom={0.05}>
          <motion.h2
            className={`text-2xl sm:text-3xl md:text-4xl px-8 font-bold text-white mb-6 ${poppins.className}`}
            variants={fadeInUp}
            custom={0.08}
          >
            Fresh Perspectives on Branding & Digital Growth
          </motion.h2>
          <motion.p
            className={`max-w-7xl mx-auto text-white text-base px-8 md:text-xl opacity-80 ${poppins.className}`}
            variants={fadeInUp}
            custom={0.12}
          >
            Transform your brand with our innovative digital solutions that captivate and engage your audience.
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          className="relative px-12"
          variants={fadeInUp}
          custom={0.15}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {posts.map((post, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    className="flex flex-col gap-0 items-center"
                    variants={fadeInUp}
                    custom={0.2 + index * 0.05}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    {/* Image Section - Separate and Distinct */}
                    <div className="relative max-w-72 max-h-72 w-full aspect-square bg-gradient-to-br from-yellow-400/40 via-green-400/30 to-yellow-300/40 rounded-2xl overflow-hidden">
                      {/* Gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/50 via-green-400/40 to-yellow-300/50"></div>
                      {/* Phone-like shape in center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-48 bg-gray-800/80 rounded-lg shadow-2xl border border-gray-700/50"></div>
                      </div>
                    </div>

                    {/* Content Section - Completely Separate Below */}
                    <div className="max-w-[320px] py-8 bg-transparent flex flex-col gap-4">
                      {/* Date */}
                      <p className={`text-white text-sm opacity-70 ${poppins.className}`}>
                        {post.date}
                      </p>

                      {/* Title */}
                      <h3 className={`text-white text-xl font-bold ${poppins.className}`}>
                        {post.title}
                      </h3>

                      {/* Description */}
                      <p className={`text-white text-sm opacity-80 line-clamp-2 ${poppins.className}`}>
                        {post.description}
                      </p>

                      {/* Read More Button */}
                      <button className={`w-full py-3 px-6 bg-transparent border border-[#FEE39A] rounded-lg hover:border-[#FEE39A] transition-all duration-300 ${poppins.className}`}>
                        <span className="text-[#FEE39A] text-base font-medium">
                          Read More
                        </span>
                      </button>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12 bg-black/50 border-gray-800 text-white hover:bg-black/70 hover:text-white" />
            <CarouselNext className="-right-12 bg-black/50 border-gray-800 text-white hover:bg-black/70 hover:text-white" />
          </Carousel>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

