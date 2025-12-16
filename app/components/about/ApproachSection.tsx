// "use client";

// import "swiper/css";
// import "swiper/css/pagination";

// import { useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination } from "swiper/modules";
// import { poppins } from "../../fonts";

// interface ApproachCard {
//   cardTitle?: string;
//   cardDescription?: string;
// }

// interface ApproachSectionProps {
//   approachBadgeTitle?: string;
//   approachHeading?: string;
//   approachDescription?: string;
//   approachCards?: ApproachCard[];
// }

// export default function ApproachSection({
//   approachBadgeTitle,
//   approachHeading,
//   approachDescription,
//   approachCards = [],
// }: ApproachSectionProps) {
//   const paginationRef = useRef<HTMLDivElement | null>(null);
//   return (
//     <section className="w-full py-16 sm:py-20 px-6 sm:px-8 md:px-10  text-white">
//       <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 sm:gap-10">
//         {/* Badge */}
//         {approachBadgeTitle && (
//           <div className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-white/30 bg-transparent text-white text-sm font-medium">
//             {approachBadgeTitle}
//           </div>
//         )}

//         {/* Heading */}
//         {approachHeading && (
//           <h2
//             className={`text-3xl sm:text-4xl md:text-5xl font-semibold text-center ${poppins.className}`}
//           >
//             {approachHeading}
//           </h2>
//         )}

//         {/* Description */}
//         {approachDescription && (
//           <p
//             className={`max-w-4xl text-center text-base sm:text-lg md:text-xl leading-relaxed text-white/90 ${poppins.className}`}
//           >
//             {approachDescription}
//           </p>
//         )}

//         {/* Carousel */}
//         {approachCards.length > 0 ? (
//           <div className="w-full">
//             <Swiper
//               modules={[Pagination]}
//               spaceBetween={16}
//               slidesPerView={1}
//               loop={approachCards.length > 1}
//               onSwiper={(swiper) => {
//                 if (!paginationRef.current) return;
//                 const basePagination =
//                   typeof swiper.params.pagination === "object" &&
//                   swiper.params.pagination !== null
//                     ? swiper.params.pagination
//                     : {};

//                 swiper.params.pagination = {
//                   ...basePagination,
//                   el: paginationRef.current,
//                   clickable: true,
//                   bulletClass:
//                     "swiper-pagination-bullet w-2.5 h-2.5 rounded-full bg-white/30 opacity-100 transition-colors",
//                   bulletActiveClass:
//                     "swiper-pagination-bullet-active bg-amber-200 opacity-100",
//                 };
//                 swiper.pagination.destroy();
//                 swiper.pagination.init();
//                 swiper.pagination.render();
//                 swiper.pagination.update();
//               }}
//               breakpoints={{
//                 640: { slidesPerView: 1.5, spaceBetween: 20 },
//                 768: { slidesPerView: 2, spaceBetween: 24 },
//                 1024: { slidesPerView: 3, spaceBetween: 24 },
//               }}
//             >
//               {approachCards.map((card, index) => (
//                 <SwiperSlide key={`${card.cardTitle}-${index}`} className="pb-8">
//                   <div className="h-full rounded-[28px] bg-linear-to-b from-[#1a1a1d] to-[#0f0f11] border border-white/10 px-6 sm:px-7 md:px-8 py-8 sm:py-10 flex flex-col gap-4 relative overflow-hidden">
//                     {/* Watermark number */}
//                     <span className="absolute right-6 top-4 text-6xl sm:text-7xl md:text-8xl font-black text-white/5">
//                       {String(index + 1).padStart(2, "0")}
//                     </span>

//                     <h3
//                       className={`text-2xl sm:text-2xl md:text-3xl font-semibold leading-tight ${poppins.className}`}
//                     >
//                       {card.cardTitle}
//                     </h3>
//                     <p
//                       className={`text-base sm:text-lg leading-relaxed text-white/85 ${poppins.className}`}
//                     >
//                       {card.cardDescription}
//                     </p>
//                   </div>
//                 </SwiperSlide>
//               ))}

//               <div className="flex justify-center items-center mt-6">
//                 <div
//                   ref={paginationRef}
//                   className="approach-swiper-pagination swiper-pagination static! w-auto! flex gap-2"
//                 />
//               </div>
//             </Swiper>
//           </div>
//         ) : null}
//       </div>
//     </section>
//   );
// }


"use client";

import "swiper/css";
import "swiper/css/pagination";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { poppins } from "../../fonts";

interface ApproachCard {
  cardTitle?: string;
  cardDescription?: string;
}

interface ApproachSectionProps {
  approachBadgeTitle?: string;
  approachHeading?: string;
  approachDescription?: string;
  approachCards?: ApproachCard[];
}

export default function ApproachSection({
  approachBadgeTitle,
  approachHeading,
  approachDescription,
  approachCards = [],
}: ApproachSectionProps) {
  return (
    <section className="w-full pt-16 sm:py-20 px-6 sm:px-8 md:px-10 text-white">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 sm:gap-10">
        {/* Badge */}
        {approachBadgeTitle && (
          <div className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-white/30 bg-transparent text-white text-sm font-medium">
            {approachBadgeTitle}
          </div>
        )}

        {/* Heading */}
        {approachHeading && (
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-semibold text-center ${poppins.className}`}
          >
            {approachHeading}
          </h2>
        )}

        {/* Description */}
        {approachDescription && (
          <p
            className={`max-w-4xl text-center text-base sm:text-lg md:text-xl leading-relaxed text-white/90 ${poppins.className}`}
          >
            {approachDescription}
          </p>
        )}

        {/* Carousel */}
        {approachCards.length > 0 && (
          <div className="w-full">
            <Swiper
            className="items-stretch"
              modules={[Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              loop={approachCards.length > 1}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 1.5, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
            >
              {approachCards.map((card, index) => (
                <SwiperSlide key={`${card.cardTitle}-${index}`} className="pb-8 h-auto flex">
                  <div className="h-full rounded-[28px] bg-linear-to-b from-[#1a1a1d] to-[#0f0f11] border border-white/10 px-6 sm:px-7 md:px-8 py-8 sm:py-10 flex flex-col gap-4 relative overflow-hidden">
                    {/* Watermark number */}
                    <span className="absolute right-6 top-4 text-6xl sm:text-7xl md:text-8xl font-black text-white/5">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3
                      className={`text-2xl sm:text-2xl md:text-3xl font-semibold leading-tight ${poppins.className}`}
                    >
                      {card.cardTitle}
                    </h3>
                    <p
                      className={`text-base sm:text-lg leading-relaxed text-white/85 ${poppins.className}`}
                    >
                      {card.cardDescription}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}
