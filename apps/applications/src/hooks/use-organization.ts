"use client";

import { useRouter } from "next/navigation";

import { organizationsAction } from "@/actions/organization";
import { organization } from "@/http/organization";
import { cookieUtils } from "@/lib/cookies";
import { OrganizationFormValues } from "@/schemas/organization";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useOrganization = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: organizations, isLoading: isLoadingOrganization } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      try {
        const organizationData = await organization.getAll();

        return organizationData;
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

  const organizationMutation = useMutation({
    mutationFn: async (data: OrganizationFormValues) => {
      const result = await organizationsAction(data);

      if (!result.success) {
        throw new Error(result.error || "Erro na criação da organização");
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      onSuccess?.(); // Chama callback personalizado se fornecido
      router.push("/organizations");
    },
  });

  return {
    organizations,
    isLoading: isLoadingOrganization || organizationMutation.isPending,
    createOrganization: organizationMutation.mutate,
    createOrganizationError: organizationMutation.error?.message,
  };
};
