"use client";

import dynamic from "next/dynamic";
import HeroSection from "./components/HeroSection";
import LazyLoadSection from "./components/common/LazyLoadSection";

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
  return (
    <main>
      <HeroSection />
      <LazyLoadSection>
        <AboutUs />
      </LazyLoadSection>
      <LazyLoadSection>
        <Services />
      </LazyLoadSection>
      <LazyLoadSection>
        <OurServices />
      </LazyLoadSection>
      <LazyLoadSection>
        <DigitalGrowth />
      </LazyLoadSection>
      <LazyLoadSection>
        <OurStory />
      </LazyLoadSection>
      <LazyLoadSection>
        <TrustedBy />
      </LazyLoadSection>
      <LazyLoadSection>
        <Testimonials />
      </LazyLoadSection>
      <LazyLoadSection>
        <WorkTogether />
      </LazyLoadSection>
    </main>
  );
}
