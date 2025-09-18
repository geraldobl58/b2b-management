import axios from "axios";
import { cookieUtils } from "@/lib/cookies";
import { env } from "./env";

const api = axios.create({
  baseURL: env.BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token de autorização nas requisições
api.interceptors.request.use(
  (config) => {
    // Se já existe um token no header (passado manualmente), usa esse
    if (config.headers.Authorization) {
      return config;
    }

    // Caso contrário, tenta pegar do cookie (client-side)
    const token = cookieUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas de erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401, remover token inválido
    if (error.response?.status === 401) {
      cookieUtils.removeToken();
    }
    return Promise.reject(error);
  }
);

// Função para fazer requisições com token manual (útil para server actions)
export const createApiWithToken = (token: string) => {
  return axios.create({
    baseURL: env.BASE_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export default api;
