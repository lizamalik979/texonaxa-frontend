import { poppins } from "../../fonts";

interface ServiceIntroProps {
  serviceHeading?: string;
  serviceDescription?: string[];
}

export default function ServiceIntro({
  serviceHeading,
  serviceDescription,
}: ServiceIntroProps) {
  return (
    <section className="w-full py-16 sm:py-20 px-6 sm:px-8 md:px-10 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left Column - Heading */}
        <div className="text-white">
          {serviceHeading && (
            <h2
              className={`text-4xl sm:text-4xl md:text-5xl font-normal leading-tight ${poppins.className}`}
            >
              {serviceHeading}
            </h2>
          )}
        </div>

        {/* Right Column - Description Paragraphs */}
        <div className="flex flex-col gap-6 text-white">
          {serviceDescription && serviceDescription.length > 0 && (
            <>
              {serviceDescription.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-base sm:text-lg leading-relaxed ${poppins.className}`}
                >
                  {paragraph}
                </p>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
