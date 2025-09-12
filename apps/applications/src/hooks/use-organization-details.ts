"use client";

import { useQuery } from "@tanstack/react-query";
import { organization } from "@/http/organization";
import { cookieUtils } from "@/lib/cookies";

export const useOrganizationDetails = (organizationId: string) => {
  const { data: organizationDetails, isLoading, error, refetch } = useQuery({
    queryKey: ["organization", organizationId],
    queryFn: async () => {
      try {
        const data = await organization.getById(organizationId);
        return data;
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
    enabled: !!organizationId && cookieUtils.hasToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    organization: organizationDetails,
    isLoading,
    error,
    refetch,
  };
};