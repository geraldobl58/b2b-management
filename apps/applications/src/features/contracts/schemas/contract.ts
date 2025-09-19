import { string, z } from "zod";

export const formContractSchema = z.object({
  clientId: string().uuid(),
  name: z.string().min(2).max(100).optional(),
  partner: z.string().min(2).max(100).optional(),
  startDate: z.date(),
  endDate: z.date(),
});

export type FormContractValues = z.infer<typeof formContractSchema>;
