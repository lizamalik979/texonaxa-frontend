"use client";

import { poppins } from "../fonts";
import OpenLeadModalButton from "./leads/OpenLeadModalButton";

export default function WorkTogether() {
  return (
    <section className="w-full py-20 px-0 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex justify-center">
        <div className="flex flex-col items-center gap-3">
          {/* Heading */}
          <h2 className={`text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-medium bg-gradient-to-b from-white via-gray-500 to-black bg-clip-text text-transparent leading-tight overflow-visible ${poppins.className}`}>
            Let's Work Together
          </h2>

          {/* Button */}
          <OpenLeadModalButton className="px-5 py-3 bg-amber-200 rounded-lg inline-flex justify-center items-center gap-2.5 hover:scale-105 transition-all duration-300">
            <span className={`text-center text-black text-xl sm:text-2xl font-medium ${poppins.className}`}>
              Get in touch
            </span>
          </OpenLeadModalButton>

        </div>
      </div>
    </section>
  );
}
