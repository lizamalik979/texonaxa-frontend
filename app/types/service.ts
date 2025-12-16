export interface ServiceApiResponse {
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  heroSection?: {
    heroheading: string;
    heroDescription: string;
    heroImgUrl: string;
  };
  serviceIntroSection?: {
    serviceHeading: string;
    serviceDescription: string[];
  };
  serviceDetailSection?: {
    serviceDetailHeading: string;
    serviceDetailDescription: string;
    serviceCards: {
      serviceCardTitle: string;
      serviceCardDescription: string;
    }[];
  };
  faqSection?: {
    faqHeading: string;
    faqDescription: string;
    faqQuestions: {
      question: string;
      answer: string;
    }[];
  };
}
