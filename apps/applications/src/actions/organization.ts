"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { organization } from "@/http/organization";
import { OrganizationFormValues } from "@/schemas/organization";

export interface OrganizationResult {
  success: boolean;
  data?: {
    id: string;
    name: string;
    slug: string;
    domain: string;
    industry: string;
    companySize: string;
    timezone: string;
    billingEmail: string;
    plan: string;
  };
  error?: string;
}

export interface DeleteOrganizationResult {
  success: boolean;
  error?: string;
}

export async function organizationsAction(
  data: OrganizationFormValues
): Promise<OrganizationResult> {
  try {
    // Obter o token do usuário logado
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    
    if (!token) {
      return {
        success: false,
        error: "Não autorizado. Faça login novamente.",
      };
    }

    // Decodificar o token para obter o email do usuário
    let userEmail = "";
    try {
      const decodedToken = jwtDecode(token) as { email?: string };
      userEmail = decodedToken.email || "";
      
      if (!userEmail) {
        return {
          success: false,
          error: "Email não encontrado no token. Faça login novamente.",
        };
      }
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      return {
        success: false,
        error: "Token inválido. Faça login novamente.",
      };
    }

    // Preparar dados para a API, incluindo campos padrão que podem estar faltando
    const organizationData = {
      ...data,
      // Definir valores padrão se não fornecidos
      domain: data.domain || "",
      industry: data.industry || "",
      companySize: data.companySize || "",
      billingEmail: userEmail, // Email do usuário logado
      plan: "BASIC" as const, // Plano padrão
    };

    const response = await organization.createWithToken(organizationData, token);

    return {
      success: true,
      data: {
        id: response.id,
        name: response.name,
        slug: response.slug,
        domain: response.domain,
        industry: response.industry,
        companySize: response.companySize,
        timezone: response.timezone,
        billingEmail: response.billingEmail,
        plan: response.plan,
      },
    };
  } catch (error: unknown) {
    console.error("Erro na criação da organização:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { 
        response?: { 
          status?: number; 
          data?: { message?: string };
        };
        message?: string;
      };


      if (axiosError.response?.status === 401) {
        return {
          success: false,
          error: "Não autorizado. Verifique se o token está válido.",
        };
      }

      if (axiosError.response?.status === 400) {
        return {
          success: false,
          error:
            "Dados inválidos fornecidos. Verifique os campos obrigatórios.",
        };
      }

      if (axiosError.response?.status === 409) {
        return {
          success: false,
          error: "Já existe uma organização com este slug ou domínio.",
        };
      }

      return {
        success: false,
        error: `Erro HTTP ${axiosError.response?.status}: ${axiosError.response?.data?.message || axiosError.message || "Erro desconhecido"}`,
      };
    }

    return {
      success: false,
      error: `Erro interno: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    };
  }
}

export async function deleteOrganizationAction(
  organizationId: string
): Promise<DeleteOrganizationResult> {
  try {
    // Obter o token do usuário logado
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    
    if (!token) {
      return {
        success: false,
        error: "Não autorizado. Faça login novamente.",
      };
    }

    await organization.deleteWithToken(organizationId, token);

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Erro na exclusão da organização:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { 
        response?: { 
          status?: number; 
          data?: { message?: string };
        };
        message?: string;
      };

      if (axiosError.response?.status === 401) {
        return {
          success: false,
          error: "Não autorizado. Verifique se o token está válido.",
        };
      }

      if (axiosError.response?.status === 403) {
        return {
          success: false,
          error: "Permissão insuficiente. Apenas proprietários podem excluir organizações.",
        };
      }

      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: "Organização não encontrada.",
        };
      }

      return {
        success: false,
        error: `Erro HTTP ${axiosError.response?.status}: ${axiosError.response?.data?.message || axiosError.message || "Erro desconhecido"}`,
      };
    }

    return {
      success: false,
      error: `Erro interno: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    };
  }
}
