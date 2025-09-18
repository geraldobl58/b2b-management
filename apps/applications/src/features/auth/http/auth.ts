import api from "@/config/api";
import { FormAuthValues } from "../schemas/auth";
import { User } from "../types/auth";

export interface LoginResponse {
  access_token: string;
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
