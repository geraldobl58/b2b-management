import { MemberInviteData, MemberUpdateData } from "@/schemas/member";
import api from "@/lib/api";
import { MemberResponse } from "@/types/member";

export const member = {
  async getAll(organizationId: string) {
    const response = await api.get<MemberResponse[]>(
      `/organizations/${organizationId}/members`
    );
    return response.data;
  },

  async getById(organizationId: string, memberId: string) {
    const response = await api.get<MemberResponse>(
      `/organizations/${organizationId}/members/${memberId}`
    );
    return response.data;
  },

  async inviteWithToken(
    organizationId: string,
    data: MemberInviteData,
    token: string
  ) {
    const response = await api.post<MemberResponse>(
      `/organizations/${organizationId}/members`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async updateRoleWithToken(
    organizationId: string,
    memberId: string,
    data: MemberUpdateData,
    token: string
  ) {
    const response = await api.patch<MemberResponse>(
      `/organizations/${organizationId}/members/${memberId}/role`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async removeWithToken(
    organizationId: string,
    memberId: string,
    token: string
  ) {
    await api.delete(`/organizations/${organizationId}/members/${memberId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Client-side methods using api instance with interceptors
  async invite(organizationId: string, data: MemberInviteData) {
    const response = await api.post<MemberResponse>(
      `/organizations/${organizationId}/members`,
      data
    );
    return response.data;
  },

  async updateRole(
    organizationId: string,
    memberId: string,
    data: MemberUpdateData
  ) {
    const response = await api.patch<MemberResponse>(
      `/organizations/${organizationId}/members/${memberId}/role`,
      data
    );
    return response.data;
  },

  async remove(organizationId: string, memberId: string) {
    await api.delete(`/organizations/${organizationId}/members/${memberId}`);
  },
};
