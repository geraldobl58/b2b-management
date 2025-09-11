"use server";

import { authentication } from "@/http/auth";
import { FormAuthValues } from "../schemas/auth";

export interface LoginResult {
  success: boolean;
  data?: {
    access_token: string;
  };
  error?: string;
}

export async function loginAction(
  credentials: FormAuthValues
): Promise<LoginResult> {
  try {
    const response = await authentication.login(credentials);

    return {
      success: true,
      data: {
        access_token: response.access_token,
      },
    };
  } catch (error: unknown) {
    console.error("Erro no login:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number } };

      if (axiosError.response?.status === 401) {
        return {
          success: false,
          error: "Email ou senha incorretos",
        };
      }

      if (axiosError.response?.status === 400) {
        return {
          success: false,
          error: "Dados inválidos fornecidos",
        };
      }
    }

    return {
      success: false,
      error: "Erro interno do servidor. Tente novamente.",
    };
  }
}

export async function getProfileAction() {
  try {
    const user = await authentication.getProfile();

    return {
      success: true,
      data: user,
    };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: unknown };
      };

      if (axiosError.response?.status === 401) {
        return {
          success: false,
          error: "Token inválido ou expirado",
        };
      }

      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      return {
        success: false,
        error: `Erro do servidor: ${axiosError.response?.status || "Desconhecido"}`,
      };
    }

    return {
      success: false,
      error: "Erro ao conectar com o servidor",
    };
  }
}
