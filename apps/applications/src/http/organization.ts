import api from "@/lib/api";
import axios from "axios";

export interface CreateOrganizationData {
  name: string;
  slug: string;
  domain: string;
  industry: string;
  companySize: string;
  timezone: string;
  billingEmail: string;
  plan: "BASIC" | "PRO" | "ENTERPRISE";
}

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

  async getById(organizationId: string) {
    const response = await api.get<OrganizationResponse>(`/organizations/${organizationId}`);
    return response.data;
  },

  async createWithToken(data: Partial<CreateOrganizationData>, token: string) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
    const response = await axios.post<OrganizationResponse>(
      `${baseURL}/organizations`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Delete para server-side com token explícito
  async deleteWithToken(organizationId: string, token: string) {
    await api.delete(`/organizations/${organizationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update para server-side com token explícito
  async updateWithToken(organizationId: string, data: Partial<CreateOrganizationData>, token: string) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
    const response = await axios.patch<OrganizationResponse>(
      `${baseURL}/organizations/${organizationId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
