import api, { createApiWithToken } from "@/lib/api";
import { FormClientValues } from "@/schemas/client";
import {
  CreateClientResponse,
  ClientListResponse,
  Client,
} from "@/types/client";

// Função para obter a instância da API correta baseada no token
const getApiInstance = (token?: string) => {
  if (token) {
    return createApiWithToken(token);
  }
  return api; // Usa a instância padrão com interceptor para client-side
};

export const client = {
  async createClient(
    data: FormClientValues,
    token?: string
  ): Promise<CreateClientResponse> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.post<CreateClientResponse>(
      "/clients",
      data
    );
    return response.data;
  },

  async getClients(
    params?: {
      page?: number;
      limit?: number;
      companyName?: string;
      fantasyName?: string;
      cnpj?: string;
      taxpayerType?: string;
    },
    token?: string
  ): Promise<ClientListResponse> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.get<ClientListResponse>("/clients", {
      params,
    });
    return response.data;
  },

  async getClientById(id: string, token?: string) {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.get<Client>(`/clients/${id}`);
    return response.data;
  },

  async updateClient(
    id: string,
    data: FormClientValues,
    token?: string
  ): Promise<{ data: Client }> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.patch<{ data: Client }>(
      `/clients/${id}`,
      data
    );
    return response.data;
  },

  async deleteClient(
    id: string,
    token?: string
  ): Promise<{ success: boolean }> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.delete<{ success: boolean }>(
      `/clients/${id}`
    );
    return response.data;
  },
};
