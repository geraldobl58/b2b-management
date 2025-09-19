import api, { createApiWithToken } from "@/config/api";
import {
  ContractListResponse,
  CreateContractResponse,
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
};
