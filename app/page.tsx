"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HeroSection from "./components/HeroSection";
import LazyLoadSection from "./components/common/LazyLoadSection";
import Loader from "./components/ui/loader";

// Lazy load components that are below the fold
const AboutUs = dynamic(() => import("./components/AboutUs"), {
  ssr: false,
});

const Services = dynamic(() => import("./components/Services"), {
  ssr: false,
});

const OurServices = dynamic(() => import("./components/OurServices"), {
  ssr: false,
});

const DigitalGrowth = dynamic(() => import("./components/DigitalGrowth"), {
  ssr: false,
});

const OurStory = dynamic(() => import("./components/OurStory"), {
  ssr: false,
});

const TrustedBy = dynamic(() => import("./components/TrustedBy"), {
  ssr: false,
});

const Testimonials = dynamic(() => import("./components/Testimonials"), {
  ssr: false,
});

const WorkTogether = dynamic(() => import("./components/WorkTogether"), {
  ssr: false,
});


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loader for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main>
      <HeroSection />
      <AboutUs />
      <div className="hidden md:block">
        <Services />
      </div>
      <OurServices />
      <DigitalGrowth />
      <OurStory />
      <TrustedBy />
      <Testimonials />
      <LazyLoadSection >
        <WorkTogether />
      </LazyLoadSection>
    </main>
  );
}
