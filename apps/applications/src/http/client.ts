import api from "@/lib/api";
import { FormClientValues } from "@/schemas/client";
import {
  CreateClientRequest,
  CreateClientResponse,
  ClientListResponse,
  Client,
} from "@/types/client";

export const client = {
  async createClient(data: FormClientValues): Promise<CreateClientResponse> {
    const response = await api.post<CreateClientResponse>("/clients", data);
    return response.data;
  },

  async getClients(params?: {
    page?: number;
    limit?: number;
    companyName?: string;
    fantasyName?: string;
    cnpj?: string;
    taxpayerType?: string;
  }): Promise<ClientListResponse> {
    const response = await api.get<ClientListResponse>("/clients", { params });
    return response.data;
  },

  async getClientById(id: string): Promise<{ data: Client }> {
    const response = await api.get<{ data: Client }>(`/clients/${id}`);
    return response.data;
  },

  async updateClient(
    id: string,
    data: Partial<CreateClientRequest>
  ): Promise<{ data: Client }> {
    const response = await api.put<{ data: Client }>(`/clients/${id}`, data);
    return response.data;
  },

  async deleteClient(id: string): Promise<{ success: boolean }> {
    const response = await api.delete<{ success: boolean }>(`/clients/${id}`);
    return response.data;
  },
};
