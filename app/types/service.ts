export interface ServiceApiResponse {
  slug: string;
  pageType?: string;
  metaTitle?: string;
  metaDescription?: string;
  heroSection?: {
    heroheading: string;
    heroDescription: string;
    heroImgUrl: string;
  };
  ourServicesSection: {
    serviceHeading: string;
    serviceDescription: string;
    serviceCards: {
      cardHeading: string;
      cardImg: string;
      cardUrl: string;
    }[];
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
  whyChooseSection: {
    sectionHeading: string;
    sectionDescription: string;
    sectionCards: {
      cardHeading: string;
      cardDescription: string;
    }[];
  };
  whyInvestSection: {
    sectionHeading: string;
    sectionDescription: string;
    sectionCards: {
      cardHeading: string;
      cardDescription: string;
    }[];
  };
  technologySection?: {
    heading: string;
    description: string;
    technologyImages: string[];
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



