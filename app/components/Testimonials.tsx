"use client";

import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { poppins } from "../fonts";
import { useSection } from "../contexts/SectionContext";

type Testimonial = {
  id: number;
  quote: string;
  author: {
    name: string;
    age?: number;
    role: string;
    avatar?: string;
  };
  rating?: number;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "TalentBuzz helped me land my first major gig. The platform made it so easy to showcase my dance portfolio and connect with event organizers. Within a week, I had three bookings!",
    author: {
      name: "Mickael Grants",
      role: "CEO of Apples to Oranges",
    },
    rating: 5,
  },
  {
    id: 2,
    quote:
      "As a casting director, TalentBuzz has completely transformed how I discover new talent. The detailed profiles and performance history save me hours of research. Best investment I've made this year.",
    author: {
      name: "Sarah Martinez",
      role: "Professional Dancer",
    },
    rating: 5,
  },
  {
    id: 3,
    quote:
      "Building my career as a musician was always a challenge until TalentBuzz. Now opportunities are coming to me instead of me chasing them.",
    author: {
      name: "James Rodriguez",
      role: "Singer & Songwriter",
    },
    rating: 5,
  },
  {
    id: 4,
    quote:
      "I've booked more gigs in the past month through TalentBuzz than I did in the entire last year. The platform understands what performers need.",
    author: {
      name: "Emma Thompson",
      role: "Magician & Performer",
    },
    rating: 5,
  },
  {
    id: 5,
    quote:
      "The analytics and insights on TalentBuzz are incredible. It's like having a talent agent built into the platform.",
    author: {
      name: "David Park",
      role: "Actor & Voice Artist",
    },
    rating: 5,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  }),
};

export default function Testimonials() {
  const { setActiveSection } = useSection();
  return (
    <section 
      className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8  text-white"
      onMouseEnter={() => setActiveSection("testimonials")}
      onMouseLeave={() => setActiveSection("default")}
    >
      <div className="mx-auto ">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          custom={0}
        >
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-white/80 mb-4">
            Testimonials
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-semibold ${poppins.className}`}>
            Don&apos;t take our word for it.
            <br className="hidden sm:block" />
            Over 100+ people trust us.
          </h2>
        </motion.div>

        {/* Carousel */}
        <motion.div
          className="relative py-6 lg:py-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          custom={0.1}
        >
          {/* subtle side fade */}
          <div className="pointer-events-none absolute inset-0 flex">
            <div className="w-16 sm:w-24 lg:w-32 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="flex-1" />
            <div className="w-16 sm:w-24 lg:w-32 bg-gradient-to-l from-black via-black/70 to-transparent" />
          </div>

          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem
                  key={testimonial.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/2"
                >
                  <div className="h-full flex items-center">
                    <div className="relative w-full h-full rounded-[18px] border-[1px] border-white/15 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-8 lg:max-w-[520px] lg:min-h-[220px] mx-auto flex flex-col gap-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.7)]">
                      <p className={`text-sm sm:text-base leading-relaxed ${poppins.className}`}>
                        {testimonial.quote}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-white/30 via-white/15 to-white/5 flex items-center justify-center text-white/70 text-xs">
                            {testimonial.author.name.charAt(0)}
                          </div>
                          <div>
                            <p className={`text-base sm:text-lg font-semibold ${poppins.className}`}>
                              {testimonial.author.name}
                            </p>
                            <p className={`text-xs sm:text-sm text-white/60 ${poppins.className}`}>
                              {testimonial.author.role}
                            </p>
                          </div>
                        </div>
                        {testimonial.rating && (
                          <div className="flex items-center gap-1 text-amber-300">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <span key={i} className="text-lg">
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex justify-center items-center gap-3 mt-10">
              <CarouselPrevious className="static cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20 w-10 h-10" />
              <CarouselNext className="static cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20 w-10 h-10" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
