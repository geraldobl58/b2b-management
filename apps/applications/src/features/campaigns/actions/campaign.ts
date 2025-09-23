"use server";

import { cookies } from "next/headers";
import {
  CreateCampaignValues,
  UpdateCampaignValues,
  SearchCampaignValues,
} from "@/features/campaigns/schemas/campaign";
import { campaign } from "@/features/campaigns/http/campaign";
import { handleApiError, ApiResponse } from "@/config/error-handler";
import {
  Campaign,
  CampaignListResponse,
} from "@/features/campaigns/types/campaign";

async function getTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

export async function createCampaignAction(
  data: CreateCampaignValues
): Promise<ApiResponse<Campaign>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticaãoo n�o encontrado",
      };
    }

    const response = await campaign.createCampaign(data, token);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    console.error("Erro ao criar campanha:", error);
    return handleApiError(error);
  }
}

export async function getCampaignsAction(
  params?: SearchCampaignValues
): Promise<ApiResponse<CampaignListResponse>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticaãoo n�o encontrado",
      };
    }

    const campaignData = await campaign.getCampaigns(params, token);
    return {
      success: true,
      data: campaignData,
    };
  } catch (error: unknown) {
    console.error("Erro ao buscar campanhas:", error);
    return handleApiError(error);
  }
}

export async function getCampaignByIdAction(
  id: string
): Promise<ApiResponse<Campaign>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticação não eencontrado!",
      };
    }

    const campaignData = await campaign.getCampaignById(id, token);
    return {
      success: true,
      data: campaignData,
    };
  } catch (error: unknown) {
    console.error("Erro ao buscar campanha:", error);
    return handleApiError(error);
  }
}

export async function updateCampaignAction(
  id: string,
  data: UpdateCampaignValues
): Promise<ApiResponse<Campaign>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autednticação não encontrado",
      };
    }

    const response = await campaign.updateCampaign(id, data, token);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    console.error("Erro ao atualizar campanha:", error);
    return handleApiError(error);
  }
}

export async function deleteCampaignAction(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticação não encontrado",
      };
    }

    const response = await campaign.deleteCampaign(id, token);
    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    console.error("Erro ao deletar campanha:", error);
    return handleApiError(error);
  }
}

export async function getCampaignsByClientAction(
  clientId: string,
  params?: Omit<SearchCampaignValues, "clientId">
): Promise<ApiResponse<CampaignListResponse>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticaãoo n�o encontrado",
      };
    }

    const campaignData = await campaign.getCampaignsByClient(
      clientId,
      params,
      token
    );
    return {
      success: true,
      data: campaignData,
    };
  } catch (error: unknown) {
    console.error("Erro ao buscar campanhas do cliente:", error);
    return handleApiError(error);
  }
}

export async function duplicateCampaignAction(
  id: string,
  data: { name: string; startDate: string; endDate: string }
): Promise<ApiResponse<Campaign>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticação não encontrado",
      };
    }

    const response = await campaign.duplicateCampaign(id, data, token);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    console.error("Erro ao duplicar campanha:", error);
    return handleApiError(error);
  }
}

export async function activateCampaignAction(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticação não encontrado",
      };
    }

    const response = await campaign.activateCampaign(id, token);
    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    console.error("Erro ao ativar campanha:", error);
    return handleApiError(error);
  }
}

export async function deactivateCampaignAction(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticação não encontrado",
      };
    }

    const response = await campaign.deactivateCampaign(id, token);
    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    console.error("Erro ao desativar campanha:", error);
    return handleApiError(error);
  }
}

export async function getCampaignStatsAction(id: string): Promise<
  ApiResponse<{
    totalOrders: number;
    totalRevenue: number;
    conversionRate: number;
    averageOrderValue: number;
  }>
> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticação não encontrado",
      };
    }

    const stats = await campaign.getCampaignStats(id, token);
    return {
      success: true,
      data: stats,
    };
  } catch (error: unknown) {
    console.error("Erro ao buscar estatísticas da campanha:", error);
    return handleApiError(error);
  }
}

export async function exportCampaignDataAction(
  id: string,
  format: "csv" | "xlsx" | "pdf"
): Promise<ApiResponse<Blob>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticaãoo n�o encontrado",
      };
    }

    const blob = await campaign.exportCampaignData(id, format, token);
    return {
      success: true,
      data: blob,
    };
  } catch (error: unknown) {
    console.error("Erro ao exportar dados da campanha:", error);
    return handleApiError(error);
  }
}
