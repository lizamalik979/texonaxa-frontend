import { poppins } from "../../fonts";

interface ServiceDetailsProps {
  serviceDetailHeading?: string;
  serviceDetailDescription?: string;
  serviceCards?: {
    serviceCardTitle: string;
    serviceCardDescription: string;
  }[];
}

export default function ServiceDetails({
  serviceDetailHeading,
  serviceDetailDescription,
  serviceCards,
}: ServiceDetailsProps) {
  return (
    <section className="w-full py-16 sm:py-20 px-6 sm:px-8 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        {serviceDetailHeading && (
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-semibold text-white text-center mb-6 ${poppins.className}`}
          >
            {serviceDetailHeading}
          </h2>
        )}

        {/* Description */}
        {serviceDetailDescription && (
          <p
            className={`text-base sm:text-lg text-white text-center max-w-4xl mx-auto mb-12 leading-relaxed ${poppins.className}`}
          >
            {serviceDetailDescription}
          </p>
        )}

        {/* Service Cards Grid */}
        {serviceCards && serviceCards.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            {serviceCards.map((card, index) => (
              <div
                key={index}
                className=" bg-gradient-to-b from-[rgba(19,19,19,0.9)] to-[rgba(19,18,18,0.45)] rounded-lg p-6  transition-colors w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md"
              >
                {card.serviceCardTitle && (
                  <h3
                    className={`text-xl font-semibold text-white mb-4 ${poppins.className}`}
                  >
                    {card.serviceCardTitle}
                  </h3>
                )}
                {card.serviceCardDescription && (
                  <p
                    className={`text-base text-white/90 leading-relaxed ${poppins.className}`}
                  >
                    {card.serviceCardDescription}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
