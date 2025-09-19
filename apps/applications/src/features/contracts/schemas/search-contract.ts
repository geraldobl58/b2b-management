import { z } from "zod";

export const searchContractSchema = z.object({
  name: z.string().optional(),
  partner: z.string().optional(),
  clientName: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type SearchContractValues = z.infer<typeof searchContractSchema>;

export const defaultSearchValues: SearchContractValues = {
  name: "",
  partner: "",
  clientName: "",
  startDate: "",
  endDate: "",
};
