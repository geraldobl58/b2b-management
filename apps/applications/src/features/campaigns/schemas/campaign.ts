import { z } from "zod";

// Schema para contatos da campanha
export const contactSchema = z.object({
  personId: z.string().min(1, "ID da pessoa é obrigatório"),
  role: z.enum(["CAMPAIGN_MANAGER", "ADMIN", "USER"], {
    message: "Papel do contato é obrigatório",
  }),
});

// Schema para configurações de negócio
export const businessSchema = z.object({
  paymentMethod: z.enum(["CREDIT_CARD", "BANK_TRANSFER", "PIX", "BOLETO"], {
    message: "Método de pagamento é obrigatório",
  }),
  upfront: z.boolean(),
  daysToInvoice: z
    .number()
    .int()
    .min(1, "Dias para faturamento deve ser pelo menos 1")
    .max(365, "Dias para faturamento não pode exceder 365"),
  notes: z.string().optional().default(""),
  billingModel: z
    .string()
    .min(1, "Modelo de cobrança é obrigatório")
    .max(100, "Modelo de cobrança deve ter no máximo 100 caracteres"),
  estimateMonthly: z
    .number()
    .nonnegative("Estimativa mensal deve ser um valor positivo"),
  estimateAnnual: z
    .number()
    .nonnegative("Estimativa anual deve ser um valor positivo"),
  autoInvoicing: z.boolean(),
  priceCycle: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"], {
    message: "Ciclo de preço é obrigatório",
  }),
  deliveryType: z.enum(["DIGITAL", "PHYSICAL", "HYBRID"], {
    message: "Tipo de entrega é obrigatório",
  }),
  additional: z.boolean(),
  daysToDeliver: z
    .number()
    .int()
    .min(0, "Dias para entrega deve ser um valor positivo")
    .max(365, "Dias para entrega não pode exceder 365"),
  chargeFreight: z.boolean(),
  b2b: z.boolean(),
});

// Schema para configurações da campanha
export const configSchema = z.object({
  contractPending: z.boolean(),
  orderConfirmationEnabled: z.boolean(),
  confirmationTimeMinutes: z
    .number()
    .int()
    .min(1, "Tempo de confirmação deve ser pelo menos 1 minuto")
    .max(1440, "Tempo de confirmação não pode exceder 24 horas"),
  differentialFlow: z.boolean(),
  blockOrdersDuringCampaign: z.boolean(),
  delinquencyPolicy: z
    .string()
    .min(1, "Política de inadimplência é obrigatória")
    .max(500, "Política de inadimplência deve ter no máximo 500 caracteres"),
});

// Schema principal para criação de campanha
export const createCampaignSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nome da campanha deve ter pelo menos 2 caracteres")
      .max(100, "Nome da campanha deve ter no máximo 100 caracteres")
      .refine((v) => !/^\d+$/.test(v), {
        message: "Nome da campanha não pode ser apenas números",
      }),
    startDate: z
      .string()
      .min(1, "Data de início é obrigatória")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
    endDate: z
      .string()
      .min(1, "Data de fim é obrigatória")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
    city: z
      .string()
      .min(2, "Cidade deve ter pelo menos 2 caracteres")
      .max(50, "Cidade deve ter no máximo 50 caracteres")
      .refine((v) => !/^\d+$/.test(v), {
        message: "Cidade não pode ser apenas números",
      }),
    type: z.enum(["MKT", "SALES", "RETENTION", "UPSELL"], {
      message: "Tipo da campanha é obrigatório",
    }),
    branchType: z.enum(["MATRIZ", "FILIAL"], {
      message: "Tipo de filial é obrigatório",
    }),
    observations: z
      .string()
      .max(1000, "Observações devem ter no máximo 1000 caracteres")
      .optional(),
    clientId: z.string().min(1, "ID do cliente é obrigatório"),
    contractId: z.string().min(1, "ID do contrato é obrigatório"),
    contacts: z
      .array(contactSchema)
      .min(1, "Pelo menos um contato é obrigatório"),
    business: businessSchema,
    config: configSchema,
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate >= startDate;
    },
    {
      message: "Data de fim deve ser posterior ou igual à data de início",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return startDate >= today;
    },
    {
      message: "Data de início não pode ser no passado",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => {
      // Validar se estimativa anual é consistente com mensal
      const monthlyAnnualized = data.business.estimateMonthly * 12;
      const tolerance = monthlyAnnualized * 0.2; // 20% de tolerância
      return (
        Math.abs(data.business.estimateAnnual - monthlyAnnualized) <= tolerance
      );
    },
    {
      message: "Estimativa anual deve ser consistente com a estimativa mensal",
      path: ["business", "estimateAnnual"],
    }
  );

// Schema para atualização de campanha
export const updateCampaignSchema = createCampaignSchema
  .partial()
  .extend({
    id: z.string().min(1, "ID da campanha é obrigatório"),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return endDate >= startDate;
      }
      return true;
    },
    {
      message: "Data de fim deve ser posterior ou igual à data de início",
      path: ["endDate"],
    }
  );

// Schema para busca de campanhas
export const searchCampaignSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  type: z.enum(["MKT", "SALES", "RETENTION", "UPSELL"]).optional(),
  branchType: z.enum(["MATRIZ", "FILIAL"]).optional(),
  clientId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Tipos derivados dos schemas
export type CreateCampaignValues = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignValues = z.infer<typeof updateCampaignSchema>;
export type SearchCampaignValues = z.infer<typeof searchCampaignSchema>;
export type ContactValues = z.infer<typeof contactSchema>;
export type BusinessValues = z.infer<typeof businessSchema>;
export type ConfigValues = z.infer<typeof configSchema>;
