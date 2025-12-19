import { Check } from "lucide-react";
import { poppins } from "../../fonts";

interface WhyInvestProps {
  sectionHeading?: string;
  sectionDescription?: string;
  sectionCards?: {
    cardHeading: string;
    cardDescription: string;
  }[];
}

export default function WhyInvest({
  sectionHeading,
  sectionDescription,
  sectionCards,
}: WhyInvestProps) {
  return (
    <section className="w-full py-16 sm:py-20 px-6 sm:px-8 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left text block */}
        <div>
          {sectionHeading && (
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight ${poppins.className}`}
            >
              {sectionHeading}
            </h2>
          )}
          {sectionDescription && (
            <p
              className={`mt-4 text-sm sm:text-base md:text-lg text-white/70 leading-relaxed max-w-xl ${poppins.className}`}
            >
              {sectionDescription}
            </p>
          )}
        </div>

        {/* Right cards grid */}
        {sectionCards && sectionCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sectionCards.map((card, idx) => (
              <div
                key={idx}
                className="rounded-xl px-6 py-5 bg-gradient-to-b from-[rgba(19,19,19,0.9)] to-[rgba(19,18,18,0.45)]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 rounded-full bg-[#FBEAAB] flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 text-black" />
                  </div>
                  <div>
                    <h3 className={`text-base sm:text-lg font-semibold text-white ${poppins.className}`}>
                      {card.cardHeading}
                    </h3>
                    <p
                      className={`mt-1 text-xs sm:text-sm text-white/65 leading-relaxed ${poppins.className}`}
                    >
                      {card.cardDescription}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

