export interface MemberResponse {
  id: string;
  userId: string;
  organizationId: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "ANALYST" | "VIEWER";
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface MemberInviteResponse {
  id: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "ANALYST" | "VIEWER";
  organizationId: string;
  createdAt: string;
  expiresAt: string;
}
