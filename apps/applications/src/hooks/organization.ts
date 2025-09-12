"use client";

import { organization } from "@/http/organization";
import { cookieUtils } from "@/lib/cookies";
import { useQuery } from "@tanstack/react-query";

export const useOrganization = () => {
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

  return {
    organizations,
    isLoading: isLoadingOrganization,
  };
};
