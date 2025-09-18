import api, { createApiWithToken } from "@/config/api";
import { ContractListResponse } from "../types/contract";

const getApiInstance = (token?: string) => {
  if (token) {
    return createApiWithToken(token);
  }
  return api;
};

export const contract = {
  async getContracts(
    params?: {
      page?: number;
      limit?: number;
      name?: string;
      partner?: string;
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
