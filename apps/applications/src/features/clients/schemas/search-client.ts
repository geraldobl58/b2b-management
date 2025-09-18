import { z } from "zod";

export const searchClientSchema = z.object({
  cnpj: z.string().optional(),
  companyName: z.string().optional(),
  fantasyName: z.string().optional(),
  taxpayerType: z.string().optional(),
});

export type SearchClientValues = z.infer<typeof searchClientSchema>;

export const defaultSearchValues: SearchClientValues = {
  cnpj: "",
  companyName: "",
  fantasyName: "",
  taxpayerType: "",
};
