"use client";

import Link from "next/link";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import ThreeD from "../ThreeD";
import { poppins } from "../../fonts";

export default function Footer() {
  return (
    <footer className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 md:gap-x-8 lg:gap-x-10 gap-y-6 md:gap-y-8">


          {/* SEO Section */}
          <div className="flex flex-col gap-4 md:col-span-1 lg:col-span-1">
            <h3 className={`text-center sm:text-left text-neutral-400 text-xl font-medium leading-tight ${poppins.className}`}>
              SEO
            </h3>
            <div className="flex flex-col gap-3">
              <p className={`text-center sm:text-left text-white text-lg font-medium leading-relaxed ${poppins.className}`}>
                Search Engine<br />Optimization
              </p>
              <p className={`text-center sm:text-left text-white text-lg font-medium leading-relaxed ${poppins.className}`}>
                Social Media<br />Optimization
              </p>
              <p className={`text-center sm:text-left text-white text-lg font-medium leading-relaxed ${poppins.className}`}>
                Answer Engine<br />Optimization
              </p>
              <p className={`text-center sm:text-left text-white text-lg font-medium leading-relaxed ${poppins.className}`}>
                Generative Engine<br />Optimization
              </p>
              <p className={`text-center sm:text-left text-white text-lg font-medium leading-relaxed ${poppins.className}`}>
                Paper Per Click
              </p>
            </div>
          </div>

          {/* Design Section */}
          <div className="flex flex-col gap-4">
            <h3 className={`text-center sm:text-left text-neutral-400 text-xl font-medium leading-tight ${poppins.className}`}>
              Design
            </h3>
            <div className="flex flex-col gap-3">
              <p className={`text-center sm:text-left text-white text-lg font-medium leading-relaxed ${poppins.className}`}>
                UX/UI
              </p>
              <p className={`text-center sm:text-left text-white text-lg font-medium leading-relaxed ${poppins.className}`}>
                Branding
              </p>
            </div>
          </div>

          {/* Development Section */}
          <div className="flex flex-col gap-4">
            <h3 className={`text-center sm:text-left text-neutral-400 text-xl font-medium leading-tight ${poppins.className}`}>
              Development
            </h3>
            <div className="flex flex-col gap-3">
              <p className={`text-center sm:text-left text-white text-lg font-medium leading-relaxed ${poppins.className}`}>
                E-Commerce Development
              </p>
              <p className={`text-center sm:text-left text-white text-lg font-medium leading-relaxed ${poppins.className}`}>
                Website Development
              </p>
            </div>
          </div>

          {/* Marketing Section */}
          <div className="flex flex-col gap-4">
            <h3 className={`text-center sm:text-left text-neutral-400 text-xl font-medium leading-tight ${poppins.className}`}>
              Marketing
            </h3>
            <div className="flex flex-col gap-3">
              <p className={`text-center sm:text-left text-white text-lg font-medium leading-relaxed ${poppins.className}`}>
                Content Marketing
              </p>
              <p className={`text-center sm:text-left text-white text-lg font-medium leading-relaxed ${poppins.className}`}>
                Social Media Marketing
              </p>
            </div>
          </div>

          {/* Contact Us Section */}
          <div className="flex flex-col gap-4">
            <h3 className={`text-center sm:text-left text-neutral-400 text-xl font-medium leading-tight ${poppins.className}`}>
              Contact Us
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className={`text-center sm:text-left text-white text-lg font-medium leading-relaxed ${poppins.className}`}>
                8209571074
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className={`text-center sm:text-left text-neutral-400 text-xl font-medium leading-tight ${poppins.className}`}>
                  Email ID
                </h4>
                <p className={`text-center sm:text-left text-white text-lg font-medium leading-relaxed ${poppins.className}`}>
                info@texonaxa.com
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className={`text-center sm:text-left text-neutral-400 text-xl font-medium leading-tight ${poppins.className}`}>
                  Follow us
                </h4>
                <Link 
                  href="https://www.instagram.com/texonaxa/?igsh=MTMxdjh5bTEzemFpcA%3D%3D&utm_source=qr#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center sm:text-left inline-flex items-center gap-2 text-white hover:text-amber-200 transition-colors duration-300"
                >
                  <Instagram className="w-6 h-6" />
                  <span className={`text-lg font-medium leading-relaxed ${poppins.className}`}>
                    Instagram
                  </span>
                </Link>
                <Link 
                  href="https://www.linkedin.com/company/texonaxa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center sm:text-left inline-flex items-center gap-2 text-white hover:text-amber-200 transition-colors duration-300"
                >
                  <Linkedin className="w-6 h-6" />
                  <span className={`text-lg font-medium leading-relaxed ${poppins.className}`}>
                    Linkedin
                  </span>
                </Link>
                <Link 
                  href="https://www.facebook.com/texonaxa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center sm:text-left inline-flex items-center gap-2 text-white hover:text-amber-200 transition-colors duration-300"
                >
                  <Facebook className="w-6 h-6" />
                  <span className={`text-lg font-medium leading-relaxed ${poppins.className}`}>
                    Facebook
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <ThreeD />
      </div>
    </footer>
  );
}
