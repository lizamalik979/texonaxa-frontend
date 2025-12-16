"use client";

import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { poppins } from "../../fonts";

interface TestimonialCard {
  authorName?: string;
  authorRole?: string;
  authorImgUrl?: string;
  authorMessage?: string;
  authorRating?: number;
}

interface TestimonialSectionProps {
  testimonialBadgeTitle?: string;
  testimonialHeading?: string;
  testimonialCards?: TestimonialCard[];
}

export default function TestimonialSection({
  testimonialBadgeTitle,
  testimonialHeading,
  testimonialCards = [],
}: TestimonialSectionProps) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <section className="w-full py-16 sm:py-20 px-6 sm:px-8 md:px-10 text-white">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 sm:gap-10">
        {/* Badge */}
        {testimonialBadgeTitle && (
          <div className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-white/30 bg-transparent text-white text-sm font-medium">
            {testimonialBadgeTitle}
          </div>
        )}

        {/* Heading */}
        {testimonialHeading && (
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-semibold text-center leading-tight ${poppins.className}`}
          >
            {testimonialHeading}
          </h2>
        )}

        {/* Slider */}
        {testimonialCards.length > 0 ? (
          <div className="w-full max-w-4xl">
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              loop={testimonialCards.length > 1}
              onBeforeInit={(swiper) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                swiper.params.navigation.prevEl = prevRef.current;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              onSwiper={(swiper) => {
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              breakpoints={{
                768: { slidesPerView: 1.1, spaceBetween: 24 },
                1024: { slidesPerView: 1.5, spaceBetween: 28 },
              }}
            >
              {testimonialCards.map((card, index) => (
                <SwiperSlide key={`${card.authorName}-${index}`} className="pb-16">
                  <div className="h-full rounded-[24px] border border-white/10 bg-linear-to-r from-[#181818] via-[#111111] to-[#0b0b0b] px-6 sm:px-8 md:px-10 py-6  flex flex-col gap-8 shadow-[0_12px_50px_-24px_rgba(0,0,0,0.85)] relative overflow-hidden">
                    {/* Vignette edges */}
                    <div className="pointer-events-none absolute inset-0 flex">
                      <div className="w-14 sm:w-16 bg-linear-to-r from-black via-black/70 to-transparent" />
                      <div className="flex-1" />
                      <div className="w-14 sm:w-16 bg-linear-to-l from-black via-black/70 to-transparent" />
                    </div>

                    {/* Message */}
                    <p
                      className={`text-lg sm:text-xl leading-relaxed text-white/90 ${poppins.className}`}
                    >
                      {card.authorMessage}
                    </p>

                    <div className="flex items-center justify-between gap-4 relative z-10">
                      <div className="flex items-center gap-4">
                        {card.authorImgUrl ? (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden">
                            <Image
                              src={card.authorImgUrl}
                              alt={card.authorName || "Author"}
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10" />
                        )}
                        <div>
                          <p
                            className={`text-lg sm:text-xl font-semibold text-white ${poppins.className}`}
                          >
                            {card.authorName}
                          </p>
                          <p
                            className={`text-sm sm:text-base text-white/70 ${poppins.className}`}
                          >
                            {card.authorRole}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      {card.authorRating ? (
                        <div className="flex items-center gap-1 text-amber-200">
                          {Array.from({ length: Math.round(card.authorRating) }).map(
                            (_, i) => (
                              <span key={i} className="text-xl leading-none">
                                ★
                              </span>
                            )
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              {/* Navigation */}
              {testimonialCards.length > 1 && (
                <div className="flex justify-center items-center gap-4 mt-2 sm:mt-0">
                  <button
                    ref={prevRef}
                    aria-label="Previous testimonial"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-amber-200 text-black flex items-center justify-center shadow-md hover:opacity-90 transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    ref={nextRef}
                    aria-label="Next testimonial"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-amber-200 text-black flex items-center justify-center shadow-md hover:opacity-90 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </Swiper>
          </div>
        ) : null}
      </div>
    </section>
  );
}

