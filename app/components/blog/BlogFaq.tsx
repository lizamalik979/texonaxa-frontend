"use client";

import { useState } from 'react';
import { Poppins } from 'next/font/google';
import { ChevronDown } from 'lucide-react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ["300", "400", "500", "600", "700"],
});

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogFaqProps {
  faqItems: FAQItem[];
}

export default function BlogFaq({ faqItems }: BlogFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqItems || !Array.isArray(faqItems) || faqItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-white/10 pt-8">
      <h2 className={`text-3xl font-bold text-white mb-6 ${poppins.className}`}>
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {faqItems.map((faq, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-lg overflow-hidden border border-white/10 transition-all duration-200 hover:bg-white/10"
          >
            {/* Question Button */}
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full cursor-pointer text-left py-4 px-6 flex items-center justify-between group"
              aria-expanded={openIndex === index}
            >
              {faq.question && (
                <h3
                  className={`text-xl font-semibold text-white pr-4 flex-1 ${poppins.className}`}
                >
                  {faq.question}
                </h3>
              )}
              <ChevronDown
                className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180 text-[#FEE39A]' : ''
                }`}
              />
            </button>

            {/* Answer - Collapsible */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {faq.answer && (
                <div className="px-6 pb-4 pt-0">
                  <div
                    className={`text-gray-300 leading-relaxed whitespace-pre-line ${poppins.className}`}
                  >
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

