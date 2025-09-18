"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchContractValues } from "../schemas/search-contract";
import { contract } from "../http/contract";
import { cookieUtils } from "@/lib/cookies";

interface UseContractParams {
  page?: number;
  limit?: number;
  name?: string;
  partner?: string;
}

export const useContract = (initialParams?: UseContractParams) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = new URLSearchParams();

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

  const updateURL = useCallback(
    (params: {
      page?: number;
      limit?: number;
      name?: string;
      partner?: string;
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
        name: filters.name || "",
        partner: filters.partner || "",
        page: 1, // Reset to first page on new filter
        limit,
      };

      setPage(1);
      setName(newFilters.name);
      setPartner(newFilters.partner);
      updateURL(newFilters);
    },
    [updateURL, limit]
  );

  const clearFilters = useCallback(() => {
    setPage(1);
    setName("");
    setPartner("");

    updateURL({
      page: 1,
      limit,
      name: "",
      partner: "",
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
      },
    ],
    [page, limit, name, partner]
  );

  const {
    data: contractsData,
    isLoading: isLoadingContracts,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await contract.getContracts({
          page,
          limit,
          name: name || undefined,
          partner: partner || undefined,
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
    setPage: (newPage: number) => {
      setPage(newPage);
      updateURL({
        page: newPage,
        limit,
        name,
        partner,
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
      });
    },
    applyFilters,
    clearFilters,
  };
};
