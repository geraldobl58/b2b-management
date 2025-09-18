"use server";

import { cookies } from "next/headers";
import { FormClientValues } from "@/features/clients/schemas/client";
import { client } from "@/features/clients/http/client";
import { handleApiError, ApiResponse } from "@/config/error-handler";
import { Client, ClientListResponse } from "@/features/clients/types/client";

// Função helper para obter o token dos cookies
async function getTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

export async function createClientAction(
  data: FormClientValues
): Promise<ApiResponse<Client>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticação não encontrado",
      };
    }

    const response = await client.createClient(data, token);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    console.error("Erro ao criar cliente:", error);
    return handleApiError(error);
  }
}

export async function getClientsAction(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse<ClientListResponse>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticação não encontrado",
      };
    }

    const clientData = await client.getClients(params, token);
    return {
      success: true,
      data: clientData,
    };
  } catch (error: unknown) {
    console.error("Erro ao buscar clientes:", error);
    return handleApiError(error);
  }
}

export async function getClientByIdAction(
  id: string
): Promise<ApiResponse<Client>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticação não encontrado",
      };
    }

    const clientData = await client.getClientById(id, token);
    return {
      success: true,
      data: clientData,
    };
  } catch (error: unknown) {
    console.error("Erro ao buscar cliente:", error);
    return handleApiError(error);
  }
}

export async function updateClientAction(
  id: string,
  data: FormClientValues
): Promise<ApiResponse<Client>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticação não encontrado",
      };
    }

    const response = await client.updateClient(id, data, token);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    console.error("Erro ao atualizar cliente:", error);
    return handleApiError(error);
  }
}

export async function deleteClientAction(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticação não encontrado",
      };
    }

    const response = await client.deleteClient(id, token);
    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    console.error("Erro ao deletar cliente:", error);
    return handleApiError(error);
  }
}
