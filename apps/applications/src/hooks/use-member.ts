"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { member } from "@/http/member";
import {
  inviteMemberAction,
  updateMemberRoleAction,
  removeMemberAction,
} from "@/actions/member";
import { cookieUtils } from "@/lib/cookies";
import { MemberInviteData, MemberUpdateData } from "@/schemas/member";

export const useMembers = (organizationId: string) => {
  const {
    data: members,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["members", organizationId],
    queryFn: async () => {
      try {
        const data = await member.getAll(organizationId);
        return data;
      } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
            cookieUtils.removeToken();
          }
        }
        throw error;
      }
    },
    enabled: !!organizationId && cookieUtils.hasToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    members: members || [],
    isLoading,
    error,
    refetch,
  };
};

export const useMember = () => {
  const queryClient = useQueryClient();
  const [isInviting, setIsInviting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const inviteMember = async (
    organizationId: string,
    data: MemberInviteData,
    options?: {
      onSuccess?: (data: unknown) => void;
      onError?: (error: string) => void;
    }
  ) => {
    setIsInviting(true);
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("role", data.role);

      const result = await inviteMemberAction(organizationId, formData);

      if (result.success) {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({
          queryKey: ["members", organizationId],
        });
        queryClient.invalidateQueries({
          queryKey: ["organization", organizationId],
        });

        options?.onSuccess?.(result.data);
        return { success: true, data: result.data };
      } else {
        options?.onError?.(result.error);
        return { success: false, error: result.error };
      }
    } catch {
      const errorMessage = "Erro interno. Tente novamente.";
      options?.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsInviting(false);
    }
  };

  const updateMemberRole = async (
    organizationId: string,
    memberId: string,
    data: MemberUpdateData,
    options?: {
      onSuccess?: (data: unknown) => void;
      onError?: (error: string) => void;
    }
  ) => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("role", data.role);

      const result = await updateMemberRoleAction(
        organizationId,
        memberId,
        formData
      );

      if (result.success) {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({
          queryKey: ["members", organizationId],
        });
        queryClient.invalidateQueries({
          queryKey: ["organization", organizationId],
        });

        options?.onSuccess?.(result.data);
        return { success: true, data: result.data };
      } else {
        options?.onError?.(result.error);
        return { success: false, error: result.error };
      }
    } catch {
      const errorMessage = "Erro interno. Tente novamente.";
      options?.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  };

  const removeMember = async (
    organizationId: string,
    memberId: string,
    options?: {
      onSuccess?: () => void;
      onError?: (error: string) => void;
    }
  ) => {
    setIsRemoving(true);
    try {
      const result = await removeMemberAction(organizationId, memberId);

      if (result.success) {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({
          queryKey: ["members", organizationId],
        });
        queryClient.invalidateQueries({
          queryKey: ["organization", organizationId],
        });

        options?.onSuccess?.();
        return { success: true };
      } else {
        options?.onError?.(result.error);
        return { success: false, error: result.error };
      }
    } catch {
      const errorMessage = "Erro interno. Tente novamente.";
      options?.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsRemoving(false);
    }
  };

  return {
    inviteMember,
    updateMemberRole,
    removeMember,
    isInviting,
    isUpdating,
    isRemoving,
  };
};
