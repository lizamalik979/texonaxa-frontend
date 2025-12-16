import { Metadata } from "next";
import { notFound } from "next/navigation";
import Hero from "../components/service/Hero";
import ServiceIntro from "../components/service/ServiceIntro";
import ServiceDetails from "../components/service/ServiceDetails";
import OurTechnologies from "../components/service/OurTechnologies";
import FAQ from "../components/service/FAQ";
import { ServiceApiResponse } from "../types/service";
import OurStory from "../components/OurStory";
import OurServices from "../components/OurServices";
import WorkTogether from "../components/WorkTogether";

async function getServiceData(slug: string): Promise<ServiceApiResponse | null> {
  try {
    const apiUrl = process.env.BACKEND_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/services/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.error(`Service with slug "${slug}" not found (404)`);
        return null;
      }
      console.error("Failed to fetch service data:", response.status, response.statusText);
      return null;
    }

    const jsonData = await response.json();
    
    // API returns { message: string, data: {...} }
    // Extract the data object from the response
    if (jsonData && typeof jsonData === 'object' && 'data' in jsonData) {
      return jsonData.data as ServiceApiResponse;
    }
    
    // Fallback: If API returns data directly (shouldn't happen based on your API structure)
    return jsonData as ServiceApiResponse;
  } catch (error) {
    console.error("Error fetching service data:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getServiceData(slug);

  if (!data) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found",
    };
  }

  return {
    title: data.metaTitle || `Service - ${slug}`,
    description: data.metaDescription || "Service details",
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getServiceData(slug);

  if (!data) {
    notFound();
  }

  return (
    <main>
      {data.heroSection && (
        <Hero
          heroheading={data.heroSection.heroheading}
          heroDescription={data.heroSection.heroDescription}
          heroImgUrl={data.heroSection.heroImgUrl}
        />
      )}
      <OurStory/>
      <OurServices/>
      {data.serviceIntroSection && (
        <ServiceIntro
          serviceHeading={data.serviceIntroSection.serviceHeading}
          serviceDescription={data.serviceIntroSection.serviceDescription}
        />
      )}
      {data.serviceDetailSection && (
        <ServiceDetails
          serviceDetailHeading={data.serviceDetailSection.serviceDetailHeading}
          serviceDetailDescription={data.serviceDetailSection.serviceDetailDescription}
          serviceCards={data.serviceDetailSection.serviceCards}
        />
      )}
      <OurTechnologies />
      {data.faqSection && (
        <FAQ
          faqHeading={data.faqSection.faqHeading}
          faqDescription={data.faqSection.faqDescription}
          faqQuestions={data.faqSection.faqQuestions}
        />
      )}
      <WorkTogether/>
      {/* Other sections will be added here as you provide Figma designs */}
    </main>
  );
}
