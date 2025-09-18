import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function handleApiError(error: unknown): ApiErrorResponse {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError;

    // Try to extract specific error message from response
    const responseData = axiosError.response?.data as { message?: string; error?: string } | undefined;
    const specificMessage = responseData?.message || responseData?.error;

    switch (axiosError.response?.status) {
      case 400:
        return {
          success: false,
          error: specificMessage || "Dados inválidos fornecidos",
        };
      case 401:
        return {
          success: false,
          error: specificMessage || "Token inválido ou expirado",
        };
      case 403:
        return {
          success: false,
          error: specificMessage || "Acesso negado",
        };
      case 404:
        return {
          success: false,
          error: specificMessage || "Recurso não encontrado",
        };
      case 409:
        return {
          success: false,
          error: specificMessage || "Já existe um cliente com esses dados (CNPJ pode estar duplicado)",
        };
      case 422:
        return {
          success: false,
          error: specificMessage || "Dados não processáveis",
        };
      case 500:
        return {
          success: false,
          error: specificMessage || "Erro interno do servidor",
        };
      default:
        return {
          success: false,
          error: specificMessage || `Erro do servidor: ${axiosError.response?.status || "Desconhecido"}`,
        };
    }
  }

  return {
    success: false,
    error: "Erro ao conectar com o servidor",
  };
}