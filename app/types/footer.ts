export interface SubSubChildMenu {
  title: string;
  url: string;
  sub_sub_child_menu: boolean;
}

export interface SubChildMenu {
  title: string;
  url: string;
  sub_child_menu: SubSubChildMenu[] | false;
  sub_sub_child_menu?: SubSubChildMenu[] | false | boolean;
}

export interface ChildMenu {
  title: string;
  url: string;
  sub_child_menu: SubChildMenu[] | false;
}

export interface MainMenu {
  title: string;
  url: string;
  child_menu: ChildMenu[] | false;
}

export interface ContactDetailSubChild {
  title: string;
  type: string;
  value: string;
  url: string;
  image: string;
}

export interface ContactDetail {
  title: string;
  url: string;
  image: string;
  sub_child: ContactDetailSubChild[] | false;
  type: string;
  value: string;
  has_sub_child?: boolean;
}

export interface FooterMenu {
  _id: string;
  main_menu: MainMenu[];
  contact_details: ContactDetail[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FooterMenuApiResponse {
  success: boolean;
  footerMenu: FooterMenu;
}

