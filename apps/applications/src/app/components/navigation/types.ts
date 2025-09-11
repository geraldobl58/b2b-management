import { ReactNode } from "react";

export type Role = "OWNER" | "ADMIN" | "MANAGER" | "ANALYST" | "VIEWER";

export interface MenuItem {
  label: string;
  path?: string;
  icon: string;
  roles: Role[];
  items?: MenuItem[];
  featureFlag?: string;
}

