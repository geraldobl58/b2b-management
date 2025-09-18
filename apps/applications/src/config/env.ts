import { z } from "zod";

export const env = {
  BASE_API_URL: z
    .string()
    .url("A variável de ambiente NEXT_PUBLIC_API_URL deve ser uma URL válida")
    .default("http://localhost:3333")
    .parse(process.env.NEXT_PUBLIC_API_URL),
};
