"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { poppins } from "../../fonts";

interface ServiceOurServicesProps {
  serviceHeading?: string;
  serviceDescription?: string;
  serviceCards?: {
    cardHeading: string;
    cardImg: string;
    cardUrl: string;
  }[];
}

export default function ServiceOurServices({
  serviceHeading,
  serviceDescription,
  serviceCards,
}: ServiceOurServicesProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    }),
  };

  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <motion.section
      className="w-full py-20 px-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div className="max-w-7xl mx-auto" variants={fadeInUp} custom={0}>
        {/* Header */}
        <motion.div className="text-center mb-16" variants={fadeInUp} custom={0.05}>
          {serviceHeading && (
            <motion.h2
              className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 ${poppins.className}`}
              variants={fadeInUp}
              custom={0.08}
            >
              {serviceHeading}
            </motion.h2>
          )}
          {serviceDescription && (
            <motion.p
              className={`max-w-7xl mx-auto text-white text-base md:text-xl opacity-80 ${poppins.className}`}
              variants={fadeInUp}
              custom={0.12}
            >
              {serviceDescription}
            </motion.p>
          )}
        </motion.div>

        {/* Services Grid */}
        {serviceCards && serviceCards.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={fadeInUp}
            custom={0.1}
          >
            {serviceCards.map((service, index) => (
              <motion.div
                key={index}
                className="group relative rounded-2xl h-96 overflow-hidden border border-gray-800/50 cursor-pointer"
                variants={fadeInUp}
                custom={0.15 + index * 0.05}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                onClick={() => setActiveCard(activeCard === index ? null : index)}
              >
                {/* Image Background */}
                <div
                  className={`absolute inset-0 transition-all duration-300 group-hover:blur-xs ${
                    activeCard === index ? "blur-xs" : ""
                  }`}
                >
                  {service.cardImg ? (
                    <Image
                      src={service.cardImg}
                      alt={service.cardHeading}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 via-purple-500/20 to-orange-500/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-48 bg-gray-600/60 rounded-lg shadow-2xl"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Blur overlay - appears on hover */}
                <div
                  className={`absolute inset-0 bg-black/30  opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10 ${
                    activeCard === index ? "opacity-100" : ""
                  }`}
                ></div>

                {/* Content Overlay - Hidden initially, appears on hover */}
                <div
                  className={`absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4 z-20 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ${
                    activeCard === index ? "opacity-100 translate-y-0" : ""
                  }`}
                >
                  {/* Service Title */}
                  <h3 className={`text-white text-xl font-bold ${poppins.className}`}>
                    {service.cardHeading}
                  </h3>

                  {/* More Details Button */}
                  {service.cardUrl && (
                    <Link
                      href={service.cardUrl}
                      className={`w-fit py-3 px-6 bg-amber-200 rounded-lg hover:scale-105 transition-all duration-300 ${poppins.className}`}
                    >
                      <span className="text-black text-base font-medium">
                        More details
                      </span>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
}


