import { string, z } from "zod";

export const formContractSchema = z
  .object({
    clientId: string().uuid("Selecione um cliente válido"),
    name: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres"),
    partner: z
      .string()
      .min(2, "Nome do parceiro deve ter pelo menos 2 caracteres")
      .max(100, "Nome do parceiro deve ter no máximo 100 caracteres"),
    startDate: z.date().refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      {
        message: "Data de início não pode ser no passado",
      }
    ),
    endDate: z.date(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "Data de término deve ser posterior à data de início",
    path: ["endDate"],
  });

export type FormContractValues = z.infer<typeof formContractSchema>;
