"use client";

import { ReactNode } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

// Configure dayjs to use Portuguese locale globally
dayjs.locale("pt-br");

interface DatePickerProviderProps {
  children: ReactNode;
}

/**
 * Provider que centraliza a configuração do LocalizationProvider
 * para todos os componentes de data do sistema
 */
export const DatePickerProvider = ({ children }: DatePickerProviderProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      {children}
    </LocalizationProvider>
  );
};
