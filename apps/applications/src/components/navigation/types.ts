export type Role = "ADMIN" | "BUSINESS" | "TEAM_MEMBER" | "VIEWER";

export interface MenuItem {
  label: string;
  path?: string;
  icon: string;
  roles: Role[];
  items?: MenuItem[];
  featureFlag?: string;
}
