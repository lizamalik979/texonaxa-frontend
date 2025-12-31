"use client";

import { useState } from "react";
import { poppins } from "../fonts";
import { motion, AnimatePresence } from "framer-motion";
import ContactLeadForm from "./contact/ContactLeadForm";
import { X } from "lucide-react";

export default function WorkTogether() {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <>
      <section className="w-full py-20 px-0 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="flex flex-col items-center gap-3">
            {/* Heading */}
            <h2 className={`text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-medium bg-gradient-to-b from-white via-gray-500 to-black bg-clip-text text-transparent leading-tight overflow-visible ${poppins.className}`}>
              Let's Work Together
            </h2>

            {/* Button */}
            <button 
              onClick={() => setShowContactForm(true)}
              className="px-5 py-3 bg-[#F0AF4E] rounded-lg inline-flex justify-center items-center gap-2.5 hover:scale-105 transition-all duration-300"
            >
              <span className={`text-center text-black text-xl sm:text-2xl font-medium ${poppins.className}`}>
                Get in touch
              </span>
            </button>

          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
              onClick={() => setShowContactForm(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/95 rounded-3xl p-4 sm:p-6 border border-white/10">
                {/* Close Button */}
                <button
                  onClick={() => setShowContactForm(false)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white transition-colors p-2"
                  aria-label="Close form"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Form */}
                <ContactLeadForm />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
