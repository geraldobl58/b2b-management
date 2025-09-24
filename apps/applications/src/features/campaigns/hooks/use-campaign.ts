"use client";

import { useCallback, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cookieUtils } from "@/lib/cookies";
import {
  createCampaignAction,
  activateCampaignAction,
  deactivateCampaignAction,
  getCampaignStatsAction,
  exportCampaignDataAction,
} from "@/features/campaigns/actions/campaign";
import {
  CreateCampaignValues,
  SearchCampaignValues,
} from "@/features/campaigns/schemas/campaign";
import { campaign } from "../http/campaign";

interface UseCampaignParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: "MKT" | "SALES" | "RETENTION" | "UPSELL";
  branchType?: "MATRIZ" | "FILIAL";
  clientId?: string;
  startDate?: string;
  endDate?: string;
}

export const useCampaign = (initialParams?: UseCampaignParams) => {
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

  const [search, setSearch] = useState(() => {
    return searchParams.get("search") || initialParams?.search || "";
  });

  const [type, setType] = useState(() => {
    const typeParam = searchParams.get("type") as
      | "MKT"
      | "SALES"
      | "RETENTION"
      | "UPSELL"
      | null;
    return typeParam || initialParams?.type || undefined;
  });

  const [branchType, setBranchType] = useState(() => {
    const branchTypeParam = searchParams.get("branchType") as
      | "MATRIZ"
      | "FILIAL"
      | null;
    return branchTypeParam || initialParams?.branchType || undefined;
  });

  const [clientId, setClientId] = useState(() => {
    return searchParams.get("clientId") || initialParams?.clientId || "";
  });

  const [startDate, setStartDate] = useState(() => {
    return searchParams.get("startDate") || initialParams?.startDate || "";
  });

  const [endDate, setEndDate] = useState(() => {
    return searchParams.get("endDate") || initialParams?.endDate || "";
  });

  // Update URL when search params change
  const updateURL = useCallback(
    (params: {
      search?: string;
      type?: string;
      branchType?: string;
      clientId?: string;
      startDate?: string;
      endDate?: string;
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
    (filters: SearchCampaignValues) => {
      const newFilters = {
        search: filters.search || "",
        type: filters.type || "",
        branchType: filters.branchType || "",
        clientId: filters.clientId || "",
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
        page: 1, // Reset to first page when applying filters
        limit,
      };

      setPage(1);
      setSearch(filters.search || "");
      setType(filters.type);
      setBranchType(filters.branchType);
      setClientId(filters.clientId || "");
      setStartDate(filters.startDate || "");
      setEndDate(filters.endDate || "");

      updateURL(newFilters);
    },
    [updateURL, limit]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setPage(1);
    setSearch("");
    setType(undefined);
    setBranchType(undefined);
    setClientId("");
    setStartDate("");
    setEndDate("");

    updateURL({
      search: "",
      type: "",
      branchType: "",
      clientId: "",
      startDate: "",
      endDate: "",
      page: 1,
      limit,
    });
  }, [limit, updateURL]);

  // Generate query key for caching
  const queryKey = useMemo(
    () => [
      "campaigns",
      {
        page,
        limit,
        search,
        type,
        branchType,
        clientId,
        startDate,
        endDate,
      },
    ],
    [page, limit, search, type, branchType, clientId, startDate, endDate]
  );

  // Fetch campaigns data
  const {
    data: campaignResponse,
    isLoading: isLoadingCampaigns,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await campaign.getCampaigns({
          page,
          limit,
          search: search || undefined,
          type,
          branchType,
          clientId: clientId || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
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

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (data: CreateCampaignValues) => {
      const result = await createCampaignAction(data);
      if (!result.success) {
        throw new Error(result.error || "Erro ao criar campanha");
      }
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });

  // Activate campaign mutation
  const activateCampaignMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await activateCampaignAction(id);
      if (!result.success) {
        throw new Error(result.error || "Erro ao ativar campanha");
      }
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });

  // Deactivate campaign mutation
  const deactivateCampaignMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deactivateCampaignAction(id);
      if (!result.success) {
        throw new Error(result.error || "Erro ao desativar campanha");
      }
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });

  // Export campaign data mutation
  const exportCampaignMutation = useMutation({
    mutationFn: async ({
      id,
      format,
    }: {
      id: string;
      format: "csv" | "xlsx" | "pdf";
    }) => {
      const result = await exportCampaignDataAction(id, format);
      if (!result.success) {
        throw new Error(result.error || "Erro ao exportar dados da campanha");
      }
      return result.data!;
    },
  });

  return {
    // Campaign list data
    campaigns: campaignResponse?.data || [],
    campaignsMeta: campaignResponse?.meta,
    isLoadingCampaigns,
    error: error?.message,

    // Search and filter state
    page,
    limit,
    search,
    type,
    branchType,
    clientId,
    startDate,
    endDate,
    setPage: (newPage: number) => {
      setPage(newPage);
      updateURL({
        page: newPage,
        limit,
        search,
        type,
        branchType,
        clientId,
        startDate,
        endDate,
      });
    },
    setLimit: (newLimit: number) => {
      setLimit(newLimit);
      setPage(1); // Reset to first page when changing limit
      updateURL({
        page: 1,
        limit: newLimit,
        search,
        type,
        branchType,
        clientId,
        startDate,
        endDate,
      });
    },
    applyFilters,
    clearFilters,

    // Create campaign
    isCreating: createCampaignMutation.isPending,
    createCampaign: createCampaignMutation.mutate,
    createCampaignError: createCampaignMutation.error?.message,

    // Activate/Deactivate campaign
    isActivating: activateCampaignMutation.isPending,
    activateCampaign: activateCampaignMutation.mutate,
    activateCampaignError: activateCampaignMutation.error?.message,

    isDeactivating: deactivateCampaignMutation.isPending,
    deactivateCampaign: deactivateCampaignMutation.mutate,
    deactivateCampaignError: deactivateCampaignMutation.error?.message,

    // Export campaign data
    isExporting: exportCampaignMutation.isPending,
    exportCampaign: exportCampaignMutation.mutate,
    exportCampaignError: exportCampaignMutation.error?.message,
  };
};

// Hook for getting campaign by ID
export const useCampaignById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      try {
        const result = await campaign.getCampaignById(id);
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
    enabled: cookieUtils.hasToken() && !!id,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    campaign: data,
    isLoading,
    error: error?.message,
  };
};

// Hook for getting campaign statistics
export const useCampaignStats = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["campaign-stats", id],
    queryFn: async () => {
      const result = await getCampaignStatsAction(id);
      if (!result.success) {
        throw new Error(
          result.error || "Erro ao buscar estat�sticas da campanha"
        );
      }
      return result.data!;
    },
    enabled: cookieUtils.hasToken() && !!id,
    retry: false,
    staleTime: 2 * 60 * 1000, // 2 minutos (stats podem mudar mais frequentemente)
  });

  return {
    stats: data,
    isLoadingStats: isLoading,
    statsError: error?.message,
  };
};
