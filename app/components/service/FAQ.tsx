"use client";

import { useState } from "react";
import { poppins } from "../../fonts";

interface FAQProps {
  faqHeading?: string;
  faqDescription?: string;
  faqQuestions?: {
    question: string;
    answer: string;
  }[];
}

export default function FAQ({
  faqHeading,
  faqDescription,
  faqQuestions,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-16 sm:py-20 px-6 sm:px-8 md:px-10">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        {faqHeading && (
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-semibold text-white text-center mb-6 ${poppins.className}`}
          >
            {faqHeading}
          </h2>
        )}

        {/* Description */}
        {faqDescription && (
          <p
            className={`text-base sm:text-lg text-white text-center mb-12 leading-relaxed ${poppins.className}`}
          >
            {faqDescription}
          </p>
        )}

        {/* FAQ Items */}
        {faqQuestions && faqQuestions.length > 0 && (
          <div className="space-y-0">
            {faqQuestions.map((item, index) => (
              <div key={index}>
                {/* Question */}
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full text-left py-6 flex items-center justify-between group"
                >
                  <h3
                    className={`text-lg sm:text-xl font-medium text-white pr-8 ${poppins.className}`}
                  >
                    {item.question}
                  </h3>
                  <span
                    className={`text-white text-2xl transition-transform duration-300 shrink-0 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                {/* Separator */}
                <div className="h-px bg-gray-700 w-full" />

                {/* Answer */}
                {openIndex === index && (
                  <div className="py-6">
                    <p
                      className={`text-base sm:text-lg text-white/90 leading-relaxed ${poppins.className}`}
                    >
                      {item.answer}
                    </p>
                  </div>
                )}

                {/* Separator after answer if expanded */}
                {openIndex === index && (
                  <div className="h-px bg-gray-700 w-full" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
