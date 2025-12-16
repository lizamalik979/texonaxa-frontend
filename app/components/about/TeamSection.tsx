"use client";

import Image from "next/image";
import { poppins } from "../../fonts";

interface TeamMember {
  name?: string;
  designation?: string;
  imgUrl?: string;
}

interface TeamSectionProps {
  teamBadgeTitle?: string;
  teamHeading?: string;
  teamDescription?: string;
  teamMemberCards?: TeamMember[];
}

export default function TeamSection({
  teamBadgeTitle,
  teamHeading,
  teamDescription,
  teamMemberCards = [],
}: TeamSectionProps) {
  return (
    <section className="w-full py-16 sm:py-20 px-6 sm:px-8 md:px-10 text-white">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 sm:gap-10">
        {/* Badge */}
        {teamBadgeTitle && (
          <div className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-white/30 bg-transparent text-white text-sm font-medium">
            {teamBadgeTitle}
          </div>
        )}

        {/* Heading */}
        {teamHeading && (
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-semibold text-center ${poppins.className}`}
          >
            {teamHeading}
          </h2>
        )}

        {/* Description */}
        {teamDescription && (
          <p
            className={`max-w-5xl text-center text-base sm:text-lg md:text-xl leading-relaxed text-white/90 ${poppins.className}`}
          >
            {teamDescription}
          </p>
        )}

        {/* Team flex layout */}
        {teamMemberCards.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 w-full">
            {teamMemberCards.map((member, idx) => (
              <div
                key={`${member.name}-${idx}`}
                className="relative overflow-hidden rounded-[22px] bg-black w-full sm:w-[48%] lg:w-[30%]"
              >
                {member.imgUrl ? (
                  <Image
                    src={member.imgUrl}
                    alt={member.name || "Team member"}
                    width={480}
                    height={480}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full aspect-square bg-neutral-800" />
                )}

                {/* Bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Text */}
                <div className="absolute inset-x-0 bottom-0 px-5 sm:px-6 pb-5 sm:pb-6">
                  <p
                    className={`text-lg sm:text-xl font-semibold text-white ${poppins.className}`}
                  >
                    {member.name}
                  </p>
                  <p
                    className={`text-sm sm:text-base text-white/80 ${poppins.className}`}
                  >
                    {member.designation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

