import api, { createApiWithToken } from "@/config/api";
import {
  ContractListResponse,
  CreateContractResponse,
  ContractWithRelations,
} from "../types/contract";
import { FormContractValues } from "../schemas/contract";

const getApiInstance = (token?: string) => {
  if (token) {
    return createApiWithToken(token);
  }
  return api;
};

export const contract = {
  async createContract(
    data: FormContractValues,
    token?: string
  ): Promise<CreateContractResponse> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.post<CreateContractResponse>(
      "/contracts",
      data
    );
    return response.data;
  },

  async updateContract(
    id: string,
    data: FormContractValues,
    token?: string
  ): Promise<CreateContractResponse> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.patch<CreateContractResponse>(
      `/contracts/${id}`,
      data
    );
    return response.data;
  },

  async deleteContract(id: string, token?: string): Promise<void> {
    const apiInstance = getApiInstance(token);
    await apiInstance.delete(`/contracts/${id}`);
  },

  async getContracts(
    params?: {
      page?: number;
      limit?: number;
      name?: string;
      partner?: string;
      clientName?: string;
      startDate?: string;
      endDate?: string;
    },
    token?: string
  ): Promise<ContractListResponse> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.get<ContractListResponse>("/contracts", {
      params,
    });
    return response.data;
  },

  async getContractById(
    id: string,
    token?: string
  ): Promise<ContractWithRelations> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.get<ContractWithRelations>(
      `/contracts/${id}`
    );
    return response.data;
  },
};
