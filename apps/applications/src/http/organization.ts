import api from "@/lib/api";

export interface OrganizationResponse {
  id: string;
  name: string;
  slug: string;
  domain: string;
  industry: string;
  companySize: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  billingEmail: string;
  plan: string;
  users: Users[];
  currentUserRole: "OWNER" | "ADMIN" | "MANAGER" | "ANALYST" | "VIEWER";
}

export interface Users {
  id: string;
  userId: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "ANALYST" | "VIEWER";
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export const organization = {
  async getAll() {
    const response = await api.get<OrganizationResponse[]>("/organizations");
    return response.data;
  },
};
