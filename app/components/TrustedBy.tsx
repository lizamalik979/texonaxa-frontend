"use client";

import Image from "next/image";
import Marquee from "@/components/ui/marquee";
import { poppins } from "../fonts";
import { useSection } from "../contexts/SectionContext";

const logos = [
  {
    name: "DAT Freight & Analytics",
    src: "/images/trustedBy/dat.svg",
  },
  {
    name: "SWVL",
    src: "/images/trustedBy/swl.svg",
  },
  {
    name: "THERMAX",
    src: "/images/trustedBy/thermax.svg",
  },
  {
    name: "Hero",
    src: "/images/trustedBy/hero.svg",
  },
  {
    name: "HT Media",
    src: "/images/trustedBy/media.svg",
  },
  {
    name: "LPU",
    src: "/images/trustedBy/lpu.svg",
  },
];

export default function TrustedBy() {
  const { setActiveSection } = useSection();
  return (
    <section 
      className="w-full sm:py-10 md:py-16"
      onMouseEnter={() => setActiveSection("trustedBy")}
      onMouseLeave={() => setActiveSection("default")}
    >
      <div className="mx-auto">

        {/* Marquee */}
        <div className="relative overflow-hidden">
          <Marquee pauseOnHover className="[--duration:40s]">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center mx-8 sm:mx-12 md:mx-16 h-24 sm:h-32 md:h-40 grayscale hover:grayscale-0 transition-all duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={200}
                  height={100}
                  className="object-contain max-h-full w-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
