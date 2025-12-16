export interface AboutApiResponse {
  success: boolean;
  data: {
    metaTitle: string;
    metaDescription: string;
    heroSection: {
      heroBadgeTitle: string;
      heroHeading: string;
      heroDescription: string;
      heroImgUrl: string;
    };
    aboutSection: {
      aboutBadgeTitle: string;
      aboutHeading: string;
      aboutDescription: string;
      aboutStats: {
        statTitle: string;
        statValue: number;
      }[];
    };
    approachSection: {
      approachBadgeTitle: string;
      approachHeading: string;
      approachDescription: string;
      approachCards: {
        cardTitle: string;
        cardDescription: string;
      }[];
    };
    teamSection: {
      teamBadgeTitle: string;
      teamHeading: string;
      teamDescription: string;
      teamMemberCards: {
        name: string;
        designation: string;
        imgUrl: string;
      }[];
    };
    testimonialSection: {
      testimonialBadgeTitle: string;
      testimonialHeading: string;
      testimonialCards: {
        authorName: string;
        authorRole: string;
        authorImgUrl: string;
        authorMessage: string;
        authorRating: number;
      }[];
    };
  };
}


