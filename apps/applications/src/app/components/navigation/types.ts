import { ReactNode } from "react";

export interface MenuItem {
  text: string;
  icon: ReactNode;
  href?: string;
}

export interface NavigationConfig {
  items: MenuItem[];
  logo?: ReactNode;
}