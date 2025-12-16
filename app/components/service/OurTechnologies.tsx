import Image from "next/image";
import { poppins } from "../../fonts";

const technologies = [
  { name: "Tailwind", image: "/images/tailwind.png" },
  { name: "HTML5", image: "/images/html.png" },
  { name: "JavaScript", image: "/images/js.png" },
  { name: "Python", image: "/images/python.png" },
  { name: "C#", image: "/images/csharp.png" },
  { name: "React", image: "/images/redIcon.png" },
];

export default function OurTechnologies() {
  return (
    <section className="w-full py-16 sm:py-20 px-6 sm:px-8 md:px-10 ">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2
          className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-6 ${poppins.className}`}
        >
          Our Technologies
        </h2>

        {/* Description */}
        <p
          className={`text-base sm:text-lg text-white text-center max-w-4xl mx-auto mb-12 leading-relaxed ${poppins.className}`}
        >
          The technologies we use are at the top of innovation and are shaping the
          future with advanced solutions. We are the one and only website
          development company using modern automation to enhance intelligent
          systems to boost efficiency, performance, and sustainability.
        </p>

        {/* Technology Icons */}
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-[rgba(54,54,54,0.6)] to-[rgba(0,0,0,0)] rounded-lg p-4 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.1)]"
            >
              <Image
                src={tech.image}
                alt={tech.name}
                width={60}
                height={60}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
