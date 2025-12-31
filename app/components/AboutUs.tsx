"use client";

import { poppins } from "../fonts";
import { useSection } from "../contexts/SectionContext";

export default function AboutUs() {
  const { setActiveSection } = useSection();
  const text =
    "We walk the talk. What makes us different from others is our team of professionals whom we call ‘Digi Knights’. With the shield of experience and commitment in their respective field, they guard our brand’s marketing warfare and do troubleshooting when needed the most. On the forefront, whether it is our Founder, Co-founder or leaders in their specific fields of marketing, servicing, designing, writing and visualising everything is monitored under a fine magnifying glass of perfection. Whether it’s their direct involvement, precise feedbacks and suggestions in sync with trends or sharing a monthly report with clients its a teamwork. Clarity, reliability, and transparency are upheld at DigiStreet Media between employees, employers, and clients on all grounds and its in consonance with our approach.";

  return (
    <section 
      className="w-full py-16 sm:py-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32"
      onMouseEnter={() => setActiveSection("about")}
      onMouseLeave={() => setActiveSection("default")}
    >
      <div className="mx-auto max-w-[1920px] flex flex-col lg:flex-row gap-10 lg:gap-20 lg:items-center">
        {/* Image placeholder */}
        <div className="w-full max-w-[451px] mx-auto lg:mx-0 rounded-3xl overflow-hidden flex-shrink-0" style={{ aspectRatio: '1 / 1', width: '100%' }}>
          <div className="w-full h-full rounded-3xl bg-gradient-to-br from-yellow-400/70 via-pink-500/60 to-indigo-600/70" style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Text content */}
        <div className="flex flex-col gap-5 text-white">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-semibold ${poppins.className}`}>
            Who We Are?
          </h2>
          <div className={`space-y-4 text-base sm:text-xl leading-relaxed ${poppins.className}`}>
            <p>{text}</p>

          </div>
        </div>
      </div>
    </section>
  );
}
