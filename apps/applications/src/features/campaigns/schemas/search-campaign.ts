import { z } from "zod";

export const searchCampaignSchema = z.object({
  search: z.string().optional(),
  type: z.enum(["MKT", "SALES", "RETENTION", "UPSELL"]).optional(),
  branchType: z.enum(["MATRIZ", "FILIAL"]).optional(),
  clientId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type SearchCampaignValues = z.infer<typeof searchCampaignSchema>;
