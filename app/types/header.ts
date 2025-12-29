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

export interface HeaderMenu {
  _id: string;
  main_menu: MainMenu[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface HeaderMenuApiResponse {
  success: boolean;
  headerMenu: HeaderMenu;
}

