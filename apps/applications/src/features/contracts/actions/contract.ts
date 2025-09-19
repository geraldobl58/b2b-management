"use server";

import { cookies } from "next/headers";
import { handleApiError, ApiResponse } from "@/config/error-handler";
import { FormContractValues } from "../schemas/contract";
import { Contract } from "../types/contract";
import { contract } from "../http/contract";

// Função helper para obter o token dos cookies
async function getTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

export async function createContractAction(
  data: FormContractValues
): Promise<ApiResponse<Contract>> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return {
        success: false,
        error: "Token de autenticação não encontrado",
      };
    }

    const response = await contract.createContract(data, token);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    console.error("Erro ao criar contrato:", error);
    return handleApiError(error);
  }
}
