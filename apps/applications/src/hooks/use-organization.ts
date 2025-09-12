"use client";

import { useRouter } from "next/navigation";

import { organizationsAction, deleteOrganizationAction, updateOrganizationAction } from "@/actions/organization";
import { organization } from "@/http/organization";
import { cookieUtils } from "@/lib/cookies";
import { OrganizationFormValues } from "@/schemas/organization";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UseOrganizationOptions {
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

export const useOrganization = (options?: UseOrganizationOptions) => {
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
      options?.onCreateSuccess?.(); // Chama callback personalizado se fornecido
      router.push("/organizations");
    },
  });

  const deleteOrganizationMutation = useMutation({
    mutationFn: async (organizationId: string) => {
      const result = await deleteOrganizationAction(organizationId);

      if (!result.success) {
        throw new Error(result.error || "Erro na exclusão da organização");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      options?.onDeleteSuccess?.(); // Chama callback personalizado se fornecido
    },
  });

  const updateOrganizationMutation = useMutation({
    mutationFn: async ({ organizationId, data }: { organizationId: string; data: OrganizationFormValues }) => {
      const result = await updateOrganizationAction(organizationId, data);

      if (!result.success) {
        throw new Error(result.error || "Erro na atualização da organização");
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      options?.onUpdateSuccess?.(); // Chama callback personalizado se fornecido
    },
  });

  return {
    organizations,
    isLoading: isLoadingOrganization || organizationMutation.isPending,
    createOrganization: organizationMutation.mutate,
    createOrganizationError: organizationMutation.error?.message,
    // Delete functionality
    deleteOrganization: deleteOrganizationMutation.mutate,
    isDeleting: deleteOrganizationMutation.isPending,
    deleteOrganizationError: deleteOrganizationMutation.error?.message,
    // Update functionality
    updateOrganization: updateOrganizationMutation.mutate,
    isUpdating: updateOrganizationMutation.isPending,
    updateOrganizationError: updateOrganizationMutation.error?.message,
  };
};
