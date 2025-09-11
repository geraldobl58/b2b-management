import { createElement, ReactNode } from "react";
import { HomeIcon } from "lucide-react";

export interface MenuItem {
  text: string;
  icon: ReactNode;
  href?: string;
}

export const primaryMenuItems: MenuItem[] = [
  { text: "Dashboard", icon: createElement(HomeIcon), href: "/dashboard" },
];
