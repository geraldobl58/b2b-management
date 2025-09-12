import { z } from "zod";

export const formOrganizationSchema = z.object({
  name: z.string().min(5, { message: "O nome é obrigatório." }),
  slug: z
    .string()
    .min(5, { message: "O slug é obrigatório." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "O slug deve conter apenas letras minúsculas, números e hífens.",
    }),
  domain: z
    .string()
    .refine((val) => !val || /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val), {
      message: "O domínio deve ser válido (ex: empresa.com).",
    })
    .min(1, {
      message: "O domínio é obrigatório.",
    }),
  industry: z.string().min(1, { message: "A indústria é obrigatória." }),
  companySize: z
    .string()
    .min(1, { message: "O tamanho da empresa é obrigatório." }),
  timezone: z.string().min(1, { message: "O fuso horário é obrigatório." }),
});

export type OrganizationFormValues = z.infer<typeof formOrganizationSchema>;
