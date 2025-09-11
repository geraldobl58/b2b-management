import { z } from "zod";

// Schema que corresponde exatamente ao DTO do backend
export const formAuthSchema = z.object({
  email: z.string().email({
    message: "O e-mail deve ser válido.",
  }),
  password: z
    .string()
    .min(6, {
      message: "A senha deve ter no mínimo 6 caracteres.",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message:
        "A senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 símbolo.",
    }),
});

export type FormAuthValues = z.infer<typeof formAuthSchema>;
