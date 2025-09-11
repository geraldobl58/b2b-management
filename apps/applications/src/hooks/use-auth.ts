"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { cookieUtils } from "@/lib/cookies";

import { loginAction } from "../actions/auth";
import { FormAuthValues } from "../schemas/auth";
import { authentication } from "@/http/auth";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Query para buscar o perfil do usuário
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const userData = await authentication.getProfile();
        return userData;
      } catch (error) {
        // Se erro 401, remover token
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
            cookieUtils.removeToken();
          }
        }

        throw error; // Re-throw para que o React Query trate como erro
      }
    },
    enabled: cookieUtils.hasToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para fazer login
  const loginMutation = useMutation({
    mutationFn: async (credentials: FormAuthValues) => {
      const result = await loginAction(credentials);
      if (!result.success) {
        throw new Error(result.error || "Erro no login");
      }
      return result.data!;
    },
    onSuccess: (data) => {
      cookieUtils.setToken(data.access_token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/dashboard");
    },
  });

  // Função para fazer logout
  const logout = () => {
    cookieUtils.removeToken();
    queryClient.clear();
    router.push("/");
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoadingUser || loginMutation.isPending,
    login: loginMutation.mutate,
    logout,
    loginError: loginMutation.error?.message,
  };
};
