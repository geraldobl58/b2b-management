import api, { createApiWithToken } from "@/config/api";
import {
  CreateCampaignValues,
  SearchCampaignValues,
} from "@/features/campaigns/schemas/campaign";
import {
  Campaign,
  CampaignListResponse,
} from "@/features/campaigns/types/campaign";

const getApiInstance = (token?: string) => {
  if (token) {
    return createApiWithToken(token);
  }
  return api;
};

interface CreateCampaignResponse {
  data: Campaign;
  message: string;
}

export const campaign = {
  async createCampaign(
    data: CreateCampaignValues,
    token?: string
  ): Promise<CreateCampaignResponse> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.post<CreateCampaignResponse>(
      "/campaigns",
      data
    );
    return response.data;
  },

  async getCampaigns(
    params?: SearchCampaignValues,
    token?: string
  ): Promise<CampaignListResponse> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.get<CampaignListResponse>("/campaigns", {
      params,
    });
    return response.data;
  },

  async getCampaignById(id: string, token?: string): Promise<Campaign> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.get<Campaign>(`/campaigns/${id}`);
    return response.data;
  },

  async getCampaignsByClient(
    clientId: string,
    params?: Omit<SearchCampaignValues, "clientId">,
    token?: string
  ): Promise<CampaignListResponse> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.get<CampaignListResponse>(
      `/clients/${clientId}/campaigns`,
      { params }
    );
    return response.data;
  },

  async activateCampaign(
    id: string,
    token?: string
  ): Promise<{ success: boolean; message: string }> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.patch<{
      success: boolean;
      message: string;
    }>(`/campaigns/${id}/activate`);
    return response.data;
  },

  async deactivateCampaign(
    id: string,
    token?: string
  ): Promise<{ success: boolean; message: string }> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.patch<{
      success: boolean;
      message: string;
    }>(`/campaigns/${id}/deactivate`);
    return response.data;
  },

  async getCampaignStats(
    id: string,
    token?: string
  ): Promise<{
    totalOrders: number;
    totalRevenue: number;
    conversionRate: number;
    averageOrderValue: number;
  }> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.get(`/campaigns/${id}/stats`);
    return response.data;
  },

  async exportCampaignData(
    id: string,
    format: "csv" | "xlsx" | "pdf",
    token?: string
  ): Promise<Blob> {
    const apiInstance = getApiInstance(token);
    const response = await apiInstance.get(`/campaigns/${id}/export`, {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  },
};
