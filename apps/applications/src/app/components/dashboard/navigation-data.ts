import { createElement } from "react";
import { HomeIcon, MegaphoneIcon, ChartBarIcon, SettingsIcon } from "lucide-react";
import { MenuItem } from "../navigation/types";

export const primaryMenuItems: MenuItem[] = [
  { text: "Dashboard", icon: createElement(HomeIcon), href: "/dashboard" },
  { text: "Campanhas", icon: createElement(MegaphoneIcon), href: "/campaign" },
  { text: "Análises", icon: createElement(ChartBarIcon), href: "/analytics" },
  { text: "Configurações", icon: createElement(SettingsIcon), href: "/settings" },
];
