import { Metadata } from "next";
import HeroSection from "../components/about/HeroSection";
import AboutSection from "../components/about/AboutSection";
import ApproachSection from "../components/about/ApproachSection";
import TeamSection from "../components/about/TeamSection";
import TestimonialSection from "../components/about/TestimonialSection";
import { AboutApiResponse } from "../types/about";
import TrustedBy from "../components/TrustedBy";
import WorkTogether from "../components/WorkTogether";

async function getAboutData(): Promise<AboutApiResponse | null> {
  try {
    const apiUrl= process.env.BACKEND_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/about`);

    if (!response.ok) {
      console.error("Failed to fetch about data:", response.statusText);
      return null;
    }

    const data: AboutApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching about data:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutData();

  return {
    title: data?.data?.metaTitle || "About Us",
    description: data?.data?.metaDescription || "Learn more about us",
  };
}

export default async function AboutPage() {
  const data = await getAboutData();

  if (!data || !data.success) {
    return (
      <main>
        <section className="w-full py-16 sm:py-20 px-6 sm:px-8 md:px-10">
          <div className="max-w-7xl mx-auto text-center text-white">
            <p>Failed to load content. Please try again later.</p>
          </div>
        </section>
      </main>
    );
  }

  const { heroSection, aboutSection, approachSection, teamSection, testimonialSection } =
    data.data;

  return (
    <main>
      <HeroSection
        heroBadgeTitle={heroSection?.heroBadgeTitle}
        heroHeading={heroSection?.heroHeading}
        heroDescription={heroSection?.heroDescription}
        heroImgUrl={heroSection?.heroImgUrl}
      />
      <AboutSection
        aboutBadgeTitle={aboutSection?.aboutBadgeTitle}
        aboutHeading={aboutSection?.aboutHeading}
        aboutDescription={aboutSection?.aboutDescription}
        aboutStats={aboutSection?.aboutStats}
      />
      <ApproachSection
        approachBadgeTitle={approachSection?.approachBadgeTitle}
        approachHeading={approachSection?.approachHeading}
        approachDescription={approachSection?.approachDescription}
        approachCards={approachSection?.approachCards}
      />
      <TeamSection
        teamBadgeTitle={teamSection?.teamBadgeTitle}
        teamHeading={teamSection?.teamHeading}
        teamDescription={teamSection?.teamDescription}
        teamMemberCards={teamSection?.teamMemberCards}
      />
      <TestimonialSection
        testimonialBadgeTitle={testimonialSection?.testimonialBadgeTitle}
        testimonialHeading={testimonialSection?.testimonialHeading}
        testimonialCards={testimonialSection?.testimonialCards}
      />
      <TrustedBy/>
      <WorkTogether/>
    </main>
  );
}

