"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchContractValues } from "../schemas/search-contract";
import { contract } from "../http/contract";
import { cookieUtils } from "@/lib/cookies";
import { FormContractValues } from "../schemas/contract";
import { createContractAction } from "../actions/contract";

interface UseContractParams {
  page?: number;
  limit?: number;
  name?: string;
  partner?: string;
  clientName?: string;
  startDate?: string;
  endDate?: string;
}

export const useContract = (initialParams?: UseContractParams) => {
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

  const [name, setName] = useState(() => {
    return searchParams.get("name") || initialParams?.name || "";
  });

  const [partner, setPartner] = useState(() => {
    return searchParams.get("partner") || initialParams?.partner || "";
  });

  const [clientName, setClientName] = useState(() => {
    return searchParams.get("clientName") || initialParams?.clientName || "";
  });

  const [startDate, setStartDate] = useState(() => {
    return searchParams.get("startDate") || initialParams?.startDate || "";
  });

  const [endDate, setEndDate] = useState(() => {
    return searchParams.get("endDate") || initialParams?.endDate || "";
  });

  const updateURL = useCallback(
    (params: {
      page?: number;
      limit?: number;
      name?: string;
      partner?: string;
      clientName?: string;
      startDate?: string;
      endDate?: string;
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

  const applyFilters = useCallback(
    (filters: SearchContractValues) => {
      const newFilters = {
        page: 1, // Reset to first page on new filter
        limit,
        name: filters.name || "",
        partner: filters.partner || "",
        clientName: filters.clientName || "",
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
      };

      setPage(1);
      setName(newFilters.name);
      setPartner(newFilters.partner);
      setClientName(newFilters.clientName);
      setStartDate(newFilters.startDate);
      setEndDate(newFilters.endDate);
      updateURL(newFilters);
    },
    [updateURL, limit]
  );

  const clearFilters = useCallback(() => {
    setPage(1);
    setName("");
    setPartner("");
    setClientName("");
    setStartDate("");
    setEndDate("");

    updateURL({
      page: 1,
      limit,
      name: "",
      partner: "",
      clientName: "",
      startDate: "",
      endDate: "",
    });
  }, [limit, updateURL]);

  const queryKey = useMemo(
    () => [
      "contracts",
      {
        page,
        limit,
        name,
        partner,
        clientName,
        startDate,
        endDate,
      },
    ],
    [page, limit, name, partner, clientName, startDate, endDate]
  );

  const {
    data: contractsData,
    isLoading: isLoadingContracts,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const token = cookieUtils.getToken();

        const params = {
          page,
          limit,
          name: name || undefined,
          partner: partner || undefined,
          clientName: clientName || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        };

        const result = await contract.getContracts(params, token);

        return result;
      } catch (error) {
        console.error("API error:", error);
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

  const contractMutation = useMutation({
    mutationFn: async (data: FormContractValues) => {
      const result = await createContractAction(data);
      if (!result.success) {
        throw new Error(result.error || "Erro ao criar contrato");
      }
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });

  return {
    contracts: contractsData?.data || [],
    contractsMeta: contractsData?.meta,
    isLoadingContracts,
    error: error?.message,

    // SEARCH & FILTERS
    page,
    limit,
    name,
    partner,
    clientName,
    startDate,
    endDate,
    setPage: (newPage: number) => {
      setPage(newPage);
      updateURL({
        page: newPage,
        limit,
        name,
        partner,
        clientName,
        startDate,
        endDate,
      });
    },
    setLimit: (newLimit: number) => {
      setLimit(newLimit);
      setPage(1); // Reset to first page when limit changes
      updateURL({
        page: 1,
        limit: newLimit,
        name,
        partner,
        clientName,
        startDate,
        endDate,
      });
    },
    applyFilters,
    clearFilters,

    // CREATE CONTRACT
    createContract: contractMutation.mutate,
    isCreatingContract: contractMutation.isPending,
    createContractError: contractMutation.error?.message,
  };
};
