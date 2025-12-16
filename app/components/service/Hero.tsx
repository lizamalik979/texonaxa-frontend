import Image from "next/image";
import { poppins } from "../../fonts";

interface HeroProps {
  heroheading?: string;
  heroDescription?: string;
  heroImgUrl?: string;
}

export default function Hero({
  heroheading,
  heroDescription,
  heroImgUrl,
}: HeroProps) {
  return (
    <section className="w-full py-16 sm:py-20 px-6 sm:px-8 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Text content - Left side */}
        <div className="flex flex-col gap-8 text-white order-2 lg:order-1">
          {/* Heading */}
          {heroheading && (
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight ${poppins.className}`}
            >
              {heroheading}
            </h1>
          )}

          {/* Description */}
          {heroDescription && (
            <p
              className={`text-lg sm:text-xl leading-relaxed text-white ${poppins.className}`}
            >
              {heroDescription}
            </p>
          )}

          {/* Call-to-Action Button */}
          <button
            className={`w-fit px-8 py-4 bg-[#FBEAAB] text-black rounded-lg text-lg font-semibold hover:bg-[#F5E19A] transition-colors ${poppins.className}`}
          >
            Start Project
          </button>
        </div>

        {/* Image - Right side */}
        <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden order-1 lg:order-2">
          {heroImgUrl ? (
            <Image
              src={heroImgUrl}
              alt={heroheading || "Service Hero"}
              width={800}
              height={600}
              className="w-full h-full object-cover rounded-3xl"
              priority
            />
          ) : (
            <div className="w-full h-full rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50" />
          )}
        </div>
      </div>
    </section>
  );
}
