import api from "@/lib/api";
import { FormAuthValues } from "../schemas/auth";

export interface LoginResponse {
  access_token: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export const authentication = {
  async login(credentials: FormAuthValues): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>("/auth/profile");
    return response.data;
  },
};
