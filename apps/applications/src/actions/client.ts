"use server";

import { FormClientValues } from "@/schemas/client";
import { client } from "@/http/client";
import { handleApiError, ApiResponse } from "@/lib/error-handler";
import {
  Client,
  ClientListResponse,
  CreateClientRequest,
} from "@/types/client";

export async function createClientAction(
  data: FormClientValues
): Promise<ApiResponse<Client>> {
  try {
    const response = await client.createClient(data);
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
    const clientData = await client.getClients(params);
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
    const response = await client.getClientById(id);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    console.error("Erro ao buscar cliente:", error);
    return handleApiError(error);
  }
}

export async function updateClientAction(
  id: string,
  data: Partial<CreateClientRequest>
): Promise<ApiResponse<Client>> {
  try {
    const response = await client.updateClient(id, data);
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
    const response = await client.deleteClient(id);
    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    console.error("Erro ao deletar cliente:", error);
    return handleApiError(error);
  }
}
