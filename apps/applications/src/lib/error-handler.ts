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

    switch (axiosError.response?.status) {
      case 400:
        return {
          success: false,
          error: "Dados inválidos fornecidos",
        };
      case 401:
        return {
          success: false,
          error: "Token inválido ou expirado",
        };
      case 403:
        return {
          success: false,
          error: "Acesso negado",
        };
      case 404:
        return {
          success: false,
          error: "Recurso não encontrado",
        };
      case 409:
        return {
          success: false,
          error: "Conflito de dados",
        };
      case 422:
        return {
          success: false,
          error: "Dados não processáveis",
        };
      case 500:
        return {
          success: false,
          error: "Erro interno do servidor",
        };
      default:
        return {
          success: false,
          error: `Erro do servidor: ${axiosError.response?.status || "Desconhecido"}`,
        };
    }
  }

  return {
    success: false,
    error: "Erro ao conectar com o servidor",
  };
}