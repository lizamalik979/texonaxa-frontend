import { Check } from "lucide-react";
import { poppins } from "../../fonts";

interface WhyChooseProps {
  sectionHeading?: string;
  sectionDescription?: string;
  sectionCards?: {
    cardHeading: string;
    cardDescription: string;
  }[];
}

export default function WhyChoose({
  sectionHeading,
  sectionDescription,
  sectionCards,
}: WhyChooseProps) {
  return (
    <section className="w-full py-16 sm:py-20 px-6 sm:px-8 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {sectionHeading && (
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-semibold text-white ${poppins.className}`}
            >
              {sectionHeading}
            </h2>
          )}
          {sectionDescription && (
            <p
              className={`mt-4 text-sm sm:text-base md:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed ${poppins.className}`}
            >
              {sectionDescription}
            </p>
          )}
        </div>

        {sectionCards && sectionCards.length > 0 && (
          <div className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-6">
            {sectionCards.map((card, idx) => (
              <div
                key={idx}
                className="rounded-xl px-6 py-5 bg-gradient-to-b from-[rgba(19,19,19,0.9)] to-[rgba(19,18,18,0.45)] w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md"
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

