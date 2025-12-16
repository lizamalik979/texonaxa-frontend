import Image from "next/image";
import { poppins } from "../../fonts";

interface HeroSectionProps {
  heroBadgeTitle?: string;
  heroHeading?: string;
  heroDescription?: string;
  heroImgUrl?: string;
}

export default function HeroSection({
  heroBadgeTitle,
  heroHeading,
  heroDescription,
  heroImgUrl,
}: HeroSectionProps) {
  return (
    <section className="w-full py-16 sm:py-20 px-6 sm:px-8 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Text content - Left side */}
        <div className="flex flex-col gap-5 text-white order-2 lg:order-1">
          {/* Badge Button */}
          {heroBadgeTitle && (
            <button className="w-fit px-4 py-2  text-white rounded-full border border-white/30 bg-transparent text-sm font-medium hover:bg-gray-50 transition-colors">
              {heroBadgeTitle}
            </button>
          )}

          {/* Heading */}
          {heroHeading && (
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight ${poppins.className}`}>
              {heroHeading}
            </h1>
          )}

          {/* Description */}
          {heroDescription && (
            <div className={`space-y-4 text-base sm:text-lg leading-relaxed text-white/90 ${poppins.className}`}>
              <p>{heroDescription}</p>
            </div>
          )}
        </div>

        {/* Image - Right side */}
        <div className="w-full h-[340px] sm:h-[450px] rounded-3xl overflow-hidden order-1 lg:order-2">
          {heroImgUrl ? (
            <Image
              src={heroImgUrl}
              alt={heroHeading || "Team"}
              width={800}
              height={600}
              className="w-full h-full object-cover rounded-3xl"
            />
          ) : (
            <div className="w-full h-full rounded-3xl bg-gradient-to-br from-gray-700/50 to-gray-800/50" />
          )}
        </div>
      </div>
    </section>
  );
}

