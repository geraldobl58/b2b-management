import { z } from "zod";

// Validação de CNPJ
const cnpjValidation = z
  .string()
  .min(1, "CNPJ é obrigatório")
  .regex(
    /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    "CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX"
  )
  .refine((cnpj) => {
    // Remove formatação
    const digits = cnpj.replace(/[^\d]/g, "");

    // CNPJ deve ter 14 dígitos
    if (digits.length !== 14) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(digits)) return false;

    // Validação dos dígitos verificadores
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const base = digits.slice(0, 12);

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(base[i]) * weights1[i];
    }
    const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(digits[i]) * weights2[i];
    }
    const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    return digit1 === parseInt(digits[12]) && digit2 === parseInt(digits[13]);
  }, "CNPJ inválido");

// Validação de telefone brasileiro (formato e quantidade de dígitos)
const phoneValidation = z
  .string()
  .min(1, "Número de telefone é obrigatório")
  .regex(
    /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/,
    "Telefone deve estar no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX"
  );

// garante 10 ou 11 dígitos após remover formatação
const phoneValidationStrict = phoneValidation.refine((phone) => {
  const digits = phone.replace(/[^\d]/g, "");
  return digits.length === 10 || digits.length === 11;
}, "Telefone deve conter 10 ou 11 dígitos (somente números)");

export const formClientSchema = z.object({
  cnpj: cnpjValidation,
  companyName: z
    .string()
    .min(2, { message: "O nome da empresa deve ter pelo menos 2 caracteres." })
    .refine((v) => !/^\d+$/.test(v), {
      message: "O nome da empresa não pode ser apenas números.",
    }),
  fantasyName: z
    .string()
    .min(2, { message: "O nome fantasia deve ter pelo menos 2 caracteres." })
    .refine((v) => !/^\d+$/.test(v), {
      message: "O nome fantasia não pode ser apenas números.",
    }),
  taxpayerType: z.enum([
    "INSENTO",
    "MEI",
    "SIMPLES_NACIONAL",
    "LUCRO_PRESUMIDO",
    "LUCRO_REAL",
  ]),
  stateRegistration: z.string().optional().or(z.literal("")),
  typeRelationship: z.string().optional().or(z.literal("")),
  phones: z
    .array(
      z.object({
        type: z.enum(["LANDLINE", "MOBILE"]),
        number: phoneValidationStrict,
      })
    )
    .min(1, { message: "Pelo menos um telefone é obrigatório." }),
  addresses: z
    .array(
      z.object({
        zipcode: z
          .string()
          .min(1, { message: "CEP é obrigatório." })
          .regex(/^[0-9]{5}-?[0-9]{3}$/, { message: "CEP inválido." })
          .optional()
          .or(z.literal("")),
        street: z
          .string()
          .min(1, { message: "A rua é obrigatória." })
          .refine((v) => !/^\d+$/.test(v), {
            message: "A rua não pode ser apenas números.",
          })
          .optional()
          .or(z.literal("")),
        number: z
          .string()
          .min(1, { message: "O número é obrigatório." })
          .regex(/^\d+$/, { message: "O número deve conter apenas dígitos." })
          .optional()
          .or(z.literal("")),
        complement: z.string().optional().or(z.literal("")),
        district: z
          .string()
          .min(1, { message: "O bairro é obrigatório." })
          .refine((v) => !/^\d+$/.test(v), {
            message: "O bairro não pode ser apenas números.",
          })
          .optional()
          .or(z.literal("")),
        city: z
          .string()
          .min(1, { message: "A cidade é obrigatória." })
          .refine((v) => !/^\d+$/.test(v), {
            message: "A cidade não pode ser apenas números.",
          })
          .optional()
          .or(z.literal("")),
        state: z
          .string()
          .min(1, { message: "O estado é obrigatório." })
          .length(2, "Estado deve ter 2 caracteres (sigla)")
          .toUpperCase()
          .optional()
          .or(z.literal("")),
      })
    )
    .optional(),
});

export type FormClientValues = z.infer<typeof formClientSchema>;
