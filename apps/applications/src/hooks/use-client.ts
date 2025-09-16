"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/http/client";
import { cookieUtils } from "@/lib/cookies";
import { createClientAction } from "@/actions/client";
import { FormClientValues } from "@/schemas/client";
import { useState } from "react";

export const useClient = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const {
    data: clientResponse,
    isLoading: isLoadingClients,
    error,
  } = useQuery({
    queryKey: ["clients", page, limit, search],
    queryFn: async () => {
      try {
        const result = await client.getClients({ page, limit, search });
        return result;
      } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as {
            response?: { status?: number; data?: unknown };
          };
          if (axiosError.response?.status === 401) {
            cookieUtils.removeToken();
          }
        }
        throw error;
      }
    },
    enabled: cookieUtils.hasToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const clientMutation = useMutation({
    mutationFn: async (data: FormClientValues) => {
      const result = await createClientAction(data);
      if (!result.success) {
        throw new Error(result.error || "Erro ao criar cliente");
      }
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      router.push("/clients");
    },
  });

  return {
    // Client list data
    clients: clientResponse?.data || [],
    clientsMeta: clientResponse?.meta,
    isLoadingClients,
    error: error?.message,

    // Pagination controls
    page,
    limit,
    search,
    setPage,
    setLimit,
    setSearch,

    // Create client
    isLoading: clientMutation.isPending,
    createClient: clientMutation.mutate,
    createClientError: clientMutation.error?.message,
  };
};
