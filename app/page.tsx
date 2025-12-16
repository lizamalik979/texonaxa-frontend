import dynamic from "next/dynamic";
import HeroSection from "./components/HeroSection";

// Lazy load components that are below the fold
const AboutUs = dynamic(() => import("./components/AboutUs"), {
  loading: () => <div className="min-h-screen" />,
});

const Services = dynamic(() => import("./components/Services"), {
  loading: () => <div className="min-h-screen" />,
});

const OurServices = dynamic(() => import("./components/OurServices"), {
  loading: () => <div className="min-h-screen" />,
});

const DigitalGrowth = dynamic(() => import("./components/DigitalGrowth"), {
  loading: () => <div className="min-h-screen" />,
});

const OurStory = dynamic(() => import("./components/OurStory"), {
  loading: () => <div className="min-h-screen" />,
});

const TrustedBy = dynamic(() => import("./components/TrustedBy"), {
  loading: () => <div className="min-h-screen" />,
});

const Testimonials = dynamic(() => import("./components/Testimonials"), {
  loading: () => <div className="min-h-screen" />,
});

const WorkTogether = dynamic(() => import("./components/WorkTogether"), {
  loading: () => <div className="min-h-screen" />,
});

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutUs />
      <Services />
      <OurServices />
      <DigitalGrowth />
      <OurStory />
      <TrustedBy />
      <Testimonials />
      <WorkTogether />
    </main>
  );
}
