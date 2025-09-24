import { z } from "zod";

export const searchCampaignSchema = z.object({
  clientName: z.string().optional(),
  type: z.enum(["MKT", "SALES", "RETENTION", "UPSELL"]).optional(),
  branchType: z.enum(["MATRIZ", "FILIAL"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type SearchCampaignValues = z.infer<typeof searchCampaignSchema>;
