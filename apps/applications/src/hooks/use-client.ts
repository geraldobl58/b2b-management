"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/http/client";
import { cookieUtils } from "@/lib/cookies";
import {
  createClientAction,
  deleteClientAction,
  updateClientAction,
} from "@/actions/client";
import { FormClientValues } from "@/schemas/client";
import { SearchClientValues } from "@/schemas/search-client";
import { useCallback, useState, useMemo } from "react";

interface UseClientParams {
  page?: number;
  limit?: number;
  cnpj?: string;
  companyName?: string;
  fantasyName?: string;
  taxpayerType?: string;
}

export const useClient = (initialParams?: UseClientParams) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // Initialize state from URL params or default values
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : initialParams?.page || 1;
  });

  const [limit, setLimit] = useState(() => {
    const limitParam = searchParams.get("limit");
    return limitParam ? parseInt(limitParam, 10) : initialParams?.limit || 10;
  });

  const [cnpj, setCnpj] = useState(() => {
    return searchParams.get("cnpj") || initialParams?.cnpj || "";
  });

  const [companyName, setCompanyName] = useState(() => {
    return searchParams.get("companyName") || initialParams?.companyName || "";
  });

  const [fantasyName, setFantasyName] = useState(() => {
    return searchParams.get("fantasyName") || initialParams?.fantasyName || "";
  });

  const [taxpayerType, setTaxpayerType] = useState(() => {
    return (
      searchParams.get("taxpayerType") || initialParams?.taxpayerType || ""
    );
  });

  // Update URL when search params change
  const updateURL = useCallback(
    (params: {
      cnpj?: string;
      companyName?: string;
      fantasyName?: string;
      taxpayerType?: string;
      page?: number;
      limit?: number;
    }) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "" && value !== 0) {
          newSearchParams.set(key, value.toString());
        } else {
          newSearchParams.delete(key);
        }
      });

      const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
      router.replace(newUrl);
    },
    [router, searchParams]
  );

  // Apply search filters
  const applyFilters = useCallback(
    (filters: SearchClientValues) => {
      const newFilters = {
        cnpj: filters.cnpj || "",
        companyName: filters.companyName || "",
        fantasyName: filters.fantasyName || "",
        taxpayerType: filters.taxpayerType || "",
        page: 1, // Reset to first page when applying filters
        limit,
      };

      setPage(1);
      setCnpj(filters.cnpj || "");
      setCompanyName(filters.companyName || "");
      setFantasyName(filters.fantasyName || "");
      setTaxpayerType(filters.taxpayerType || "");

      updateURL(newFilters);
    },
    [updateURL, limit]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setPage(1);
    setCnpj("");
    setCompanyName("");
    setFantasyName("");
    setTaxpayerType("");

    updateURL({
      cnpj: "",
      companyName: "",
      fantasyName: "",
      taxpayerType: "",
      page: 1,
      limit,
    });
  }, [limit, updateURL]);

  // Generate query key for caching
  const queryKey = useMemo(
    () => [
      "clients",
      {
        page,
        limit,
        cnpj,
        companyName,
        fantasyName,
        taxpayerType,
      },
    ],
    [page, limit, cnpj, companyName, fantasyName, taxpayerType]
  );

  // Fetch clients data
  const {
    data: clientResponse,
    isLoading: isLoadingClients,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await client.getClients({
          page,
          limit,
          cnpj: cnpj || undefined,
          companyName: companyName || undefined,
          fantasyName: fantasyName || undefined,
          taxpayerType: taxpayerType || undefined,
        });
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
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteClientAction(id);
      if (!result.success) {
        throw new Error(result.error || "Erro ao deletar cliente");
      }
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: FormClientValues;
    }) => {
      const result = await updateClientAction(id, data);
      if (!result.success) {
        throw new Error(result.error || "Erro ao atualizar cliente");
      }
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return {
    // Client list data
    clients: clientResponse?.data || [],
    clientsMeta: clientResponse?.meta,
    isLoadingClients,
    error: error?.message,

    // Search and filter state
    page,
    limit,
    cnpj,
    companyName,
    fantasyName,
    taxpayerType,
    setPage: (newPage: number) => {
      setPage(newPage);
      updateURL({
        page: newPage,
        limit,
        cnpj,
        companyName,
        fantasyName,
        taxpayerType,
      });
    },
    setLimit: (newLimit: number) => {
      setLimit(newLimit);
      setPage(1); // Reset to first page when changing limit
      updateURL({
        page: 1,
        limit: newLimit,
        cnpj,
        companyName,
        fantasyName,
        taxpayerType,
      });
    },
    applyFilters,
    clearFilters,

    // Create client
    isLoading: clientMutation.isPending,
    createClient: clientMutation.mutate,
    createClientError: clientMutation.error?.message,

    // Update client
    isUpdating: updateClientMutation.isPending,
    updateClient: updateClientMutation.mutate,
    updateClientError: updateClientMutation.error?.message,

    // Delete client
    isDeleting: deleteClientMutation.isPending,
    deleteClient: deleteClientMutation.mutateAsync,
    deleteClientError: deleteClientMutation.error?.message,
  };
};
