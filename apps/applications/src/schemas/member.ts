import { z } from "zod";

export const memberInviteSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  role: z.enum(["OWNER", "ADMIN", "MANAGER", "ANALYST", "VIEWER"], {
    message: "Função inválida",
  }),
});

export const memberUpdateSchema = z.object({
  role: z.enum(["OWNER", "ADMIN", "MANAGER", "ANALYST", "VIEWER"], {
    message: "Função inválida",
  }),
});

export type MemberInviteData = z.infer<typeof memberInviteSchema>;
export type MemberUpdateData = z.infer<typeof memberUpdateSchema>;