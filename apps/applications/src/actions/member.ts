"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { member } from "@/http/member";
import { memberInviteSchema, memberUpdateSchema } from "@/schemas/member";

export async function inviteMemberAction(
  organizationId: string,
  formData: FormData
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return {
      success: false,
      error: "Token de acesso não encontrado. Faça login novamente.",
      status: 401,
    };
  }

  try {
    const rawData = {
      email: formData.get("email") as string,
      role: formData.get("role") as string,
    };

    const validatedData = memberInviteSchema.parse(rawData);

    const response = await member.inviteWithToken(
      organizationId,
      validatedData,
      token
    );

    revalidateTag("members");
    revalidateTag(`organization-${organizationId}`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Erro ao convidar membro:", error);

    // Handle Zod validation errors first
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as {
        issues: Array<{ path: string[]; message: string }>;
      };
      return {
        success: false,
        error: zodError.issues.map((issue) => issue.message).join(", "),
        status: 400,
      };
    }

    // Handle Axios errors
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            statusCode?: number;
            error?: string;
          };
        };
      };

      const errorMessage = axiosError.response?.data?.message;
      const status = axiosError.response?.status;

      switch (status) {
        case 400:
          return {
            success: false,
            error: errorMessage || "Dados inválidos",
            status: 400,
          };
        case 401:
          return {
            success: false,
            error: "Não autorizado. Faça login novamente.",
            status: 401,
          };
        case 403:
          return {
            success: false,
            error:
              errorMessage ||
              "Você não tem permissão para convidar membros nesta organização.",
            status: 403,
          };
        case 404:
          return {
            success: false,
            error: errorMessage || "Usuário não encontrado com este email.",
            status: 404,
          };
        case 409:
          return {
            success: false,
            error: errorMessage || "Este usuário já é membro da organização.",
            status: 409,
          };
        default:
          return {
            success: false,
            error: errorMessage || "Erro interno do servidor. Tente novamente.",
            status: status || 500,
          };
      }
    }

    // Handle network errors or other unknown errors
    if (error && typeof error === "object" && "code" in error) {
      const networkError = error as { code?: string; message?: string };

      if (
        networkError.code === "ECONNREFUSED" ||
        networkError.code === "NETWORK_ERROR"
      ) {
        return {
          success: false,
          error:
            "Não foi possível conectar ao servidor. Verifique sua conexão.",
          status: 503,
        };
      }
    }

    // Fallback for any other errors
    return {
      success: false,
      error: "Erro interno do servidor. Tente novamente.",
      status: 500,
    };
  }
}

export async function updateMemberRoleAction(
  organizationId: string,
  memberId: string,
  formData: FormData
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return {
      success: false,
      error: "Token de acesso não encontrado. Faça login novamente.",
      status: 401,
    };
  }

  try {
    const rawData = {
      role: formData.get("role") as string,
    };

    const validatedData = memberUpdateSchema.parse(rawData);

    const response = await member.updateRoleWithToken(
      organizationId,
      memberId,
      validatedData,
      token
    );

    revalidateTag("members");
    revalidateTag(`organization-${organizationId}`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Erro ao atualizar função do membro:", error);

    // Handle Zod validation errors first
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as {
        issues: Array<{ path: string[]; message: string }>;
      };
      return {
        success: false,
        error: zodError.issues.map((issue) => issue.message).join(", "),
        status: 400,
      };
    }

    // Handle Axios errors
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            statusCode?: number;
            error?: string;
          };
        };
      };

      const errorMessage = axiosError.response?.data?.message;
      const status = axiosError.response?.status;

      switch (status) {
        case 400:
          return {
            success: false,
            error: errorMessage || "Dados inválidos",
            status: 400,
          };
        case 401:
          return {
            success: false,
            error: "Não autorizado. Faça login novamente.",
            status: 401,
          };
        case 403:
          return {
            success: false,
            error:
              errorMessage ||
              "Você não tem permissão para alterar funções nesta organização.",
            status: 403,
          };
        case 404:
          return {
            success: false,
            error: errorMessage || "Membro não encontrado.",
            status: 404,
          };
        default:
          return {
            success: false,
            error: errorMessage || "Erro interno do servidor. Tente novamente.",
            status: status || 500,
          };
      }
    }

    // Handle network errors or other unknown errors
    if (error && typeof error === "object" && "code" in error) {
      const networkError = error as { code?: string; message?: string };

      if (
        networkError.code === "ECONNREFUSED" ||
        networkError.code === "NETWORK_ERROR"
      ) {
        return {
          success: false,
          error:
            "Não foi possível conectar ao servidor. Verifique sua conexão.",
          status: 503,
        };
      }
    }

    // Fallback for any other errors
    return {
      success: false,
      error: "Erro interno do servidor. Tente novamente.",
      status: 500,
    };
  }
}

export async function removeMemberAction(
  organizationId: string,
  memberId: string
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return {
      success: false,
      error: "Token de acesso não encontrado. Faça login novamente.",
      status: 401,
    };
  }

  try {
    await member.removeWithToken(organizationId, memberId, token);

    revalidateTag("members");
    revalidateTag(`organization-${organizationId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erro ao remover membro:", error);

    // Handle Axios errors
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            statusCode?: number;
            error?: string;
          };
        };
      };

      const errorMessage = axiosError.response?.data?.message;
      const status = axiosError.response?.status;

      switch (status) {
        case 400:
          return {
            success: false,
            error: errorMessage || "Não é possível remover este membro.",
            status: 400,
          };
        case 401:
          return {
            success: false,
            error: "Não autorizado. Faça login novamente.",
            status: 401,
          };
        case 403:
          return {
            success: false,
            error:
              errorMessage ||
              "Você não tem permissão para remover membros desta organização.",
            status: 403,
          };
        case 404:
          return {
            success: false,
            error: errorMessage || "Membro não encontrado.",
            status: 404,
          };
        default:
          return {
            success: false,
            error: errorMessage || "Erro interno do servidor. Tente novamente.",
            status: status || 500,
          };
      }
    }

    // Handle network errors or other unknown errors
    if (error && typeof error === "object" && "code" in error) {
      const networkError = error as { code?: string; message?: string };

      if (
        networkError.code === "ECONNREFUSED" ||
        networkError.code === "NETWORK_ERROR"
      ) {
        return {
          success: false,
          error:
            "Não foi possível conectar ao servidor. Verifique sua conexão.",
          status: 503,
        };
      }
    }

    // Fallback for any other errors
    return {
      success: false,
      error: "Erro interno do servidor. Tente novamente.",
      status: 500,
    };
  }
}
